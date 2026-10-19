import assert from "node:assert/strict"
import { readdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import test from "node:test"

const repository = fileURLToPath(new URL("../../../../", import.meta.url))
const suite = /\.(?:test|spec)\.(?:[cm]?[jt]sx?)$/

function files(directory) {
  try {
    return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
      const target = path.join(directory, entry.name)
      return entry.isDirectory() ? files(target) : entry.isFile() ? [target] : []
    })
  } catch (error) {
    if (error.code === "ENOENT") return []
    throw error
  }
}

test("regression suites live in package tests directories so the unified entry cannot silently miss them", () => {
  const misplaced = files(path.join(repository, "scripts")).filter(file => suite.test(file))
  for (const name of ["components", "docs", "tokens"]) {
    const packageRoot = path.join(repository, "packages", name)
    const tests = files(path.join(packageRoot, "tests"))
    assert.ok(tests.some(file => file.endsWith(".test.mjs")), `${name} must retain Node regressions`)
    for (const directory of ["src", "scripts", "app", "lib"]) {
      misplaced.push(...files(path.join(packageRoot, directory)).filter(file => suite.test(file)))
    }
    if (name === "docs") assert.ok(tests.some(file => file.endsWith(".vrt.test.tsx")), "docs must retain browser regressions")
  }
  assert.deepEqual(misplaced.map(file => path.relative(repository, file)), [])
})
