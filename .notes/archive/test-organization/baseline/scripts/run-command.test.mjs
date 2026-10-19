import assert from "node:assert/strict"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"
import { runCommand } from "./run-command.mjs"

test("commands preserve their working directory and literal arguments across paths with spaces", async () => {
  const root = await mkdtemp(join(tmpdir(), "exui command test "))
  try {
    const script = join(root, "echo arguments.mjs")
    await writeFile(script, "console.log(JSON.stringify({ cwd: process.cwd(), args: process.argv.slice(2) }))\n")
    const args = ["two words", 'a"quote', "a&b", "$HOME", "$(echo unsafe)", "semi;colon", ""]
    const result = runCommand(process.execPath, [script, ...args], root)
    assert.equal(result.status, 0)
    assert.deepEqual(JSON.parse(result.stdout), { cwd: root, args })
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test("failed commands report their exit status and diagnostics", () => {
  assert.throws(
    () => runCommand(process.execPath, ["-e", 'console.error("consumer failed"); process.exit(7)']),
    (error) => error.message.includes("failed (7)") && error.message.includes("consumer failed")
  )
})

test("callers can inspect an expected command failure", () => {
  const result = runCommand(process.execPath, ["-e", 'console.log("invalid example"); process.exit(7)'], undefined, { allowFailure: true })
  assert.equal(result.status, 7)
  assert.equal(result.stdout.trim(), "invalid example")
})

test("missing executables report a spawn failure even when exit failures are allowed", () => {
  assert.throws(
    () => runCommand("exui-command-that-does-not-exist", [], undefined, { allowFailure: true }),
    /failed to spawn/
  )
})

test("npm and pnpm run through their installed CLIs without shell warnings", () => {
  for (const command of ["npm", "pnpm"]) {
    const result = runCommand(command, ["--version"])
    assert.equal(result.status, 0)
    assert.match(result.stdout.trim(), /^\d+\.\d+\.\d+/)
    assert.doesNotMatch(result.stderr, /DEP0190/)
  }
})
