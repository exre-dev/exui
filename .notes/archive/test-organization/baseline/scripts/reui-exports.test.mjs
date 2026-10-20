import assert from "node:assert/strict"
import { copyFileSync, cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs"
import { spawnSync } from "node:child_process"
import { createRequire } from "node:module"
import { tmpdir } from "node:os"
import path from "node:path"
import { test } from "node:test"

const root = path.resolve(import.meta.dirname, "..")
const exports = JSON.parse(readFileSync(path.join(root, "packages/components/upstream/reui/public-exports.json"), "utf8")).symbols
const require = createRequire(path.join(root, "packages/components/package.json"))
const ts = require("typescript")

test("export checks accept CRLF checkouts without accepting generated export drift", (t) => {
  const temporary = mkdtempSync(path.join(tmpdir(), "exui-exports-eol-"))
  t.after(() => {
    assert.equal(path.dirname(temporary), path.resolve(tmpdir()))
    assert.ok(path.basename(temporary).startsWith("exui-exports-eol-"))
    rmSync(temporary, { recursive: true, force: true })
  })
  const packageRoot = path.join(temporary, "packages/components")
  const snapshot = path.join(packageRoot, "upstream/reui")
  mkdirSync(snapshot, { recursive: true })
  mkdirSync(path.join(temporary, "scripts"))
  cpSync(path.join(root, "packages/components/src"), path.join(packageRoot, "src"), { recursive: true })
  copyFileSync(path.join(root, "tsconfig.json"), path.join(temporary, "tsconfig.json"))
  for (const file of ["package.json", "tsconfig.json"]) {
    copyFileSync(path.join(root, "packages/components", file), path.join(packageRoot, file))
  }
  for (const file of ["manifest.json", "public-exports.json"]) {
    copyFileSync(path.join(root, "packages/components/upstream/reui", file), path.join(snapshot, file))
  }
  const script = path.join(temporary, "scripts/reui-exports.mjs")
  copyFileSync(path.join(root, "scripts/reui-exports.mjs"), script)
  symlinkSync(path.join(root, "node_modules"), path.join(temporary, "node_modules"), "junction")
  symlinkSync(path.join(root, "packages/components/node_modules"), path.join(packageRoot, "node_modules"), "junction")
  const indexFile = path.join(packageRoot, "src/index.ts")
  const manifestFile = path.join(snapshot, "public-exports.json")
  for (const file of [indexFile, manifestFile]) {
    writeFileSync(file, readFileSync(file, "utf8").replaceAll("\r\n", "\n").replaceAll("\n", "\r\n"))
  }
  const original = readFileSync(indexFile)
  const check = () => spawnSync(process.execPath, [script, "--check"], { cwd: temporary, encoding: "utf8" })
  const accepted = check()
  assert.equal(accepted.status, 0, accepted.stderr)
  assert.deepEqual(readFileSync(indexFile), original, "a read-only check must preserve checkout bytes")

  writeFileSync(indexFile, original.toString("utf8").replace("// REUI_PUBLIC_EXPORTS_END", "export const UnexpectedExport = 1\r\n// REUI_PUBLIC_EXPORTS_END"))
  const rejected = check()
  assert.notEqual(rejected.status, 0)
  assert.match(rejected.stderr, /exports are stale/)
})

test("all public ReUI context hooks and context-shaped types remain exported", () => {
  const names = new Set(exports.map((entry) => entry.name))
  for (const name of [
    "useDateSelectorContext",
    "useGanttBarContext",
    "CascaderLoadContext",
    "CascaderSearchContext",
    "TimePickerFormatContext",
    "FilterLoadContext",
    "FilterEmptyStateContext",
    "FilterValueDisplayContext",
    "FilterValidateContext",
    "CodeBlockLineActionContext",
  ]) {
    assert.ok(names.has(name), `${name} must be exported from the package root`)
  }
  for (const name of [
    "CascaderActionsContext", "CascaderHighlightContext", "CascaderRenderContext", "CascaderStateContext",
    "EventCalendarContext", "EventCalendarViewConfigContext", "EventCalendarViewContext",
    "FilterActionsContext", "FilterFocusContext", "FilterRenderContext", "FilterStateContext",
    "GanttContext", "GanttViewConfigContext",
  ]) {
    assert.ok(!names.has(name), `${name} is an internal React context value`)
  }
})

test("every included basic ReUI source exposes its public symbols through the package root", () => {
  const packageRoot = path.join(root, "packages/components")
  const config = ts.readConfigFile(path.join(packageRoot, "tsconfig.json"), ts.sys.readFile)
  assert.equal(config.error, undefined)
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, packageRoot)
  const program = ts.createProgram(parsed.fileNames, parsed.options)
  const checker = program.getTypeChecker()
  const names = (filename) => {
    const source = program.getSourceFile(filename)
    assert.ok(source, `missing source ${filename}`)
    const module = checker.getSymbolAtLocation(source)
    assert.ok(module, `missing module ${filename}`)
    return new Set(checker.getExportsOfModule(module).map((symbol) => symbol.name).filter((name) => name !== "default"))
  }
  const rootNames = names(path.join(packageRoot, "src/index.ts"))
  const inventory = JSON.parse(readFileSync(path.join(root, "packages/components/upstream/reui/inventory.json"), "utf8"))
  const basic = inventory.items.filter((item) => item.group === "ui")
  assert.equal(basic.filter((item) => item.disposition === "include").length, 62)
  assert.deepEqual(basic.filter((item) => item.disposition !== "include").map((item) => [item.name, item.disposition]), [["form", "retained-exui-form"]])
  for (const item of basic.filter((entry) => entry.disposition === "include")) {
    const filename = path.join(packageRoot, "src/components/ui", `${item.name}.tsx`)
    for (const name of names(filename)) {
      assert.ok(rootNames.has(name), `${item.name} public symbol ${name} is missing from the package root`)
    }
  }
})
