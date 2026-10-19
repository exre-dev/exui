import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, symlinkSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'
import { validateExampleAssets } from '../../../../scripts/docs-example-assets.mjs'

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex')
function fixture(t) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'exui-example-assets-'))
  t.after(() => {
    assert.equal(path.dirname(root), path.resolve(os.tmpdir()))
    assert.ok(path.basename(root).startsWith('exui-example-assets-'))
    rmSync(root, { recursive: true, force: true })
  })
  const put = (target, bytes) => { const filename = path.join(root, 'packages/docs', target); mkdirSync(path.dirname(filename), { recursive: true }); writeFileSync(filename, bytes) }
  const bytes = Buffer.from([0, 255, 13, 10, 128, 137, 80, 78, 71])
  const photo = { source: 'https://images.example.test/original.png', request: 'https://images.example.test/original.png', resolved: 'https://images.example.test/original.png', target: 'public/examples/reui/photos/image.png', sha256: sha256(bytes), status: 'downloaded', adaptation: 'Original localized.', examples: ['c-avatar-1'] }
  put(photo.target, bytes)
  const base = { schemaVersion: 1, base: 'packages/docs' }
  const assets = { ...base, files: [photo] }
  const flags = { ...base, preservedSources: 'public/examples/reui/flags/sources.json', files: [] }
  const retained = { files: [] }
  for (const code of ['us', 'gb', 'ca', 'au', 'de', 'my', 'es', 'jp', 'fr', 'it']) {
    const body = Buffer.from(`<svg>${code}</svg>\r\n`)
    const item = { code, source: `https://flagcdn.com/${code}.svg`, target: `public/examples/reui/flags/${code}.svg`, sha256: sha256(body), owner: 'existing-style-proof', staged: false, examples: ['c-data-grid-1'] }
    flags.files.push(item); retained.files.push({ file: `${code}.svg`, source: item.source, sha256: item.sha256 }); put(item.target, body)
  }
  const retainedBytes = Buffer.from(JSON.stringify(retained))
  flags.preservedSourcesSha256 = sha256(retainedBytes); put(flags.preservedSources, retainedBytes)
  const emoji = { ...base, package: 'emojibase-data', version: '17.0.0', files: [] }
  for (const [relative, body] of [['en/data.json', '[1,2]'], ['LICENSE', 'MIT License\nPermission is hereby granted']]) {
    const data = Buffer.from(body); const item = { source: `https://cdn.jsdelivr.net/npm/emojibase-data@17.0.0/${relative}`, target: `public/examples/reui/emoji/emojibase-data-17.0.0/${relative}`, sha256: sha256(data), bytes: data.length }; emoji.files.push(item); put(item.target, data)
  }
  return { root, assets, flags, emoji, put, bytes }
}
test('raw binary assets, emoji license and ten unchanged original flags verify offline', t => {
  const f = fixture(t); const result = validateExampleAssets(f)
  assert.equal(result.uniqueFiles, 13); assert.equal(result.preservedFlags, 10); assert.equal(result.sharedAliases, 0)
})

