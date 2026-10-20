import assert from "node:assert/strict"
import { existsSync, readdirSync } from "node:fs"
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

test("fast and integration classifications cover every actual Node suite exactly once", async () => {
  const manifest = new URL("../../../../scripts/test-suites.mjs", import.meta.url)
  assert.ok(existsSync(manifest), "explicit fast and integration Node suite lists must exist")
  const { fastNodeTests, integrationNodeTests } = await import(manifest.href)
  assert.ok(fastNodeTests.length > 0, "fast regressions must remain present")
  assert.ok(integrationNodeTests.length > 0, "integration regressions must remain present")
  const packages = path.join(repository, "packages")
  const actual = readdirSync(packages, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .flatMap(entry => files(path.join(packages, entry.name, "tests")))
    .filter(file => file.endsWith(".test.mjs"))
    .map(file => path.relative(repository, file).split(path.sep).join("/"))
  const classified = [...fastNodeTests, ...integrationNodeTests]
  assert.equal(new Set(classified).size, classified.length, "each suite must be classified only once")
  for (const file of classified) assert.ok(actual.includes(file), `classified Node suite is missing: ${file}`)
  assert.deepEqual(actual.filter(file => !classified.includes(file)).sort(), [], "new Node suites must be classified explicitly")
  assert.deepEqual([...classified].sort(), actual.sort(), "classification must equal the discovered Node inventory")
  assert.ok(fastNodeTests.includes("packages/docs/tests/node/docs-example-copy-ssr.test.mjs"), "public package SSR stays fast")
  assert.ok(fastNodeTests.includes("packages/docs/tests/node/docs-snippets.test.mjs"), "snippet helper unit tests stay fast")
  for (const file of [
    "packages/components/tests/node/chart-style.test.mjs",
    "packages/components/tests/upstream/reui-exports.test.mjs",
    "packages/components/tests/upstream/reui-sync.test.mjs",
    "packages/components/tests/tooling/release/runtime.test.mjs",
    "packages/docs/tests/node/docs-dev-sources.test.mjs",
    "packages/docs/tests/node/docs-library-reload.test.mjs",
    "packages/docs/tests/node/library-build-barrier.test.mjs",
    "packages/docs/tests/node/docs-sharing.test.mjs",
  ]) assert.ok(integrationNodeTests.includes(file), `heavyweight suite belongs to integration: ${file}`)
})
