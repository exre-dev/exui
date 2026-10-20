import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { readUpstreamFile, restoreReuiSnapshot } from './reui-restore.mjs'

const hash = (text) => createHash('sha256').update(text).digest('hex')

function fixture(t) {
  const snapshot = mkdtempSync(path.join(tmpdir(), 'exui-reui-restore-'))
  t.after(() => rmSync(snapshot, { recursive: true, force: true }))
  const blobs = new Map([
    ['registry/button.tsx', 'export const Button = 1\n'],
    ['registry/styles/style-luma.css', '.cn-button { display: flex; }\n'],
    ['LICENSE.md', 'fixture license\n'],
  ])
  const manifest = {
    schemaVersion: 1,
    repository: 'https://github.com/keenthemes/reui',
    commit: '1234567890abcdef1234567890abcdef12345678',
    style: 'radix-luma',
    license: 'MIT',
    files: [{ source: 'registry/button.tsx', sourceSha256: hash(blobs.get('registry/button.tsx')) }],
    assets: [
      { source: 'LICENSE.md', target: 'LICENSE.md', sha256: hash(blobs.get('LICENSE.md')) },
      { source: 'registry/styles/style-luma.css', target: 'style-luma.css', sha256: hash(blobs.get('registry/styles/style-luma.css')) },
    ],
  }
  const saveManifest = () => writeFileSync(path.join(snapshot, 'manifest.json'), `${JSON.stringify(manifest)}\n`)
  saveManifest()
  writeFileSync(path.join(snapshot, 'LICENSE.md'), blobs.get('LICENSE.md'))
  const readSource = async (source) => {
    assert.ok(blobs.has(source), `unexpected upstream file ${source}`)
    return Buffer.from(blobs.get(source))
  }
  return { snapshot, manifest, blobs, readSource, saveManifest }
}

test('a cold restore reconstructs pinned sources and style without rewriting metadata or adapters', async (t) => {
  const f = fixture(t)
  const accepted = readFileSync(path.join(f.snapshot, 'manifest.json'))
  mkdirSync(path.join(f.snapshot, 'adapters'))
  writeFileSync(path.join(f.snapshot, 'adapters/button.patch'), 'reviewed adaptation\n')
  await restoreReuiSnapshot({ snapshot: f.snapshot, readSource: f.readSource })
  assert.equal(readFileSync(path.join(f.snapshot, 'source/registry/button.tsx'), 'utf8'), 'export const Button = 1\n')
  assert.equal(readFileSync(path.join(f.snapshot, 'style-luma.css'), 'utf8'), '.cn-button { display: flex; }\n')
  assert.deepEqual(readFileSync(path.join(f.snapshot, 'manifest.json')), accepted)
  assert.equal(readFileSync(path.join(f.snapshot, 'adapters/button.patch'), 'utf8'), 'reviewed adaptation\n')
  // A complete cache must remain usable with the network unavailable.
  await restoreReuiSnapshot({ snapshot: f.snapshot, readSource: () => { throw new Error('offline') } })
})

test('a missing cached file is restored while canonical CRLF cache bytes are preserved', async (t) => {
  const f = fixture(t)
  await restoreReuiSnapshot({ snapshot: f.snapshot, readSource: f.readSource })
  const source = path.join(f.snapshot, 'source/registry/button.tsx')
  writeFileSync(source, 'export const Button = 1\r\n')
  rmSync(path.join(f.snapshot, 'style-luma.css'))
  await restoreReuiSnapshot({ snapshot: f.snapshot, readSource: f.readSource })
  assert.equal(readFileSync(source, 'utf8'), 'export const Button = 1\r\n')
  assert.equal(readFileSync(path.join(f.snapshot, 'style-luma.css'), 'utf8'), f.blobs.get('registry/styles/style-luma.css'))
})

