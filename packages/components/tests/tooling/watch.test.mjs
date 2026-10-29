import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { test } from "node:test"
import { fileURLToPath } from "node:url"

const watchScript = fileURLToPath(new URL("../../../../scripts/watch.mjs", import.meta.url))

async function waitForBuilds(logPath, expected) {
  const deadline = Date.now() + 4_000
  while (Date.now() < deadline) {
    const lines = (await readFile(logPath, "utf8")).trim().split("\n").filter(Boolean)
    if (lines.length >= expected) return lines
    await new Promise((resolve) => setTimeout(resolve, 25))
  }
  throw new Error(`watch did not record ${expected} builds in time`)
}

async function removeTempRoot(root) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      await rm(root, { recursive: true, force: true })
      return
    } catch (error) {
      if (error.code !== "EBUSY" || attempt === 19) throw error
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
}

test("watch ignores generated token CSS and rebuilds the public library for token and icon edits", async () => {
  const root = await mkdtemp(join(tmpdir(), "exui-watch-test-"))
  const logPath = join(root, "builds.log")
  const fakePnpm = join(root, "fake-pnpm.mjs")
  let watcher
  try {
    for (const directory of ["packages/tokens/src", "packages/tokens/scripts", "packages/components/src", "packages/components/scripts", "packages/icons/glass-icons", "packages/icons/src", "packages/icons/scripts"]) {
      await mkdir(join(root, directory), { recursive: true })
    }
    await writeFile(logPath, "")
    await writeFile(fakePnpm, `
import { appendFile, writeFile } from "node:fs/promises"
import { join } from "node:path"
const target = process.argv[process.argv.indexOf("--filter") + 1]
await appendFile(join(process.cwd(), "builds.log"), target + "\\n")
if (target === "@exre/exui-tokens") {
  await writeFile(join(process.cwd(), "packages/tokens/src/style.css"), ":root { --generated: yes; }\\n")
}
`)

    watcher = spawn(process.execPath, [watchScript], {
      cwd: root,
      env: { ...process.env, npm_execpath: fakePnpm },
      stdio: "ignore",
    })
    const initial = await waitForBuilds(logPath, 2)
    assert.deepEqual(initial, ["@exre/exui-tokens", "@exre/exui"])
    await new Promise((resolve) => setTimeout(resolve, 500))
    assert.deepEqual((await readFile(logPath, "utf8")).trim().split("\n"), initial,
      "generated style.css must not schedule another build")

    await writeFile(join(root, "packages/tokens/src/source.ts"), "export const changed = true\n")
    const afterEdit = await waitForBuilds(logPath, 4)
    assert.deepEqual(afterEdit.slice(2), ["@exre/exui-tokens", "@exre/exui"])
    await new Promise((resolve) => setTimeout(resolve, 500))
    assert.deepEqual((await readFile(logPath, "utf8")).trim().split("\n"), afterEdit,
      "one source edit must schedule only one token and component build")

    await writeFile(join(root, "packages/icons/glass-icons/camera.svg"), '<svg viewBox="0 0 128 128"/>')
    const afterIconEdit = await waitForBuilds(logPath, 5)
    assert.deepEqual(afterIconEdit.slice(4), ["@exre/exui"],
      "editing an icon must rebuild the public package containing its output")
  } finally {
    if (watcher && watcher.exitCode === null) {
      const closed = new Promise((resolve) => watcher.once("close", resolve))
      watcher.kill()
      await closed
    }
    await removeTempRoot(root)
  }
})

test("library readiness and reload notifications follow complete successful builds", async () => {
  const root = await mkdtemp(join(tmpdir(), "exui-watch-lifecycle-"))
  const logPath = join(root, "builds.log")
  let watcher
  try {
    for (const directory of ["packages/tokens/src", "packages/tokens/scripts", "packages/components/src", "packages/components/scripts", "packages/icons/glass-icons", "packages/icons/src", "packages/icons/scripts"]) {
      await mkdir(join(root, directory), { recursive: true })
    }
    await writeFile(logPath, "")
    const fakePnpm = join(root, "fake-pnpm.mjs")
    await writeFile(fakePnpm, `
import { appendFile, access } from "node:fs/promises"
import { join } from "node:path"
const target = process.argv[process.argv.indexOf("--filter") + 1]
await appendFile("builds.log", target + "\\n")
try { await access("fail-build"); process.exit(7) } catch {}
`)
    const entry = join(root, "entry.mjs")
    await writeFile(entry, `
import { appendFile } from "node:fs/promises"
import { watchLibrary } from ${JSON.stringify(new URL("../../../../scripts/watch.mjs", import.meta.url).href)}
const watcher = watchLibrary({ onBuild: ({ initial }) => appendFile("builds.log", (initial ? "ready" : "reload") + "\\n") })
await watcher.ready
process.on("SIGTERM", () => { void watcher.close() })
`)
    watcher = spawn(process.execPath, [entry], { cwd: root, env: { ...process.env, npm_execpath: fakePnpm }, stdio: "ignore" })
    assert.deepEqual(await waitForBuilds(logPath, 3), ["@exre/exui-tokens", "@exre/exui", "ready"])

    await writeFile(join(root, "fail-build"), "")
    await writeFile(join(root, "packages/components/src/source.ts"), "first edit")
    await waitForBuilds(logPath, 4)
    await new Promise(resolve => setTimeout(resolve, 350))
    assert.equal((await readFile(logPath, "utf8")).includes("reload"), false, "failed builds must not reload docs")
    await rm(join(root, "fail-build"))
    await writeFile(join(root, "packages/components/src/source.ts"), "fixed edit")
    const recovered = await waitForBuilds(logPath, 6)
    assert.deepEqual(recovered.slice(3), ["@exre/exui", "@exre/exui", "reload"])
  } finally {
    if (watcher && watcher.exitCode === null) {
      const closed = new Promise(resolve => watcher.once("close", resolve))
      watcher.kill()
      await closed
    }
    await removeTempRoot(root)
  }
})

test("watch exits when the initial build fails", async () => {
  const root = await mkdtemp(join(tmpdir(), "exui-watch-initial-failure-"))
  let watcher
  try {
    for (const directory of ["packages/tokens/src", "packages/tokens/scripts", "packages/components/src", "packages/components/scripts", "packages/icons/glass-icons", "packages/icons/src", "packages/icons/scripts"]) {
      await mkdir(join(root, directory), { recursive: true })
    }
    const fakePnpm = join(root, "fake-pnpm.mjs")
    await writeFile(fakePnpm, "process.exit(7)\n")
    watcher = spawn(process.execPath, [watchScript], { cwd: root, env: { ...process.env, npm_execpath: fakePnpm }, stdio: "ignore" })
    let timer
    const result = await Promise.race([
      new Promise(resolve => watcher.once("close", code => resolve(code))),
      new Promise(resolve => { timer = setTimeout(() => resolve("still running"), 2_000) }),
    ])
    clearTimeout(timer)
    assert.equal(result, 1, "a failed initial build must stop startup")
  } finally {
    if (watcher && watcher.exitCode === null) {
      const closed = new Promise(resolve => watcher.once("close", resolve))
      watcher.kill()
      await closed
    }
    await removeTempRoot(root)
  }
})
