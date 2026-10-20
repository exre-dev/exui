import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, cpSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { restoreReuiSnapshot } from './reui-restore.mjs'

const root = path.resolve(import.meta.dirname, '..')
const script = path.join(root, 'scripts/reui-sync.mjs')
const inventoryFile = path.join(root, 'packages/components/upstream/reui/inventory.json')
await restoreReuiSnapshot()

// Maintenance tests use their own Git object database. They never depend on a
// developer's temporary checkout, working-file bytes, or live GitHub responses.
function createUpstreamFixture(temporary, snapshot, includeLuma = true) {
  const checkout = path.join(temporary, 'upstream')
  cpSync(path.join(snapshot, 'source'), checkout, { recursive: true })
  const save = (filename, bytes) => {
    const target = path.join(checkout, filename)
    mkdirSync(path.dirname(target), { recursive: true })
    writeFileSync(target, bytes)
  }
  const manifestFile = path.join(snapshot, 'manifest.json')
  const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'))
  for (const asset of manifest.assets) save(asset.source, readFileSync(path.join(snapshot, asset.target)))
  const inventory = JSON.parse(readFileSync(inventoryFile, 'utf8'))
  for (const item of includeLuma ? inventory.items.filter((entry) => entry.group === 'reui' && entry.disposition === 'include') : []) {
    const files = item.files.map((file) => manifest.files.find((entry) => entry.source === file.source))
      .map((entry) => ({ target: entry.target, content: readFileSync(path.join(root, 'packages/components/src', entry.target), 'utf8') }))
    save(`public/r/styles/radix-luma/${item.name}.json`, JSON.stringify({ files }))
  }
  const git = (...args) => execFileSync('git', args, { cwd: checkout, encoding: 'utf8', stdio: 'pipe' }).trim()
  git('init', '--quiet')
  git('-c', 'core.autocrlf=false', 'add', '--all')
  git('-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', '-c', 'commit.gpgsign=false', 'commit', '--quiet', '-m', 'pinned fixture')
  inventory.commit = manifest.commit = git('rev-parse', 'HEAD')
  writeFileSync(manifestFile, JSON.stringify(manifest))
  const filename = path.join(temporary, 'inventory.json')
  writeFileSync(filename, JSON.stringify(inventory))
  return { inventory, filename, env: { ...process.env, EXUI_REUI_CHECKOUT: checkout } }
}

test('the frozen ReUI snapshot and adapted source are complete', () => {
  const output = execFileSync(process.execPath, [script, '--check'], { cwd: root, encoding: 'utf8' })
  assert.match(output, /148 source files/)
})

test('source hash tampering fails closed', () => {
  const temporary = mkdtempSync(path.join(tmpdir(), 'exui-reui-sync-'))
  try {
    const source = path.join(root, 'packages/components/upstream/reui')
    cpSync(source, path.join(temporary, 'reui'), { recursive: true })
    const manifest = JSON.parse(readFileSync(path.join(temporary, 'reui/manifest.json'), 'utf8'))
    const file = path.join(temporary, 'reui/source', manifest.files[0].source)
    writeFileSync(file, `${readFileSync(file, 'utf8')}\n// tampered\n`)
    assert.throws(() => execFileSync(process.execPath, [script, '--check', '--snapshot', path.join(temporary, 'reui')], { cwd: root, stdio: 'pipe' }), /hash mismatch/)
  } finally {
    rmSync(temporary, { recursive: true, force: true })
  }
})

test('adapted ReUI client directives precede injected Lucide imports', () => {
  const manifest = JSON.parse(readFileSync(path.join(root, 'packages/components/upstream/reui/manifest.json'), 'utf8'))
  for (const entry of manifest.files.filter((file) => file.target.startsWith('components/reui/'))) {
    const source = readFileSync(path.join(root, 'packages/components/src', entry.target), 'utf8')
    const directive = source.indexOf('"use client"')
    if (directive >= 0) {
      const firstImport = source.indexOf('import ')
      assert.ok(firstImport > directive, `${entry.target} puts an import ahead of its client directive`)
    }
  }
})

