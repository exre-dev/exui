import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { readUpstreamFile, restoreReuiSnapshot } from './reui-restore.mjs'

const root = path.resolve(import.meta.dirname, '..')
const option = (name, fallback) => process.argv.includes(name) ? process.argv[process.argv.indexOf(name) + 1] : fallback
const inventory = JSON.parse(readFileSync(option('--inventory', path.join(root, 'packages/components/upstream/reui/inventory.json')), 'utf8'))
const upstream = process.env.EXUI_REUI_CHECKOUT
const snapshot = path.resolve(option('--snapshot', path.join(root, 'packages/components/upstream/reui')))
const mode = process.argv.includes('--update') ? 'update' : process.argv.includes('--accept-adapters') ? 'accept' : 'check'
const lf = (value) => Buffer.from(value.toString('utf8').replace(/\r\n/g, '\n'), 'utf8')
const sha = (value) => createHash('sha256').update(lf(value)).digest('hex')
const fail = (message) => { throw new Error(message) }
const fromCommit = (filename) => readUpstreamFile(inventory, filename)
const save = (filename, value) => { mkdirSync(path.dirname(filename), { recursive: true }); writeFileSync(filename, value) }
const componentRoot = path.resolve(option('--component-root', path.join(root, 'packages/components/src')))

if (mode === 'update' && upstream && execFileSync('git', ['rev-parse', 'HEAD'], { cwd: upstream, encoding: 'utf8' }).trim() !== inventory.commit) fail('upstream commit mismatch')
const manifestFile = path.join(snapshot, 'manifest.json')
const accepted = mode === 'update' ? null : JSON.parse(readFileSync(manifestFile, 'utf8'))
if (accepted) {
  if (accepted.commit !== inventory.commit || accepted.style !== inventory.style) fail('snapshot identity mismatch')
  await restoreReuiSnapshot({ snapshot })
}

async function lumaSource(itemName, target) {
  const filename = `public/r/styles/radix-luma/${itemName}.json`
  const data = JSON.parse((await fromCommit(filename)).toString('utf8'))
  const files = (data.files ?? []).filter(file => file.target === target)
  if (files.length !== 1 || !files[0].content) fail(`missing Luma registry file ${target}`)
  return files[0].content
}

function transform(code, source) {
  let output = code.replaceAll('from "cn"', 'from "@/lib/utils"')
  output = output.replaceAll('from "@/registry/bases/radix/ui/', 'from "@/components/ui/')
    .replaceAll('from "@/registry-reui/bases/radix/reui/', 'from "@/components/reui/')
    .replaceAll('from "@/registry-reui/bases/radix/hooks/', 'from "@/hooks/')
    .replaceAll('from "@/registry/bases/base/ui/scroll-area"', 'from "@/components/ui/scroll-area"')
  output = output.replaceAll('process.env.NODE_ENV !== "production"', 'import.meta.env.DEV')
    .replaceAll('process.env.NODE_ENV === "production"', 'import.meta.env.PROD')
  if (source.endsWith('/data-grid/data-grid-pagination.tsx')) {
    output = output.replace(/\bSelect,\s*\n/, 'SelectField as Select,\n')
  }
  if (source.endsWith('/use-scroll-position.ts')) {
    output = output.replace('import { RefObject, useEffect, useState } from "react"', 'import { useEffect, useState, type RefObject } from "react"')
  }
  const icons = new Set()
  output = output.replace(/<IconPlaceholder\b([\s\S]*?)\/>/g, (match, attributes) => {
    const icon = attributes.match(/\blucide="([A-Za-z][A-Za-z0-9]*)"/)
    if (!icon) fail(`unknown IconPlaceholder in ${source}`)
    icons.add(icon[1])
    const kept = attributes.replace(/\s+(?:lucide|tabler|hugeicons|phosphor|remixicon)="[^"]*"/g, '')
    if (/\b(?:lucide|tabler|hugeicons|phosphor|remixicon)=/.test(kept)) fail(`unhandled icon attribute in ${source}`)
    return `<${icon[1]}${/\baria-hidden(?:\s|=|$)/.test(kept) ? '' : ' aria-hidden="true"'}${kept}/>`
  })
  output = output.replace(/^import\s*\{\s*IconPlaceholder\s*\}\s*from\s*"[^"]+"\s*\r?\n/gm, '')
  if (/<\/?IconPlaceholder\b/.test(output)) fail(`unhandled IconPlaceholder in ${source}`)
  if (icons.size) {
    const iconImport = `import { ${[...icons].sort().join(', ')} } from "lucide-react"\n`
    output = output.includes('"use client"\n')
      ? output.replace('"use client"\n', `"use client"\n\n${iconImport}`)
      : `${iconImport}${output}`
  }
  if (output.includes('style-luma:') || /\bstyle-(?:vega|nova|maia|lyra|mira|sera|rhea):/.test(output)) fail(`unexpanded style variant in ${source}`)
  if (output.includes('@/registry') || output.includes('@/app/')) fail(`unhandled upstream alias in ${source}`)
  return output
}

