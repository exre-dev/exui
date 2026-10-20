import assert from "node:assert/strict"
import { spawn as realSpawn, spawnSync } from "node:child_process"
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const runner = new URL("../../../../scripts/tasks.mjs", import.meta.url)

// Replace only the expensive subprocess boundary. Real child processes retain
// argument, cwd, environment, exit and close behavior; no test files are generated.
async function exercise(t, mode, files = [], { fail = "", env = {} } = {}) {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "exui tasks "))
  t.after(() => rm(temporary, { recursive: true, force: true }))
  const output = path.join(temporary, "events.jsonl")
  const cli = path.join(temporary, "fake cli.mjs")
  await writeFile(cli, `
import { appendFileSync } from "node:fs"
const [command, ...args] = process.argv.slice(2)
appendFileSync(process.env.TASK_EVENTS, JSON.stringify({ command, args, cwd: process.cwd(), base: process.env.EXUI_DOCS_BASE }) + "\\n")
if (args.includes(process.env.TASK_FAIL)) process.exitCode = 7
`)
  const logs = []
  const { runTasks } = await import(runner.href)
  let error
  try {
    await runTasks(mode, files, {
      env: { ...process.env, npm_execpath: cli, TASK_EVENTS: output, TASK_FAIL: fail, ...env },
      log: (message) => logs.push(message),
      spawn: (command, args, options) => realSpawn(process.execPath, [cli, command, ...args], { ...options, stdio: "ignore" }),
    })
  } catch (caught) {
    error = caught
  }
  const events = (await readFile(output, "utf8").catch(() => "")).trim().split("\n").filter(Boolean).map(JSON.parse)
  return { events, logs, error, cli }
}

const has = (event, value) => event.args.includes(value)
const index = (events, value) => events.findIndex((event) => has(event, value))

for (const mode of ["check", "test"]) test(`${mode} prepares current public artifacts once and runs fast Node and SSR regressions`, async (t) => {
  const { events, error } = await exercise(t, mode)
  assert.ifError(error)
  const tests = events.filter((event) => has(event, "--test"))
  assert.equal(tests.length, 1, "fast regressions must run once")
  assert.ok(has(tests[0], "packages/docs/tests/node/docs-example-copy-ssr.test.mjs"), "public SSR belongs to fast checks")
  assert.ok(has(tests[0], "packages/docs/tests/node/docs-snippets.test.mjs"), "pure snippet helpers belong to fast checks")
  const { fastNodeTests, integrationNodeTests } = await import("../../../../scripts/test-suites.mjs")
  assert.deepEqual(tests[0].args, ["--test", "--test-concurrency=2", ...fastNodeTests])
  for (const suite of integrationNodeTests) assert.ok(!has(tests[0], suite), suite)
  assert.ok(!has(tests[0], "packages/*/tests/**/*.test.mjs"))
  for (const item of ["build:js", "build:cjs", "check:built"]) assert.equal(events.filter((event) => has(event, item)).length, 1, item)
  const builds = events.filter((event) => has(event, "@exre/exui") && has(event, "build"))
  assert.equal(builds.length, 1, "prepare the public package exactly once")
  assert.ok(index(events, "build:js") < index(events, "build:cjs"))
  assert.ok(index(events, "build:cjs") < index(events, "check:built"))
  assert.ok(index(events, "check:built") < index(events, "build"))
  assert.ok(index(events, "build") < index(events, "--test"))
  assert.equal(index(events, "build:types"), -1, "component build already emits declarations")
  assert.ok(!events.some((event) => has(event, "@exre/exui") && has(event, "typecheck")), "component build already checks its types")
  const docsTypes = events.findIndex((event) => has(event, "@exre/exui-docs") && has(event, "typecheck"))
  if (mode === "check") assert.ok(index(events, "build") < docsTypes)
  else assert.equal(docsTypes, -1)
  for (const event of events) {
    assert.ok(!(has(event, "@exre/exui-docs") && has(event, "build")), JSON.stringify(event))
    assert.ok(!event.args.some((arg) => /verify-docs-|verify-packages|verify-examples|scripts\/docs-example-styles\.mjs|scripts\/docs-snippets\.mjs|test:visual/.test(arg)), JSON.stringify(event))
  }
  for (const source of ["lint", "scripts/reui-sync.mjs", "scripts/reui-exports.mjs", "scripts/reui-foundation-diff.mjs", "scripts/generate-reui-luma.mjs", "scripts/docs-content.mjs", "scripts/docs-examples.mjs", "scripts/docs-example-assets.mjs", "scripts/exui-capabilities.mjs", "scripts/exui-skill/sync-references.mjs", "scripts/exui-skill/update-inventories.mjs", "scripts/exui-skill/verify.mjs"]) {
    assert.equal(index(events, source) >= 0, mode === "check", source)
  }
})

