import test from "node:test"
import assert from "node:assert/strict"
import { readFile, readdir } from "node:fs/promises"
import { createRequire } from "node:module"

const require = createRequire(new URL("../../package.json", import.meta.url))
const ts = require("typescript")
const publicRoot = new URL("../../../components/", import.meta.url)
const manifest = JSON.parse(await readFile(new URL("package.json", publicRoot), "utf8"))
const icons = await import(new URL(manifest.exports["./icons/glass-icons"].import, publicRoot).href)
const publicNames = Object.keys(icons).filter(name => name.endsWith("Icon")).sort()
const assets = (await readdir(new URL("../../../icons/glass-icons/", import.meta.url))).filter(name => name.endsWith(".svg")).sort()
const source = await readFile(new URL("../../app/components/icons/catalog.ts", import.meta.url), "utf8")

function readEntries(text) {
  const file = ts.createSourceFile("catalog.ts", text, ts.ScriptTarget.Latest, true)
  const imports = new Map()
  let namespace
  let catalog
  function visit(node) {
    if (ts.isImportDeclaration(node)) {
      const specifier = node.moduleSpecifier.text
      const bindings = node.importClause?.namedBindings
      if (specifier === "@exre/exui/icons/glass-icons" && bindings && ts.isNamespaceImport(bindings)) namespace = bindings.name.text
      if (specifier.startsWith("@exre/exui/icons/glass-icons/") && node.importClause?.name) {
        imports.set(node.importClause.name.text, specifier.slice("@exre/exui/icons/glass-icons/".length))
      }
    }
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === "iconCatalog") catalog = node.initializer
    ts.forEachChild(node, visit)
  }
  visit(file)
  assert.ok(namespace && catalog && ts.isArrayLiteralExpression(catalog), "catalog must declare its finite public icon entries")
  return catalog.elements.map(entry => {
    assert.ok(ts.isObjectLiteralExpression(entry), "catalog entries must be explicit")
    const fields = new Map(entry.properties.map(property => {
      assert.ok(ts.isPropertyAssignment(property), "catalog fields must be explicit")
      return [property.name.getText(file), property.initializer]
    }))
    const name = fields.get("name"), slug = fields.get("slug"), component = fields.get("Component"), asset = fields.get("assetUrl")
    assert.ok(name && ts.isStringLiteral(name) && slug && ts.isStringLiteral(slug), "catalog names and slugs must be literals")
    assert.ok(component && ts.isPropertyAccessExpression(component) && component.expression.getText(file) === namespace, "catalog artwork must use the public icon entry")
    assert.ok(asset && ts.isIdentifier(asset) && imports.has(asset.text), "catalog SVGs must use public asset imports")
    return { name: name.text, slug: slug.text, symbol: component.name.text, asset: imports.get(asset.text) }
  })
}

function assertInventory(entries) {
  assert.equal(new Set(entries.map(entry => entry.name)).size, entries.length, "duplicate icon name")
  assert.deepEqual(entries.map(entry => entry.name).sort(), publicNames, "gallery must cover every public icon")
  assert.deepEqual(entries.map(entry => entry.asset).sort(), assets, "gallery must cover every canonical SVG exactly once")
  for (const entry of entries) {
    const expectedName = entry.slug.split("-").map(part => part[0].toUpperCase() + part.slice(1)).join("") + "Icon"
    assert.equal(entry.name, entry.symbol, `${entry.name}: React artwork mismatch`)
    assert.equal(entry.asset, `${entry.slug}.svg`, `${entry.name}: SVG asset mismatch`)
    assert.equal(entry.name, expectedName, `${entry.name}: SVG and React name mismatch`)
  }
}

test("Glass gallery pairs every canonical SVG with its public React icon", () => {
  assertInventory(readEntries(source))
})

test("Glass gallery inventory rejects omissions, duplicates and swapped artwork or downloads", () => {
  const entries = readEntries(source)
  assert.throws(() => assertInventory(entries.slice(1)), /cover every public icon/)
  assert.throws(() => assertInventory([...entries, entries[0]]), /duplicate icon name/)
  const swap = field => entries.map((entry, index) => index < 2 ? { ...entry, [field]: entries[1 - index][field] } : entry)
  assert.throws(() => assertInventory(swap("symbol")), /React artwork mismatch/)
  assert.throws(() => assertInventory(swap("asset")), /SVG asset mismatch/)
})