test('LF and CRLF source and adapter checkouts share the frozen canonical hash', () => {
  const temporary = mkdtempSync(path.join(tmpdir(), 'exui-reui-eol-'))
  try {
    const snapshot = path.join(temporary, 'reui')
    const componentRoot = path.join(temporary, 'src')
    cpSync(path.join(root, 'packages/components/upstream/reui'), snapshot, { recursive: true })
    cpSync(path.join(root, 'packages/components/src'), componentRoot, { recursive: true })
    const first = JSON.parse(readFileSync(path.join(snapshot, 'manifest.json'), 'utf8')).files[0]
    for (const filename of [path.join(snapshot, 'source', first.source), path.join(componentRoot, first.target)]) {
      const content = readFileSync(filename, 'utf8').replace(/\r\n/g, '\n')
      writeFileSync(filename, content.replace(/\n/g, '\r\n'))
    }
    assert.match(execFileSync(process.execPath, [script, '--check', '--snapshot', snapshot, '--component-root', componentRoot], { cwd: root, encoding: 'utf8' }), /148 source files/)
  } finally {
    rmSync(temporary, { recursive: true, force: true })
  }
})

test('a late inventory failure leaves every planned source and target unchanged', () => {
  const temporary = mkdtempSync(path.join(tmpdir(), 'exui-reui-atomic-'))
  try {
    const snapshot = path.join(temporary, 'reui')
    const componentRoot = path.join(temporary, 'src')
    cpSync(path.join(root, 'packages/components/upstream/reui'), snapshot, { recursive: true })
    cpSync(path.join(root, 'packages/components/src'), componentRoot, { recursive: true })
    const upstream = createUpstreamFixture(temporary, snapshot)
    const inventory = upstream.inventory
    const first = inventory.items.find((item) => item.disposition === 'include').files[0].source
    const last = [...inventory.items].reverse().find((item) => item.disposition === 'include').files.at(-1)
    last.sha256 = '0'.repeat(64)
    const badInventory = upstream.filename
    writeFileSync(badInventory, JSON.stringify(inventory))
    const firstTarget = JSON.parse(readFileSync(path.join(snapshot, 'manifest.json'), 'utf8')).files.find((entry) => entry.source === first).target
    const targetFile = path.join(componentRoot, firstTarget)
    const sourceFile = path.join(snapshot, 'source', first)
    const sentinel = `${readFileSync(targetFile, 'utf8')}\n/* leave untouched */\n`
    writeFileSync(targetFile, sentinel)
    const originalSource = readFileSync(sourceFile)
    assert.throws(() => execFileSync(process.execPath, [script, '--update', '--snapshot', snapshot, '--component-root', componentRoot, '--inventory', badInventory], { cwd: root, env: upstream.env, stdio: 'pipe' }), /inventory hash mismatch/)
    assert.equal(readFileSync(targetFile, 'utf8'), sentinel)
    assert.deepEqual(readFileSync(sourceFile), originalSource)
  } finally {
    rmSync(temporary, { recursive: true, force: true })
  }
})

test('a successful snapshot update preserves an existing reviewed adapter without upstream Luma JSON', () => {
  const temporary = mkdtempSync(path.join(tmpdir(), 'exui-reui-adapter-'))
  try {
    const snapshot = path.join(temporary, 'reui')
    const componentRoot = path.join(temporary, 'src')
    cpSync(path.join(root, 'packages/components/upstream/reui'), snapshot, { recursive: true })
    cpSync(path.join(root, 'packages/components/src'), componentRoot, { recursive: true })
    const upstream = createUpstreamFixture(temporary, snapshot, false)
    const first = JSON.parse(readFileSync(path.join(snapshot, 'manifest.json'), 'utf8')).files.find((file) => file.adaptation === 'registry-json-luma')
    const targetFile = path.join(componentRoot, first.target)
    const sentinel = `${readFileSync(targetFile, 'utf8')}\n/* reviewed adapter */\n`
    writeFileSync(targetFile, sentinel)
    assert.match(execFileSync(process.execPath, [script, '--update', '--snapshot', snapshot, '--component-root', componentRoot, '--inventory', upstream.filename], { cwd: root, env: upstream.env, encoding: 'utf8' }), /148 source files/)
    assert.equal(readFileSync(targetFile, 'utf8'), sentinel)
  } finally {
    rmSync(temporary, { recursive: true, force: true })
  }
})
