import assert from "node:assert/strict"
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs"
import { spawnSync } from "node:child_process"
import { tmpdir } from "node:os"
import path from "node:path"
import { test } from "node:test"

const root = path.resolve(import.meta.dirname, "../../../..")
const components = path.join(root, "packages/components")

test("recipe checks accept CRLF caches and checkouts without accepting changed CSS", (t) => {
  const temporary = mkdtempSync(path.join(tmpdir(), "exui-recipes-eol-"))
  t.after(() => {
    assert.equal(path.dirname(temporary), path.resolve(tmpdir()))
    assert.ok(path.basename(temporary).startsWith("exui-recipes-eol-"))
    rmSync(temporary, { recursive: true, force: true })
  })
  const originalSnapshot = path.join(components, "upstream/reui")
  const snapshot = path.join(temporary, "packages/components/upstream/reui")
  const source = path.join(temporary, "packages/components/src/components")
  mkdirSync(source, { recursive: true })
  mkdirSync(snapshot, { recursive: true })
  mkdirSync(path.join(temporary, "scripts"))
  const manifest = JSON.parse(readFileSync(path.join(originalSnapshot, "manifest.json"), "utf8"))
  manifest.files = [manifest.files[0]]
  const copyCanonical = (from, to) => {
    mkdirSync(path.dirname(to), { recursive: true })
    writeFileSync(to, readFileSync(from, "utf8").replaceAll("\r\n", "\n"))
  }
  for (const entry of manifest.files) {
    copyCanonical(path.join(originalSnapshot, "source", entry.source), path.join(snapshot, "source", entry.source))
  }
  for (const asset of manifest.assets) {
    copyCanonical(path.join(originalSnapshot, asset.target), path.join(snapshot, asset.target))
  }
  writeFileSync(path.join(snapshot, "manifest.json"), JSON.stringify(manifest))
  writeFileSync(path.join(source, "fixture.tsx"), 'export const slots = "cn-trace-line cn-trace-collapsible cn-trace-title cn-trace-description"\n')
  for (const file of ["generate-reui-luma.mjs", "reui-restore.mjs"]) {
    copyFileSync(path.join(root, "scripts", file), path.join(temporary, "scripts", file))
  }
  const script = path.join(temporary, "scripts/generate-reui-luma.mjs")
  const run = (...args) => spawnSync(process.execPath, [script, ...args], { cwd: temporary, encoding: "utf8" })
  const generated = run()
  assert.equal(generated.status, 0, generated.stderr)
  const cssFile = path.join(temporary, "packages/components/src/reui-luma.css")
  for (const file of [cssFile, path.join(snapshot, "style-luma.css")]) {
    writeFileSync(file, readFileSync(file, "utf8").replaceAll("\n", "\r\n"))
  }
  const original = readFileSync(cssFile)
  const accepted = run("--check")
  assert.equal(accepted.status, 0, accepted.stderr)
  assert.deepEqual(readFileSync(cssFile), original, "a read-only check must preserve checkout bytes")
  writeFileSync(cssFile, original.toString("utf8").replace(".cn-trace-line", ".unexpected-rule"))
  const rejected = run("--check")
  assert.notEqual(rejected.status, 0)
  assert.match(rejected.stderr, /CSS is stale/)
})

function visit(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filename = path.join(directory, entry.name)
    return entry.isDirectory() ? visit(filename) : /\.tsx?$/.test(entry.name) ? [filename] : []
  })
}

test("every painted ReUI cn-* marker has a rule in the published stylesheet", () => {
  const css = readFileSync(path.join(components, "dist/index.css"), "utf8")
  const names = new Set()
  for (const filename of visit(path.join(components, "src/components"))) {
    const source = readFileSync(filename, "utf8")
    for (const match of source.matchAll(/\bcn-[a-z][a-z0-9-]+\b/g)) names.add(match[0])
  }
  for (const name of names) {
    // Upstream Trace leaves these composition slots styled by their inline classes.
    if (["cn-trace-collapsible", "cn-trace-title", "cn-trace-description"].includes(name)) continue
    assert.ok(css.includes(`.${name}`), `${name} is emitted by a component but has no published CSS rule`)
  }
})
