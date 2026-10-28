import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { test } from "node:test"
import { stopChild } from "../../../../scripts/watch.mjs"

async function waitFor(read, matches) {
  const deadline = Date.now() + 8_000
  while (Date.now() < deadline) {
    const value = await read()
    if (matches(value)) return value
    await new Promise(resolve => setTimeout(resolve, 30))
  }
  throw new Error("development process did not reach the expected state")
}

test("dev starts docs after library readiness, reloads on success and releases descendants", { timeout: 20_000 }, async t => {
  const root = await mkdtemp(join(tmpdir(), "exui-dev-test-"))
  let dev
  let phase = "setup"
  const startedAt = Date.now()
  t.signal.addEventListener("abort", () => {
    if (Date.now() - startedAt >= 19_000) {
      console.error(`[dev lifecycle] timed out during ${phase}; dev pid=${dev?.pid ?? "none"}; root=${root}`)
    }
  }, { once: true })
  try {
    for (const directory of ["packages/tokens/src", "packages/tokens/scripts", "packages/components/src", "packages/components/scripts", "packages/icons/glass-icons", "packages/icons/src", "packages/icons/scripts"]) {
      await mkdir(join(root, directory), { recursive: true })
    }
    const log = join(root, "events.log")
    await writeFile(log, "")
    const fakePnpm = join(root, "pnpm.mjs")
    await writeFile(fakePnpm, `
import { spawn } from "node:child_process"
import { appendFile } from "node:fs/promises"
const target = process.argv[process.argv.indexOf("--filter") + 1]
if (target === "@exre/exui-docs") {
  const nested = spawn(process.execPath, ["-e", "setInterval(() => {}, 1000)"], { stdio: "ignore" })
  await appendFile("events.log", "docs:" + nested.pid + "\\n")
  setInterval(() => {}, 1000)
} else {
  await appendFile("events.log", target + "\\n")
}
`)
    const entry = join(root, "entry.mjs")
    await writeFile(entry, `
process.on("message", () => { process.disconnect(); process.emit("SIGINT") })
await import(${JSON.stringify(new URL("../../../../scripts/dev.mjs", import.meta.url).href)})
`)
    dev = spawn(process.execPath, [entry], { cwd: root, env: { ...process.env, npm_execpath: fakePnpm }, stdio: ["ignore", "ignore", "ignore", "ipc"], detached: process.platform !== "win32" })
    phase = "waiting for docs startup"
    const events = await waitFor(() => readFile(log, "utf8"), value => value.includes("docs:"))
    const lines = events.trim().split("\n")
    assert.deepEqual(lines.slice(0, 2), ["@exre/exui-tokens", "@exre/exui"])
    assert.equal(lines.length, 3)
    const descendant = Number(lines[2].slice(5))
    const marker = join(root, "packages/docs/.generated/library-rebuild")
    assert.equal(await readFile(marker, "utf8"), "1")
    await writeFile(join(root, "packages/components/src/source.ts"), "changed")
    phase = "waiting for rebuild marker"
    await waitFor(() => readFile(marker, "utf8"), value => value === "2")
    const closed = new Promise(resolve => dev.once("close", resolve))
    phase = "waiting for dev close after stop"
    dev.send("stop")
    assert.equal(await closed, 0)
    assert.throws(() => process.kill(descendant, 0), { code: "ESRCH" })
  } finally {
    phase = `cleanup after ${phase}`
    await stopChild(dev)
    await rm(root, { recursive: true, force: true })
  }
})

test("dev can stop during the initial build without starting docs or leaving descendants", { timeout: 15_000 }, async t => {
  const root = await mkdtemp(join(tmpdir(), "exui-dev-cancel-"))
  let dev
  let phase = "setup"
  const startedAt = Date.now()
  t.signal.addEventListener("abort", () => {
    if (Date.now() - startedAt >= 14_000) {
      console.error(`[dev lifecycle] timed out during ${phase}; dev pid=${dev?.pid ?? "none"}; root=${root}`)
    }
  }, { once: true })
  try {
    for (const directory of ["packages/tokens/src", "packages/tokens/scripts", "packages/components/src", "packages/components/scripts", "packages/icons/glass-icons", "packages/icons/src", "packages/icons/scripts"]) {
      await mkdir(join(root, directory), { recursive: true })
    }
    const log = join(root, "events.log")
    await writeFile(log, "")
    const fakePnpm = join(root, "pnpm.mjs")
    await writeFile(fakePnpm, `
import { appendFile } from "node:fs/promises"
await appendFile("events.log", String(process.pid))
setInterval(() => {}, 1000)
`)
    const entry = join(root, "entry.mjs")
    await writeFile(entry, `
process.on("message", () => { process.disconnect(); process.emit("SIGINT") })
await import(${JSON.stringify(new URL("../../../../scripts/dev.mjs", import.meta.url).href)})
`)
    dev = spawn(process.execPath, [entry], { cwd: root, env: { ...process.env, npm_execpath: fakePnpm }, stdio: ["ignore", "ignore", "ignore", "ipc"], detached: process.platform !== "win32" })
    phase = "waiting for initial build pid"
    const buildPid = Number(await waitFor(() => readFile(log, "utf8"), value => value.length > 0))
    const closed = new Promise(resolve => dev.once("close", resolve))
    phase = "waiting for dev close after stop"
    dev.send("stop")
    assert.equal(await closed, 0)
    assert.throws(() => process.kill(buildPid, 0), { code: "ESRCH" })
    await assert.rejects(readFile(join(root, "packages/docs/.generated/library-rebuild")), { code: "ENOENT" })
  } finally {
    phase = `cleanup after ${phase}`
    await stopChild(dev)
    await rm(root, { recursive: true, force: true })
  }
})