test('locked asset bytes survive Windows Git checkout filters', t => {
  const f = fixture(t)
  const metadataFile = path.join(f.root, 'packages/docs', f.flags.preservedSources)
  const metadata = Buffer.from(`${JSON.stringify(JSON.parse(readFileSync(metadataFile, 'utf8')), null, 2).replaceAll('\n', '\r\n')}\r\n`)
  f.put(f.flags.preservedSources, metadata)
  f.flags.preservedSourcesSha256 = sha256(metadata)
  writeFileSync(path.join(f.root, '.gitattributes'), readFileSync(path.resolve(import.meta.dirname, '../../../../.gitattributes')))
  const git = (...args) => execFileSync('git', ['-c', 'core.autocrlf=true', ...args], { cwd: f.root, stdio: ['ignore', 'pipe', 'pipe'] })
  git('init', '--quiet')
  const files = [...new Set([
    ...f.assets.files.map(file => file.target),
    ...f.flags.files.map(file => file.target),
    f.flags.preservedSources,
    ...f.emoji.files.map(file => file.target),
  ])].map(file => `packages/docs/${file}`)
  git('add', '--', '.gitattributes', ...files)
  git('diff', '--cached', '--check')
  const checkout = path.join(f.root, 'checked-out')
  mkdirSync(checkout)
  git('checkout-index', `--prefix=${checkout.replaceAll('\\', '/')}/`, '--', ...files)
  assert.equal(validateExampleAssets({ ...f, root: checkout }).uniqueFiles, 13)
})
test('shared aliases require identical locked bytes and preserve substitution facts', t => {
  const f = fixture(t); f.assets.files.push({ source: 'https://images.example.test/dead.png', request: 'https://images.example.test/dead.png', target: f.assets.files[0].target, sha256: f.assets.files[0].sha256, status: 'substituted', originalFailure: 'HTTP 404', substituteSource: f.assets.files[0].source, adaptation: 'Original HTTP 404; use archived portrait at the same geometry.', examples: ['c-avatar-2'] })
  assert.equal(validateExampleAssets(f).sharedAliases, 1)
  f.assets.files[1].sha256 = '0'.repeat(64)
  assert.throws(() => validateExampleAssets(f), /image\.png.*conflict|conflict.*image\.png/)
})
test('missing and corrupt asset bytes fail with their target and reason without network', t => {
  const f = fixture(t); const target = f.assets.files[0].target
  rmSync(path.join(f.root, 'packages/docs', target))
  assert.throws(() => validateExampleAssets(f), /image\.png.*missing|missing.*image\.png/)
  f.put(target, Buffer.from('corrupt'))
  assert.throws(() => validateExampleAssets(f), /image\.png.*SHA|SHA.*image\.png/)
})
test('traversal, absolute, Windows drive, backslash and ambiguous target names are rejected', t => {
  const f = fixture(t)
  for (const target of ['../escape.png', '/tmp/escape.png', 'C:/escape.png', 'public\\examples\\escape.png', 'public/examples/reui/photos/../image.png', 'public/examples/reui/photos/image.png.']) {
    f.assets.files[0].target = target
    assert.throws(() => validateExampleAssets(f), /path|target/)
  }
})
test('invalid sources, hashes, byte counts, manifest base and duplicate source-target rows fail', t => {
  const f = fixture(t)
  for (const mutate of [
    c => { c.assets.files[0].source = 'javascript:alert(1)' },
    c => { c.assets.files[0].sha256 = 'bad' },
    c => { c.emoji.files[0].bytes++ },
    c => { c.assets.base = '..' },
    c => { c.assets.files.push({ ...c.assets.files[0] }) },
  ]) { const copy = { ...f, assets: structuredClone(f.assets), flags: structuredClone(f.flags), emoji: structuredClone(f.emoji) }; mutate(copy); assert.throws(() => validateExampleAssets(copy)) }
})
test('preserved proof flag digest and relationship cannot be silently replaced or dropped', t => {
  const f = fixture(t)
  const copy = { ...f, flags: structuredClone(f.flags) }; copy.flags.files[0].sha256 = '0'.repeat(64)
  assert.throws(() => validateExampleAssets(copy), /preserved|flag|SHA/)
  copy.flags.files = copy.flags.files.slice(1)
  assert.throws(() => validateExampleAssets(copy), /preserved.*us|us.*preserved/)
})
test('emoji LICENSE is mandatory and locked package/version/source must correspond', t => {
  const f = fixture(t)
  for (const mutate of [c => c.files.pop(), c => { c.files[0].source = 'https://cdn.jsdelivr.net/npm/emojibase-data@18.0.0/en/data.json' }, c => { c.version = '../escape' }]) {
    const emoji = structuredClone(f.emoji); mutate(emoji); assert.throws(() => validateExampleAssets({ ...f, emoji }), /emoji|LICENSE|version|source/)
  }
})
test('substitution records require original failure evidence and archived replacement identity', t => {
  const f = fixture(t)
  const original = f.assets.files[0]
  const replacement = { source: 'https://images.example.test/dead.png', request: 'https://images.example.test/dead.png', target: original.target, sha256: original.sha256, status: 'substituted', originalFailure: 'HTTP 404', substituteSource: original.source, adaptation: 'Use archived image at the same geometry.', examples: ['c-avatar-2'] }
  f.assets.files.push(replacement)
  for (const mutate of [row => { row.originalFailure = '' }, row => { row.substituteSource = 'https://images.example.test/unarchived.png' }]) {
    const assets = structuredClone(f.assets); mutate(assets.files[1]); assert.throws(() => validateExampleAssets({ ...f, assets }), /image\.png.*substitution|image\.png.*replacement/)
  }
})
test('symlink or Windows junction parents cannot redirect a locked asset outside its public path', t => {
  const f = fixture(t)
  const photos = path.join(f.root, 'packages/docs/public/examples/reui/photos')
  const other = path.join(f.root, 'redirected-assets')
  mkdirSync(other); writeFileSync(path.join(other, 'image.png'), f.bytes)
  rmSync(photos, { recursive: true })
  symlinkSync(other, photos, process.platform === 'win32' ? 'junction' : 'dir')
  assert.throws(() => validateExampleAssets(f), /image\.png.*symlink/)
})
function extraPhoto(f) {
  const row = { ...f.assets.files[0], source: 'https://images.example.test/second.png', request: 'https://images.example.test/second.png', resolved: 'https://images.example.test/second.png', target: 'public/examples/reui/photos/second.png' }
  f.assets.files.push(row); f.put(row.target, f.bytes)
}
function sourceFile(f, text) {
  const filename = path.join(f.root, 'packages/docs/src/showcase/examples/proof.tsx')
  mkdirSync(path.dirname(filename), { recursive: true }); writeFileSync(filename, text)
}
test('omitted photo, migration flag and non-LICENSE emoji records fail against the actual managed file set', t => {
  for (const kind of ['photo', 'flag', 'emoji']) {
    const f = fixture(t)
    if (kind === 'photo') { extraPhoto(f); f.assets.files.shift() }
    if (kind === 'flag') { const row = { code: 'ad', source: 'https://flagcdn.com/ad.svg', target: 'public/examples/reui/flags/ad.svg', sha256: sha256(f.bytes), owner: 'migration', staged: true, examples: ['c-combobox-1'] }; f.put(row.target, f.bytes) }
    if (kind === 'emoji') f.emoji.files.shift()
    assert.throws(() => validateExampleAssets(f), /unrecorded|not in.*manifest|missing.*provenance/)
  }
})
test('removing both a provenance row and file cannot hide static example/lookup references', t => {
  for (const kind of ['photo', 'flag', 'emoji']) {
    const f = fixture(t); let target
    if (kind === 'photo') { extraPhoto(f); target = f.assets.files.shift().target }
    if (kind === 'flag') target = 'public/examples/reui/flags/ad.svg'
    if (kind === 'emoji') target = f.emoji.files.shift().target
    const filename = path.join(f.root, 'packages/docs', target)
    rmSync(filename, { force: true }); sourceFile(f, `export const lookup={source:${JSON.stringify(target.slice('public'.length))}}`)
    assert.throws(() => validateExampleAssets(f), /reference.*provenance|reference.*missing|unrecorded.*reference/)
  }
})
test('extra unrecorded managed files and symlink/junction directories are rejected', t => {
  const f = fixture(t); f.put('public/examples/reui/photos/unrecorded.png', f.bytes)
  assert.throws(() => validateExampleAssets(f), /unrecorded\.png.*unrecorded|unrecorded\.png.*manifest/)
  rmSync(path.join(f.root, 'packages/docs/public/examples/reui/photos/unrecorded.png'))
  const elsewhere = path.join(f.root, 'unrecorded-link-target'); mkdirSync(elsewhere)
  symlinkSync(elsewhere, path.join(f.root, 'packages/docs/public/examples/reui/photos/link'), process.platform === 'win32' ? 'junction' : 'dir')
  assert.throws(() => validateExampleAssets(f), /link.*symlink|symlink.*link/)
})
test('dynamic flag template codes and emoji dataUrl base retain their statically configured dependencies', t => {
  const f = fixture(t)
  sourceFile(f, 'const countries=[{code:"ad"}]; export const image=countries.map(item=>`/examples/reui/flags/${item.code.toLowerCase()}.svg`)')
  assert.throws(() => validateExampleAssets(f), /ad\.svg.*reference|reference.*ad\.svg/)
  sourceFile(f, 'export const picker=<EmojiPicker locale="en" dataUrl="/examples/reui/emoji/emojibase-data-17.0.0"/>')
  assert.throws(() => validateExampleAssets(f), /messages\.json|shortcodes/)
})
test('static reference audit reads real AST literals and protects the allowed flag metadata digest', t => {
  const f = fixture(t)
  sourceFile(f, '// "/examples/reui/photos/not-a-real-reference.png"\nexport const lookup={source:"/examples/reui/photos/image.png"}')
  assert.equal(validateExampleAssets(f).referencedFiles, 1)
  f.put(f.flags.preservedSources, '{"files":[]}')
  assert.throws(() => validateExampleAssets(f), /sources\.json.*SHA-256/)
})
test('finite dynamic image calls require complete family lookup and source-matching provenance', t => {
  const f = fixture(t)
  const dir = path.join(f.root, 'packages/docs/src/showcase/examples')
  sourceFile(f, 'import picture from "./assets.generated"; export const images=Array.from({length:2}).map((_,i)=>picture(`https://images.example.test/image-${i+1}.png`))')
  const lookup = map => writeFileSync(path.join(dir, 'assets.generated.ts'), `const assets:Readonly<Record<string,string>>=${JSON.stringify(map)}; export default function picture(source:string){return assets[source]}`)
  lookup({})
  assert.throws(() => validateExampleAssets(f), /image-1\.png.*lookup|lookup.*image-1\.png/)
  f.assets.files.push({ ...f.assets.files[0], source: 'https://images.example.test/image-1.png' })
  lookup({ 'https://images.example.test/image-1.png': '/examples/reui/photos/image.png' })
  assert.throws(() => validateExampleAssets(f), /image-2\.png.*lookup|lookup.*image-2\.png/)
  const target = '/examples/reui/photos/image.png'
  lookup({ 'https://images.example.test/image-1.png': target, 'https://images.example.test/image-2.png': target })
  assert.throws(() => validateExampleAssets(f), /source.*provenance|provenance.*source/)
  f.assets.files.push({ ...f.assets.files[0], source: 'https://images.example.test/image-2.png' })
  const result = validateExampleAssets(f)
  assert.equal(result.sharedAliases, 2); assert.equal(result.imageLookupCalls, 1); assert.equal(result.finiteImageUrls, 2)
  sourceFile(f, 'import picture from "./assets.generated"; export const unconstrained=(url:string)=>picture(url)')
  assert.throws(() => validateExampleAssets(f), /not a finite supported source expression/)
})
test('finite image helpers resolve constant map lengths and literal call arguments without executing source', t => {
  const f = fixture(t); const dir = path.join(f.root, 'packages/docs/src/showcase/examples')
  sourceFile(f, 'import image from "./assets.generated"; const COUNT=1; const photo=(id:string)=>image(`https://images.example.test/${id}.png`); export const all=Array.from({length:COUNT}).map((_,index)=>image(`https://images.example.test/image-${index+1}.png`)); export const avatar=photo("original")')
  writeFileSync(path.join(dir, 'assets.generated.ts'), 'const assets={"https://images.example.test/original.png":"/examples/reui/photos/image.png","https://images.example.test/image-1.png":"/examples/reui/photos/image.png"}; export default function image(source:string){return assets[source]}')
  f.assets.files.push({ ...f.assets.files[0], source: 'https://images.example.test/image-1.png' })
  const result = validateExampleAssets(f)
  assert.equal(result.sharedAliases, 1); assert.equal(result.imageLookupCalls, 2); assert.equal(result.finiteImageUrls, 2)
})