test("failed token checks stop before declarations, consumers and later gates", async (t) => {
  const { events, error, logs } = await exercise(t, "check", [], { fail: "check:built" })
  assert.match(error?.message ?? "", /7/)
  assert.equal(index(events, "build:types"), -1)
  assert.equal(index(events, "scripts/docs-content.mjs"), -1)
  assert.ok(logs.some((line) => /Token/.test(line)))
})

for (const mode of ["check", "test"]) test(`${mode} reports fast regression failures without continuing to integration gates`, async (t) => {
  const { events, error } = await exercise(t, mode, [], { fail: "packages/docs/tests/node/docs-example-copy-ssr.test.mjs" })
  assert.match(error?.message ?? "", /Fast Node and SSR regressions exited with 7/)
  assert.equal(events.filter((event) => has(event, "--test")).length, 1)
  assert.ok(has(events.at(-1), "--test"))
  assert.ok(!events.some((event) => has(event, "test:visual") || has(event, "packages/components/tests/consumers/verify-packages.mjs")))
})

test("a failed public-package build stops check before docs types and fast regressions", async (t) => {
  const { events, error } = await exercise(t, "check", [], { fail: "build" })
  assert.match(error?.message ?? "", /Build components exited with 7/)
  assert.ok(!events.some((event) => has(event, "@exre/exui-docs")))
  assert.equal(index(events, "--test"), -1)
})

test("focused test paths are passed literally after one public-package preparation", async (t) => {
  const files = ["packages/docs/tests/node/docs-content.test.mjs", "a folder/literal & name.test.mjs"]
  const { events, error } = await exercise(t, "test:node", files)
  assert.ifError(error)
  const tests = events.filter((event) => has(event, "--test"))
  assert.equal(tests.length, 1)
  assert.deepEqual(tests[0].args, ["--test", "--test-concurrency=2", ...files])
  assert.equal(events.filter((event) => has(event, "build:js")).length, 1)
  assert.equal(events.filter((event) => has(event, "@exre/exui") && has(event, "build")).length, 1)
  assert.ok(index(events, "build") < index(events, "--test"))
})

test("unselected test:node retains every Node suite after public-package preparation", async (t) => {
  const { events, error } = await exercise(t, "test:node")
  assert.ifError(error)
  assert.deepEqual(events.at(-1).args, ["--test", "--test-concurrency=2", "packages/*/tests/**/*.test.mjs"])
  for (const item of ["build:js", "build:cjs", "check:built"]) assert.equal(events.filter((event) => has(event, item)).length, 1, item)
  assert.equal(events.filter((event) => has(event, "@exre/exui") && has(event, "build")).length, 1)
  assert.equal(events.filter((event) => has(event, "--test")).length, 1)
})

