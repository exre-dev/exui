import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { copyFile, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises"
import { createRequire } from "node:module"
import { tmpdir } from "node:os"
import path from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const require = createRequire(new URL("../../../package.json", import.meta.url))
const generator = fileURLToPath(new URL("../../../../../scripts/exui-skill/update-inventories.mjs", import.meta.url))

async function inventoryFixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), "exui-skill-inventory-test-"))
  t.after(async () => {
    assert.equal(path.dirname(root), path.resolve(tmpdir()))
    assert.ok(path.basename(root).startsWith("exui-skill-inventory-test-"))
    await rm(root, { recursive: true, force: true })
  })
  const componentRoot = path.join(root, "packages/components")
  const scriptRoot = path.join(root, "scripts/exui-skill")
  const output = path.join(root, "skills/exui/references/generated/component-exports.md")
  for (const directory of [scriptRoot, path.join(componentRoot, "src"), path.join(componentRoot, "node_modules"), path.dirname(output)]) {
    await mkdir(directory, { recursive: true })
  }
  const script = path.join(scriptRoot, "update-inventories.mjs")
  await copyFile(generator, script)
  await symlink(path.dirname(require.resolve("typescript/package.json")), path.join(componentRoot, "node_modules/typescript"), "junction")
  const manifest = {
    name: "@exre/exui",
    version: "1.0.0",
    exports: { "./tokens": { import: "./tokens.mjs" }, "./tokens/style.css": "./tokens.css" },
  }
  const manifestPath = path.join(componentRoot, "package.json")
  const entry = path.join(componentRoot, "src/index.ts")
  await writeFile(manifestPath, JSON.stringify(manifest))
  await writeFile(path.join(componentRoot, "tsconfig.json"), JSON.stringify({ compilerOptions: { noLib: true, types: [] } }))
  await writeFile(entry, 'export const Button = "button"\nexport interface ButtonProps { label: string }\n')
  await writeFile(path.join(componentRoot, "tokens.mjs"), 'export const exuiTokens = { themes: { light: { background: "#fff" } } }\nexport const componentRecipes = { button: { height: "2.5rem" } }\n')
  await writeFile(path.join(componentRoot, "tokens.css"), ":root { --test-color: #fff; }\n")
  const run = (mode) => {
    const result = spawnSync(process.execPath, [script, mode], { cwd: root, encoding: "utf8", timeout: 10000 })
    assert.ifError(result.error)
    return result
  }
  const generated = run("--write")
  assert.equal(generated.status, 0, generated.stderr)
  assert.match(await readFile(output, "utf8"), /\| `Button` \| value \|/)
  return { entry, manifest, manifestPath, run }
}

test("a version-only release does not invalidate the public export inventory", async (t) => {
  const { manifest, manifestPath, run } = await inventoryFixture(t)
  manifest.version = "1.0.1"
  await writeFile(manifestPath, JSON.stringify(manifest))
  const result = run("--check")
  assert.equal(result.status, 0, result.stderr)
})

test("a changed public export still invalidates the inventory", async (t) => {
  const { entry, run } = await inventoryFixture(t)
  await writeFile(entry, 'export const Button = "button"\nexport interface ButtonProps { label: string }\nexport const NewComponent = "new"\n')
  const result = run("--check")
  assert.equal(result.status, 1, result.stderr)
  assert.match(result.stderr, /Stale inventory: component-exports\.md/)
})
