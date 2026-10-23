import { spawn as nodeSpawn } from "node:child_process"
import { fileURLToPath, pathToFileURL } from "node:url"
import path from "node:path"
import { fastNodeTests } from "./test-suites.mjs"

const root = fileURLToPath(new URL("../", import.meta.url))
const verificationGroups = ["checks", "docs-root", "docs-prefix", "visual", "consumers"]
const usage = `Usage: node scripts/tasks.mjs <build|typecheck|check|test|test:node|verify|verify:part> [test-files for test:node... | ${verificationGroups.join("|")} for verify:part]`
const nodeTests = ["packages/*/tests/**/*.test.mjs"]
// Several suites launch Vite, Chromium or compilers. Keep those processes from
// starving watcher/readiness checks when Node would otherwise use every core.
const nodeTestArguments = ["--test", "--test-concurrency=2"]

export async function runTasks(mode, files = [], { env = process.env, spawn = nodeSpawn, log = console.log } = {}) {
  if (!["build", "typecheck", "check", "test", "test:node", "verify", "verify:part"].includes(mode)) throw new Error(usage)
  if (mode === "verify:part" ? files.length !== 1 || !verificationGroups.includes(files[0]) : mode !== "test:node" && files.length) throw new Error(usage)
  const pnpmPath = env.npm_execpath
  if (!pnpmPath) throw new Error("Run through pnpm, or set npm_execpath to the pnpm JavaScript CLI entry.")

  async function stage(label, args, overrides = {}) {
    log(`[tasks] ${label}`)
    await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, args, { cwd: root, env: { ...env, ...overrides }, stdio: "inherit", shell: false })
      child.once("error", (error) => reject(new Error(`${label}: ${error.message}`, { cause: error })))
      child.once("close", (code, signal) => {
        if (code === 0) resolve()
        else reject(new Error(`${label} exited with ${signal ?? code}`))
      })
    })
  }
  const pnpm = (label, args, overrides) => stage(label, [pnpmPath, ...args], overrides)
  const workspace = (label, name, command, overrides) => pnpm(label, ["--filter", name, command], overrides)
  const node = (label, ...args) => stage(label, args)

  async function prepareTokens() {
    // Both emitting compilers also typecheck. The check must precede any build
    // that regenerates tracked CSS, so drift remains a failure instead of a fix.
    await workspace("Token ESM and declarations", "@exre/exui-tokens", "build:js")
    await workspace("Token CommonJS and declarations", "@exre/exui-tokens", "build:cjs")
    await workspace("Token parity, CSS drift and policies", "@exre/exui-tokens", "check:built")
  }

  async function prepareTypes() {
    await workspace("Component types", "@exre/exui", "typecheck")
    await node("Public Token entries", "packages/components/scripts/copy-tokens-dist.mjs")
    await workspace("Public component declarations", "@exre/exui", "build:types")
    await workspace("Docs types", "@exre/exui-docs", "typecheck")
  }

  async function sourceChecks() {
    for (const [label, script] of [
      ["Component source locks and adapters", "reui-sync.mjs"],
      ["Component public exports", "reui-exports.mjs"],
      ["Foundation patches", "reui-foundation-diff.mjs"],
      ["Luma recipes", "generate-reui-luma.mjs"],
    ]) await node(label, `scripts/${script}`, "--check")
  }

  async function consistencyChecks() {
    await node("Docs content", "scripts/docs-content.mjs", "check")
    await node("Docs example coverage", "scripts/docs-examples.mjs", "check")
    await node("Docs example assets", "scripts/docs-example-assets.mjs")
    await node("Docs capabilities", "scripts/exui-capabilities.mjs", "--check")
    await node("Skill source references", "scripts/exui-skill/sync-references.mjs", "--check")
    await node("Skill inventories", "scripts/exui-skill/update-inventories.mjs", "--check")
    await node("Skill links and structure", "scripts/exui-skill/verify.mjs")
  }

  async function docsOutput(base) {
    await node(`Docs static output (${base})`, "packages/docs/tests/integration/verify-docs-static.mjs", "packages/docs/build/client", base)
    await node(`Docs sharing (${base})`, "packages/docs/tests/integration/verify-docs-sharing.mjs", "packages/docs/build/client", base)
  }

  async function verifyGroup(group) {
    if (group === "checks") {
      await pnpm("Lint workspaces and tooling", ["lint"])
      await consistencyChecks()
      // Fresh jobs have no MDX/content manifests from a previous docs build.
      await workspace("Docs generated sources", "@exre/exui-docs", "docs:prepare")
      await node("Node regressions", ...nodeTestArguments, ...nodeTests)
      await node("Docs public snippets", "scripts/docs-snippets.mjs")
      await node("Skill examples", "packages/components/tests/tooling/skill/verify-examples.mjs")
      await node("Release configuration", "scripts/release-bootstrap/verify.mjs", "--root", ".")
      await pnpm("Whitespace check", ["exec", "git", "diff", "--check"])
    } else if (group === "docs-root" || group === "docs-prefix") {
      const base = group === "docs-root" ? "/" : "/exui/"
      // A group's build and output checks stay together; independent CI jobs
      // isolate the two bases instead of racing over one build directory.
      await workspace(`Build docs (${base})`, "@exre/exui-docs", "build", { EXUI_DOCS_BASE: base })
      if (group === "docs-root") await node("Docs example production styles and Chromium", "scripts/docs-example-styles.mjs")
      await docsOutput(base)
    } else if (group === "visual") {
      await workspace("Docs generated sources", "@exre/exui-docs", "docs:prepare")
      await pnpm("Desktop Chromium suite", ["--filter", "@exre/exui-docs", "exec", "vitest", "run", "--project", "chromium-desktop"])
    } else if (group === "consumers") {
      await node("Packed consumers", "packages/components/tests/consumers/verify-packages.mjs")
    }
  }

  if (mode === "build") {
    await workspace("Build Tokens", "@exre/exui-tokens", "build")
    await workspace("Build components", "@exre/exui", "build")
    await workspace("Build docs", "@exre/exui-docs", "build")
    return
  }

  if (mode === "check" || mode === "verify" || (mode === "verify:part" && files[0] === "checks")) await sourceChecks()
  await prepareTokens()
  if (mode === "typecheck") {
    await prepareTypes()
    return
  }

  // Node SSR regressions, skill examples and browser consumers all import the
  // built public package. Prepare it once even for focused test invocations.
  await workspace("Build components", "@exre/exui", "build")
  if (mode === "check" || mode === "test") {
    if (mode === "check") {
      await workspace("Docs types", "@exre/exui-docs", "typecheck")
      await pnpm("Lint workspaces and tooling", ["lint"])
      await consistencyChecks()
    }
    await node("Fast Node and SSR regressions", ...nodeTestArguments, ...fastNodeTests)
    return
  }
  if (mode === "test:node") {
    await node("Node regressions", ...nodeTestArguments, ...(files.length ? files : nodeTests))
    return
  }

  if (mode === "verify:part") {
    await verifyGroup(files[0])
    return
  }
  // CI runs these groups in isolated jobs. Local verification reuses their
  // definitions sequentially, prepares the library once and leaves Pages last.
  for (const group of ["checks", "docs-root", "visual", "consumers", "docs-prefix"]) await verifyGroup(group)
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  runTasks(process.argv[2], process.argv.slice(3)).catch((error) => {
    console.error(`[tasks] ${error.message}`)
    process.exitCode = 1
  })
}