test("verify includes every regression and builds each prerequisite only once", async (t) => {
  const { events, error } = await exercise(t, "verify", [], { env: { EXUI_DOCS_BASE: "/unexpected/" } })
  assert.ifError(error)
  for (const item of ["build:js", "build:cjs", "check:built"]) assert.equal(events.filter((event) => has(event, item)).length, 1, item)
  assert.equal(events.filter((event) => has(event, "@exre/exui") && has(event, "build")).length, 1)
  assert.equal(index(events, "build:types"), -1, "component build already emits declarations")
  const tests = events.filter((event) => has(event, "--test"))
  assert.equal(tests.length, 1)
  assert.deepEqual(tests[0].args, ["--test", "--test-concurrency=2", "packages/*/tests/**/*.test.mjs"])
  for (const gate of ["scripts/docs-example-styles.mjs", "scripts/docs-snippets.mjs", "packages/components/tests/tooling/skill/verify-examples.mjs", "packages/components/tests/consumers/verify-packages.mjs", "test:visual"]) assert.ok(index(events, gate) >= 0, gate)
  for (const gate of ["lint", "scripts/release-bootstrap/verify.mjs", "scripts/reui-sync.mjs", "git"]) {
    assert.ok(index(events, gate) >= 0, `${gate} belongs to verification`)
  }
  const tail = events.slice(-3)
  assert.ok(has(tail[0], "@exre/exui-docs") && has(tail[0], "build"))
  assert.equal(tail[0].base, "/exui/")
  assert.deepEqual(tail[1].args, ["packages/docs/tests/integration/verify-docs-static.mjs", "packages/docs/build/client", "/exui/"])
  assert.deepEqual(tail[2].args, ["packages/docs/tests/integration/verify-docs-sharing.mjs", "packages/docs/build/client", "/exui/"])
  const rootBuild = events.find((event) => has(event, "@exre/exui-docs") && has(event, "build"))
  assert.equal(rootBuild.base, "/")
  const rootStatic = events.find((event) => has(event, "packages/docs/tests/integration/verify-docs-static.mjs"))
  assert.equal(rootStatic.args.at(-1), "/")
})

test("typecheck prepares public Tokens before declarations and docs types", async (t) => {
  const { events, error } = await exercise(t, "typecheck")
  assert.ifError(error)
  assert.ok(index(events, "check:built") < index(events, "packages/components/scripts/copy-tokens-dist.mjs"))
  assert.ok(index(events, "packages/components/scripts/copy-tokens-dist.mjs") < index(events, "build:types"))
  assert.ok(!events.some((event) => has(event, "build")))
})

test("build orders public packages before the docs and preserves a requested deployment base", async (t) => {
  const { events, error } = await exercise(t, "build", [], { env: { EXUI_DOCS_BASE: "/preview/" } })
  assert.ifError(error)
  assert.deepEqual(events.map((event) => event.args.slice(2)), [["@exre/exui-tokens", "build"], ["@exre/exui", "build"], ["@exre/exui-docs", "build"]])
  assert.equal(events.at(-1).base, "/preview/")
})

test("CLI rejects unknown modes and extra non-test arguments before launching work", () => {
  for (const args of [["unknown"], ["build", "packages/components/tests/node/chart-style.test.mjs"], ["test", "packages/components/tests/node/chart-style.test.mjs"]]) {
    const result = spawnSync(process.execPath, [fileURLToPath(runner), ...args], { encoding: "utf8" })
    assert.equal(result.status, 1)
    assert.match(result.stderr, /Usage:/)
  }
})

test("CLI uses the current Node and pnpm entry without a shell, even when paths contain spaces", async (t) => {
  const temporary = await mkdtemp(path.join(os.tmpdir(), "exui cli "))
  t.after(() => rm(temporary, { recursive: true, force: true }))
  const cli = path.join(temporary, "pnpm entry.mjs")
  const output = path.join(temporary, "events.jsonl")
  await writeFile(cli, `
import { appendFileSync } from "node:fs"
appendFileSync(process.env.TASK_EVENTS, JSON.stringify({ args: process.argv.slice(2), cwd: process.cwd(), node: process.execPath, base: process.env.EXUI_DOCS_BASE }) + "\\n")
`)
  const result = spawnSync(process.execPath, [fileURLToPath(runner), "build"], {
    cwd: temporary,
    env: { ...process.env, npm_execpath: cli, TASK_EVENTS: output, EXUI_DOCS_BASE: "/custom/" },
    encoding: "utf8",
  })
  assert.equal(result.status, 0, result.stderr)
  const events = (await readFile(output, "utf8")).trim().split("\n").map(JSON.parse)
  assert.deepEqual(events.map((event) => event.args), [["--filter", "@exre/exui-tokens", "build"], ["--filter", "@exre/exui", "build"], ["--filter", "@exre/exui-docs", "build"]])
  for (const event of events) {
    assert.equal(event.node, process.execPath)
    assert.equal(event.cwd, path.resolve(fileURLToPath(new URL("../../../../", import.meta.url))))
    assert.equal(event.base, "/custom/")
  }
  assert.match(result.stdout, /\[tasks\] Build docs/)
})
