import { createRequire } from 'node:module'
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const require = createRequire(path.join(root, 'packages/components/package.json'))
const ts = require('typescript')
const componentRoot = path.join(root, 'packages/components')
const indexFile = path.join(componentRoot, 'src/index.ts')
const manifestFile = path.join(componentRoot, 'upstream/reui/public-exports.json')
const snapshot = JSON.parse(readFileSync(path.join(componentRoot, 'upstream/reui/manifest.json'), 'utf8'))
const input = ts.readConfigFile(path.join(componentRoot, 'tsconfig.json'), ts.sys.readFile)
if (input.error) throw new Error(ts.flattenDiagnosticMessageText(input.error.messageText, '\n'))
const config = ts.parseJsonConfigFileContent(input.config, ts.sys, componentRoot)
const program = ts.createProgram(config.fileNames, config.options)
const checker = program.getTypeChecker()
const getExports = (filename) => {
  const source = program.getSourceFile(filename)
  if (!source) throw new Error(`missing TypeScript source ${filename}`)
  const module = checker.getSymbolAtLocation(source)
  if (!module) throw new Error(`not a module ${filename}`)
  return checker.getExportsOfModule(module).map((symbol) => {
    const actual = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol
    return { name: symbol.name, kind: actual.flags & ts.SymbolFlags.Value ? 'value' : 'type', identity: actual.declarations?.[0]?.getSourceFile().fileName + ':' + actual.declarations?.[0]?.pos }
  }).filter((entry) => entry.name !== 'default')
}

const index = readFileSync(indexFile, 'utf8').replaceAll('\r\n', '\n')
const startMarker = '// REUI_PUBLIC_EXPORTS_START'
const endMarker = '// REUI_PUBLIC_EXPORTS_END'
if (!index.includes(startMarker) || !index.includes(endMarker)) throw new Error('missing ReUI export markers in src/index.ts')

const existing = new Set(getExports(indexFile).filter((item) => {
  const identity = item.identity?.replaceAll('\\', '/') ?? ''
  return !identity.includes('/components/reui/') && !/\/hooks\/use-(?:copy-to-clipboard|file-upload|scroll-position|slider-input)\./.test(identity)
}).map((item) => item.name))
existing.delete('TanStackTable')
// The enhanced ReUI implementations replace the basic Alert and Badge surface.
existing.delete('Alert')
existing.delete('AlertTitle')
existing.delete('AlertDescription')
existing.delete('AlertAction')
existing.delete('Badge')
existing.delete('badgeVariants')

const selected = new Map()
const identities = new Set()
const exports = []
// These values are raw React contexts exported only to connect sibling ReUI
// source files. Their hooks and public context-shaped types remain exposed.
const privateContextValues = new Set([
  'CascaderActionsContext',
  'CascaderHighlightContext',
  'CascaderRenderContext',
  'CascaderStateContext',
  'EventCalendarContext',
  'EventCalendarViewConfigContext',
  'EventCalendarViewContext',
  'FilterActionsContext',
  'FilterFocusContext',
  'FilterRenderContext',
  'FilterStateContext',
  'GanttContext',
  'GanttViewConfigContext',
])
for (const file of snapshot.files.filter((entry) => entry.target.startsWith('components/reui/') || entry.target.startsWith('hooks/use-') && entry.adaptation === 'source-hook')) {
  const absolute = path.join(componentRoot, 'src', file.target)
  for (const item of getExports(absolute)) {
    // Name-based omission is limited to this explicit internal value list.
    if (item.kind === 'value' && privateContextValues.has(item.name)) continue
    if (identities.has(item.identity)) continue
    identities.add(item.identity)
    let publicName = item.name
    if (existing.has(publicName) || selected.has(publicName)) {
      publicName = item.name.startsWith('use') ? `useReui${item.name.slice(3)}` : `Reui${item.name}`
      let counter = 2
      while (existing.has(publicName) || selected.has(publicName)) publicName = `${publicName}${counter++}`
    }
    selected.set(publicName, item)
    exports.push({ name: item.name, publicName, kind: item.kind, target: file.target, source: file.source })
  }
}

const grouped = new Map()
for (const item of exports) {
  const key = `${item.target}:${item.kind}`
  if (!grouped.has(key)) grouped.set(key, [])
  grouped.get(key).push(item)
}
const lines = []
for (const [key, values] of grouped) {
  const [target, kind] = key.split(':')
  const specifier = `./${target.replace(/\.(tsx?|jsx?)$/, '')}`
  lines.push(`export ${kind === 'type' ? 'type ' : ''}{ ${values.map((item) => item.publicName === item.name ? item.name : `${item.name} as ${item.publicName}`).join(', ')} } from "${specifier}"`)
}
lines.push('export * as TanStackTable from "./lib/tanstack-table"')
const before = index.slice(0, index.indexOf(startMarker) + startMarker.length)
const after = index.slice(index.indexOf(endMarker))
const expected = `${before}\n${lines.join('\n')}\n${after}`
const manifest = { schemaVersion: 1, upstreamCommit: snapshot.commit, symbols: exports }
if (process.argv.includes('--write')) {
  writeFileSync(indexFile, expected)
  writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`)
} else {
  if (index !== expected) {
    const actualLines = index.split('\n')
    const expectedLines = expected.split('\n')
    const first = actualLines.findIndex((line, position) => line !== expectedLines[position])
    throw new Error(`src/index.ts ReUI exports are stale at line ${first + 1}: ${actualLines[first]} != ${expectedLines[first]}`)
  }
  if (readFileSync(manifestFile, 'utf8').replaceAll('\r\n', '\n') !== `${JSON.stringify(manifest, null, 2)}\n`) throw new Error('ReUI public symbol map is stale')
}
console.log(`ReUI exports ${exports.length} symbols from ${new Set(exports.map((entry) => entry.target)).size} modules`)