const sourceFiles = new Map()
for (const item of inventory.items.filter((entry) => entry.disposition === 'include')) {
  for (const file of item.files) {
    const previous = sourceFiles.get(file.source)
    if (previous && previous !== file.sha256) fail(`conflicting source hash for ${file.source}`)
    sourceFiles.set(file.source, file.sha256)
  }
}
if (sourceFiles.size !== 148) fail(`expected 148 unique source files, found ${sourceFiles.size}`)

const entries = []
const pending = []
for (const [source, expected] of sourceFiles) {
  let target
  let kind
  if (source.startsWith('registry-reui/bases/radix/reui/')) {
    target = `components/reui/${source.split('/reui/')[1]}`
    kind = 'registry-json-luma'
  } else if (source.startsWith('registry/bases/radix/ui/')) {
    target = `components/ui/${path.basename(source)}`
    kind = 'exui-foundation-adapter'
  } else if (source.startsWith('registry-reui/bases/radix/hooks/')) {
    target = `hooks/${path.basename(source)}`
    kind = 'source-hook'
  } else fail(`unexpected source ${source}`)
  const sourceFile = path.join(snapshot, 'source', source)
  const dest = path.join(componentRoot, target)
  let nextTarget
  if (mode === 'update') {
    // Git blob bytes are the cross-platform source of truth. CRLF checkout
    // bytes and LF checkout bytes share the same canonical manifest hash.
    const raw = await fromCommit(source)
    if (sha(raw) !== expected) fail(`inventory hash mismatch for ${source}`)
    if (kind === 'registry-json-luma' && (!existsSync(dest) || process.argv.includes('--rebase-upstream'))) {
      const owner = inventory.items.find(item => item.files.some(file => file.source === source))
      const code = await lumaSource(owner.name, target)
      nextTarget = transform(code, source)
    } else if (kind === 'source-hook' || !existsSync(dest)) {
      nextTarget = transform(raw.toString('utf8'), source)
    }
    pending.push([sourceFile, raw])
    if (nextTarget !== undefined) pending.push([dest, nextTarget])
  }
  else {
    if (!existsSync(sourceFile)) fail(`missing snapshot ${source}`)
    if (sha(readFileSync(sourceFile)) !== expected) fail(`hash mismatch for ${source}`)
  }
  if (nextTarget === undefined && !existsSync(dest)) fail(`missing adapted target ${target}`)
  entries.push({ source, sourceSha256: expected, target, adaptation: kind, adaptedSha256: sha(nextTarget === undefined ? readFileSync(dest) : nextTarget) })
}

const assets = []
if (mode === 'update') {
  for (const [source, target] of [['LICENSE.md', 'LICENSE.md'], ['registry/styles/style-luma.css', 'style-luma.css']]) {
    const bytes = await fromCommit(source)
    assets.push({ source, target, sha256: sha(bytes) })
    pending.push([path.join(snapshot, target), bytes])
  }
}
const manifest = { schemaVersion: 1, repository: inventory.repository, commit: inventory.commit, style: inventory.style, license: inventory.license, files: entries, assets: mode === 'update' ? assets : accepted.assets }
if (mode === 'update') {
  pending.push([manifestFile, `${JSON.stringify(manifest, null, 2)}\n`])
  // No working-tree write happens until every source hash, target mapping,
  // collision, transform, and required blob has been validated.
  for (const [filename, value] of pending) save(filename, value)
} else if (mode === 'accept') save(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`)
else {
  if (accepted.commit !== inventory.commit || accepted.style !== inventory.style) fail('snapshot identity mismatch')
  if (!existsSync(path.join(snapshot, 'LICENSE.md')) || !existsSync(path.join(snapshot, 'style-luma.css'))) fail('missing license or style snapshot')
  if (accepted.files.length !== entries.length) fail('manifest coverage mismatch')
  for (let index = 0; index < entries.length; index++) {
    const actual = entries[index]
    const previous = accepted.files[index]
    if (JSON.stringify(actual) !== JSON.stringify(previous)) fail(`adaptation or mapping mismatch for ${actual.source}`)
  }
}
console.log(`ReUI ${mode}: ${sourceFiles.size} source files, ${inventory.items.length} registry entries`)