test('a downloaded hash mismatch leaves the cold cache untouched', async (t) => {
  const f = fixture(t)
  await assert.rejects(restoreReuiSnapshot({
    snapshot: f.snapshot,
    readSource: async (source) => source.endsWith('.css') ? Buffer.from('tampered') : f.readSource(source),
  }), /hash mismatch/)
  assert.equal(existsSync(path.join(f.snapshot, 'source')), false)
  assert.equal(existsSync(path.join(f.snapshot, 'style-luma.css')), false)
  assert.equal(readFileSync(path.join(f.snapshot, 'LICENSE.md'), 'utf8'), 'fixture license\n')
})

test('a failed download does not publish earlier successful downloads', async (t) => {
  const f = fixture(t)
  await assert.rejects(restoreReuiSnapshot({
    snapshot: f.snapshot,
    readSource: async (source) => {
      if (source.endsWith('.css')) throw new Error('network unavailable')
      return f.readSource(source)
    },
  }), /network unavailable/)
  assert.equal(existsSync(path.join(f.snapshot, 'source')), false)
  assert.equal(existsSync(path.join(f.snapshot, 'style-luma.css')), false)
})

test('tampered cache files fail verification instead of being silently replaced', async (t) => {
  const f = fixture(t)
  await restoreReuiSnapshot({ snapshot: f.snapshot, readSource: f.readSource })
  const source = path.join(f.snapshot, 'source/registry/button.tsx')
  writeFileSync(source, 'local tampering\n')
  await assert.rejects(restoreReuiSnapshot({ snapshot: f.snapshot, readSource: f.readSource }), /hash mismatch/)
  assert.equal(readFileSync(source, 'utf8'), 'local tampering\n')
})

test('unlocked assets and escaping paths are rejected before restoring files', async (t) => {
  for (const change of [
    (manifest) => { delete manifest.assets },
    (manifest) => { manifest.files[0].source = '../outside.tsx' },
    (manifest) => { manifest.assets[1].target = '../outside.css' },
    (manifest) => { manifest.assets[1].sha256 = '' },
    (manifest) => { manifest.commit = 'main' },
  ]) {
    const f = fixture(t)
    change(f.manifest)
    f.saveManifest()
    await assert.rejects(restoreReuiSnapshot({ snapshot: f.snapshot, readSource: f.readSource }), /invalid|missing/)
    assert.equal(existsSync(path.join(f.snapshot, 'source')), false)
  }
})

test('HTTP reads request the exact GitHub revision and reject non-success responses', async () => {
  const identity = { repository: 'https://github.com/keenthemes/reui', commit: '1234567890abcdef1234567890abcdef12345678' }
  const bytes = await readUpstreamFile(identity, 'registry/button.tsx', {
    checkout: null,
    fetchImpl: async (url) => {
      assert.equal(url, 'https://raw.githubusercontent.com/keenthemes/reui/1234567890abcdef1234567890abcdef12345678/registry/button.tsx')
      return new Response('pinned source\n')
    },
  })
  assert.equal(bytes.toString(), 'pinned source\n')
  await assert.rejects(readUpstreamFile(identity, 'registry/missing.tsx', {
    checkout: null,
    fetchImpl: async () => new Response('not found', { status: 404 }),
  }), /404.*registry\/missing\.tsx/)
})

test('an explicit local checkout reads the pinned Git blob rather than dirty working files', async (t) => {
  const f = fixture(t)
  const checkout = path.join(f.snapshot, 'checkout')
  mkdirSync(checkout)
  const git = (...args) => execFileSync('git', args, { cwd: checkout, encoding: 'utf8', stdio: 'pipe' }).trim()
  git('init', '--quiet')
  writeFileSync(path.join(checkout, 'source.ts'), 'accepted\n')
  git('add', 'source.ts')
  git('-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', '-c', 'commit.gpgsign=false', 'commit', '--quiet', '-m', 'fixture')
  const commit = git('rev-parse', 'HEAD')
  writeFileSync(path.join(checkout, 'source.ts'), 'dirty working file\n')
  assert.equal((await readUpstreamFile({ ...f.manifest, commit }, 'source.ts', { checkout })).toString(), 'accepted\n')
})
