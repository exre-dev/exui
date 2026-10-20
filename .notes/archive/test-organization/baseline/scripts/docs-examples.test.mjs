import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { buildSourceLock, initialCoverage, validateCoverage, generatedFiles, writeGenerated, restoreCache, sourceHash, moduleSpecifiers } from './docs-examples.mjs'

const identity = { repository: 'https://github.com/keenthemes/reui', commit: '067aa0dc7f8bbfec1cd76fc5ad31f842be5f569a', base: 'radix', style: 'radix-luma' }
const prefix = 'registry-reui/bases/radix/components/button/'
function fixture() {
  const files = new Map([
    ['LICENSE.md', Buffer.from('MIT\r\n')],
    ['registry-reui/_meta/components/bases/radix/name-index.json', Buffer.from(JSON.stringify({ 'c-button-1': 'button', 'c-button-2': 'button' }))],
    ['registry-reui/_meta/components/bases/radix/button.json', Buffer.from(JSON.stringify({ items: [2, 1].map(n => ({ name: `c-button-${n}`, categories: ['button'], files: [{ path: `components/button/c-button-${n}.tsx` }], meta: { order: 1 } })) }))],
    [`${prefix}c-button-1.tsx`, Buffer.from('import { x } from "./helper"; export default function X() { return x }\r\n')],
    [`${prefix}c-button-2.tsx`, Buffer.from('export default function X() { return null }')],
    [`${prefix}helper.ts`, Buffer.from('export const x = "/image.png"')],
    ['public/image.png', Buffer.from([137, 80, 78, 71, 0, 255])],
  ])
  const source = { listTree: async () => ({ paths: [...files.keys()], truncated: false }), readSource: async p => { assert.ok(files.has(p), p); return files.get(p) } }
  return { files, source, options: { source, identity, catalog: [{ id: 'button', module: 'actions', group: 'components' }], expectedCounts: null } }
}
function temporary(t) { const dir = mkdtempSync(path.join(os.tmpdir(), 'exui-examples-')); t.after(() => rmSync(dir, { recursive: true, force: true })); return dir }
async function ready(t) {
  const f = fixture(); const lock = await buildSourceLock(f.options); const coverage = initialCoverage(lock)
  const root = temporary(t)
  return { ...f, lock, coverage, root }
}
const galleryPage = 'import {examples} from "../../examples/button/index.generated"; import {ExampleGallery} from "../../ExampleGallery"; export default function ButtonPage(){return <ExampleGallery examples={examples}/> }'
function installPage(f, text = galleryPage) {
  const page = path.join(f.root, 'packages/docs/src/showcase/pages/components/button.tsx')
  mkdirSync(path.dirname(page), { recursive: true }); writeFileSync(page, text)
  writeFileSync(path.join(f.root, 'packages/docs/src/showcase/ExampleGallery.tsx'), 'export function ExampleGallery(){ return null }')
  writeGenerated(generatedFiles({ ...f, catalog: f.options.catalog }), { root: f.root })
}
test('complete tree joins metadata, numeric tie order, transitive helper and binary asset hashes', async () => {
  const f = fixture(); const lock = await buildSourceLock(f.options)
  assert.deepEqual(lock.families[0].examples, ['c-button-1', 'c-button-2'])
  assert.deepEqual(lock.examples[0].helpers, ['public/image.png', `${prefix}helper.ts`])
  assert.equal(lock.files.find(x => x.source === 'public/image.png').mode, 'binary')
  assert.equal(sourceHash(Buffer.from('a\r\n b\n'), 'text-lf'), sourceHash(Buffer.from('a\n b\n'), 'text-lf'))
  assert.notEqual(sourceHash(Buffer.from([255]), 'binary'), sourceHash(Buffer.from([254]), 'binary'))
})
test('rejects truncated trees, metadata omission, duplicate IDs and unresolved helpers', async () => {
  for (const mutate of [
    f => { f.source.listTree = async () => ({ paths: [...f.files.keys()], truncated: true }) },
    f => f.files.delete('registry-reui/_meta/components/bases/radix/button.json'),
    f => f.files.set('registry-reui/_meta/components/bases/radix/button.json', Buffer.from(JSON.stringify({ items: [{ name: 'c-button-1', files: [{ path: 'components/button/c-button-1.tsx' }] }, { name: 'c-button-1', files: [{ path: 'components/button/c-button-1.tsx' }] }] }))),
    f => f.files.delete(`${prefix}helper.ts`),
  ]) { const f = fixture(); mutate(f); await assert.rejects(buildSourceLock(f.options)) }
})
test('restore verifies all downloads before writes, reuses offline cache and preserves adapters', async t => {
  const f = await ready(t); writeFileSync(path.join(f.root, 'adapter.tsx'), 'handwritten')
  await assert.rejects(restoreCache({ lock: f.lock, snapshot: f.root, readSource: async p => p === 'LICENSE.md' ? Buffer.from('corrupt') : f.files.get(p) }), /hash/)
  assert.equal(existsSync(path.join(f.root, 'cache')), false)
  await restoreCache({ lock: f.lock, snapshot: f.root, readSource: f.source.readSource })
  const result = await restoreCache({ lock: f.lock, snapshot: f.root, readSource: () => { throw Error('network forbidden') } })
  assert.equal(result.restored, 0)
  assert.equal(readFileSync(path.join(f.root, 'adapter.tsx'), 'utf8'), 'handwritten')
  writeFileSync(path.join(f.root, 'cache', f.lock.files[0].source), 'corrupt')
  await assert.rejects(restoreCache({ lock: f.lock, snapshot: f.root, readSource: f.source.readSource }), /hash/)
})
test('coverage requires exact sets, identity, hashes, paths, valid gaps, complete upstream families', async t => {
  const f = await ready(t)
  assert.throws(() => validateCoverage({ ...f, catalog: f.options.catalog }), /pending|legacy/)
  validateCoverage({ ...f, catalog: f.options.catalog, allowPending: true })
  for (const mutate of [
    c => c.examples.pop(), c => c.examples.push(c.examples[0]), c => { c.commit = '0'.repeat(40) },
    c => { c.examples[0].sourceSha256 = '0'.repeat(64) }, c => { c.examples[0].target = '../escape.tsx' },
    c => { c.examples[0].status = 'excluded' }, c => { c.examples[0].status = 'gap' },
    c => { c.familyModes.button = 'upstream' },
  ]) { const coverage = structuredClone(f.coverage); mutate(coverage); assert.throws(() => validateCoverage({ ...f, coverage, catalog: f.options.catalog, allowPending: true })) }
})
test('generation is stable, scoped, detects stale/duplicate registrations and refuses handwritten targets', async t => {
  const f = await ready(t)
  const files = generatedFiles({ ...f, catalog: f.options.catalog })
  assert.deepEqual(files, generatedFiles({ ...f, catalog: f.options.catalog }))
  writeGenerated(files, { root: f.root })
  writeGenerated(files, { root: f.root, check: true })
  const [name, text] = [...files][0]
  writeFileSync(path.join(f.root, name), text + '\n// duplicate registration')
  assert.throws(() => writeGenerated(files, { root: f.root, check: true }), /stale/)
  writeFileSync(path.join(f.root, name), 'handwritten')
  assert.throws(() => writeGenerated(files, { root: f.root }), /handwritten/)
})
test('AST imports include type, reexports and dynamic imports but ignore comments and strings', () => {
  assert.deepEqual(moduleSpecifiers('// import x from "fake"\nconst text="import x from fake"; import type {A} from "a"; export {b} from "b"; type C=import("c").C; import("d")').sort(), ['a', 'b', 'c', 'd'])
})
test('adapted targets reject private/shared runtimes in type imports, reexports and dynamic imports', async t => {
  const f = await ready(t); const entry = f.coverage.examples[0]
  entry.status = 'adapted'; entry.layout = 'half'; entry.target = `packages/docs/src/showcase/examples/button/${entry.id}.tsx`
  mkdirSync(path.dirname(path.join(f.root, entry.target)), { recursive: true })
  for (const bad of ['import type {X} from "@/private";', 'export {X} from "@exre/exui/private";', 'const x=import("recharts");', 'import {X} from "@radix-ui/react-dialog";', 'import {X} from "@base-ui/react/dialog";', 'import {X} from "../../../../../../components/src/private";']) {
    writeFileSync(path.join(f.root, entry.target), bad + '\nexport default function X(){return null}')
    assert.throws(() => validateCoverage({ ...f, catalog: f.options.catalog, allowPending: true }), /forbidden/)
  }
  writeFileSync(path.join(f.root, entry.target), 'import {Button} from "@exre/exui"; export default function X(){return null}')
  validateCoverage({ ...f, catalog: f.options.catalog, allowPending: true })
  rmSync(path.join(f.root, entry.target))
  assert.throws(() => validateCoverage({ ...f, catalog: f.options.catalog, allowPending: true }), /missing/)
})
test('restore failure half way through a batch publishes no partial cache and preserves existing bytes', async t => {
  const f = await ready(t); const existing = f.lock.files[0]
  mkdirSync(path.dirname(path.join(f.root, 'cache', existing.source)), { recursive: true })
  writeFileSync(path.join(f.root, 'cache', existing.source), f.files.get(existing.source))
  let read = 0
  await assert.rejects(restoreCache({ lock: f.lock, snapshot: f.root, readSource: async p => { if (++read === 3) throw Error('interrupted download'); return f.files.get(p) } }), /interrupted/)
  assert.ok(read >= 3)
  assert.deepEqual(readFileSync(path.join(f.root, 'cache', existing.source)), f.files.get(existing.source))
  for (const file of f.lock.files.slice(1)) assert.equal(existsSync(path.join(f.root, 'cache', file.source)), false)
})
test('lock rejects omitted hashes, changed source family, missing helper records and changed ordered sets', async t => {
  const f = await ready(t)
  for (const mutate of [l => l.files.pop(), l => { l.examples[0].sourceSha256 = '0'.repeat(64) }, l => { l.examples[0].family = 'alert' }, l => { l.families[0].examples.reverse() }, l => { l.families.push(l.families[0]) }, l => { l.commit = '0'.repeat(40) }]) {
    const lock = structuredClone(f.lock); mutate(lock)
    assert.throws(() => validateCoverage({ ...f, lock, catalog: f.options.catalog, allowPending: true }))
  }
})
test('initial statuses exclude only File Upload, valid gaps complete coverage without adapting files', async t => {
  const f = await ready(t)
  for (const entry of f.coverage.examples) { entry.status = 'gap'; entry.reason = 'Missing public API X'; entry.evidence = [entry.source]; entry.followup = 'Expose API X in a separate component change' }
  f.coverage.familyModes.button = 'upstream'
  installPage(f)
  assert.deepEqual(validateCoverage({ ...f, catalog: f.options.catalog }), { adapted: 0, gap: 2, pending: 0, excluded: 0, legacy: 0, upstream: 1 })
  const generated = generatedFiles({ ...f, catalog: f.options.catalog })
  assert.match(generated.get('packages/docs/src/showcase/component-loaders.generated.ts'), /import\("\.\/pages\/components\/button"\)/)
})
test('upstream pages cannot omit, filter, duplicate, conditionally mount or disconnect their own generated gallery', async t => {
  const f = await ready(t)
  for (const entry of f.coverage.examples) { entry.status = 'gap'; entry.reason = 'Public API X missing'; entry.evidence = [entry.source]; entry.followup = 'Expose X separately' }
  f.coverage.familyModes.button = 'upstream'
  const imports = 'import {examples} from "../../examples/button/index.generated"; import {ExampleGallery} from "../../ExampleGallery"; '
  for (const text of [
    'export default function ButtonPage(){return null}',
    imports + 'export default function ButtonPage(){return <div/>}',
    imports + 'export default function ButtonPage(){return <ExampleGallery examples={[]}/>}',
    imports + 'export default function ButtonPage(){return <ExampleGallery examples={examples.slice(0,1)}/>}',
    imports + 'export default function ButtonPage(){return <ExampleGallery examples={examples.filter(Boolean)}/>}',
    imports + 'export default function ButtonPage(){return <ExampleGallery examples={[...examples,...examples]}/>}',
    imports + 'export default function ButtonPage(){return <><ExampleGallery examples={examples}/><ExampleGallery examples={examples}/></>}',
    imports + 'export default function ButtonPage(){return <>{false && <ExampleGallery examples={examples}/>}</>}',
    imports + 'export default function ButtonPage(){return false ? <ExampleGallery examples={examples}/> : null}',
    imports + 'export default function ButtonPage(){const unused=<ExampleGallery examples={examples}/>; return null}',
    imports + 'const DropChildren=()=>null; export default function ButtonPage(){return <DropChildren><ExampleGallery examples={examples}/></DropChildren>}',
    imports + 'export default function ButtonPage(examples){return <ExampleGallery examples={examples}/>}',
    imports + 'export default function ButtonPage(){const examples=[];return <ExampleGallery examples={examples}/>}',
  ]) {
    installPage(f, text)
    assert.throws(() => validateCoverage({ ...f, catalog: f.options.catalog }), /gallery|registration|page contract/i, text)
  }
})
test('upstream page connection permits import/local aliases and real extensions for an all-gap family', async t => {
  const f = await ready(t)
  for (const entry of f.coverage.examples) { entry.status = 'gap'; entry.reason = 'Public API X missing'; entry.evidence = [entry.source]; entry.followup = 'Expose X separately' }
  f.coverage.familyModes.button = 'upstream'
  installPage(f, 'import {examples as registered} from "../../examples/button/index.generated"; import {ExampleGallery as Gallery} from "../../ExampleGallery"; const all=registered; const G=Gallery; const Page=()=> <><G examples={all}/><div data-example-kind="exui-extension">Extension</div></>; export default Page')
  assert.equal(validateCoverage({ ...f, catalog: f.options.catalog }).gap, 2)
})
test('default page and registration aliases are stable against reassignment, updates and destructuring writes', async t => {
  const f = await ready(t)
  for (const entry of f.coverage.examples) { entry.status = 'gap'; entry.reason = 'Public API X missing'; entry.evidence = [entry.source]; entry.followup = 'Expose X separately' }
  f.coverage.familyModes.button = 'upstream'
  const imports = 'import type {ComponentType} from "react"; import {examples} from "../../examples/button/index.generated"; import {ExampleGallery} from "../../ExampleGallery"; '
  for (const code of [
    'let Page: ComponentType = () => <ExampleGallery examples={examples}/>; Page = () => null; export default Page;',
    'let Page: ComponentType = () => <ExampleGallery examples={examples}/>; export default Page;',
    'function Page(){return <ExampleGallery examples={examples}/>}; Page=()=>null; export default Page;',
    'function Page(){return <ExampleGallery examples={examples}/>}; ({Page}={Page:()=>null}); export default Page;',
    'function Page(){return <ExampleGallery examples={examples}/>}; [Page]=[()=>null]; export default Page;',
    'function Page(){return <ExampleGallery examples={examples}/>}; const ignored=(Page=()=>null); export default Page;',
    'function Page(){return <ExampleGallery examples={examples}/>}; const reset=()=>{Page=()=>null}; const ignored=reset(); export default Page;',
    'function Page(){return <ExampleGallery examples={examples}/>}; function reset(){Page=()=>null} export default Page;',
    'function Page(){return <ExampleGallery examples={examples}/>}; function reset(){({Page}={Page:()=>null})} export default Page;',
    'function Page(){return <ExampleGallery examples={examples}/>}; function reset(){Page++} export default Page;',
    'function Page(){return <ExampleGallery examples={examples}/>}; const ignored=Page++; export default Page;',
  ]) {
    installPage(f, imports + code)
    assert.throws(() => validateCoverage({ ...f, catalog: f.options.catalog }), /stable|assignment|pure|mutable|page contract|registration\/gallery contract/i, code)
  }
})
test('name-index is mandatory and must match the full source ID to family mapping', async () => {
  for (const mutate of [
    f => f.files.delete('registry-reui/_meta/components/bases/radix/name-index.json'),
    f => f.files.set('registry-reui/_meta/components/bases/radix/name-index.json', Buffer.from('{"c-button-1":"button"}')),
    f => f.files.set('registry-reui/_meta/components/bases/radix/name-index.json', Buffer.from('{"c-button-1":"wrong","c-button-2":"button"}')),
  ]) { const f = fixture(); mutate(f); await assert.rejects(buildSourceLock(f.options), /name-index/) }
})
test('valid digest mode with matching raw hash cannot replace canonical text normalization', async t => {
  const f = await ready(t); const lock = structuredClone(f.lock); const coverage = structuredClone(f.coverage)
  const main = lock.examples[0]; const file = lock.files.find(x => x.source === main.source)
  file.mode = 'binary'; file.sha256 = sourceHash(f.files.get(file.source), 'binary'); main.sourceSha256 = file.sha256; coverage.examples.find(x => x.id === main.id).sourceSha256 = file.sha256
  assert.throws(() => validateCoverage({ ...f, lock, coverage, catalog: f.options.catalog, allowPending: true }), /mode/)
})
test('adapted registrations retain exact ordered IDs and generation check never rewrites a modified file', async t => {
  const f = await ready(t)
  for (const entry of f.coverage.examples) {
    entry.status = 'adapted'; entry.layout = 'half'; entry.target = `packages/docs/src/showcase/examples/button/${entry.id}.tsx`
    mkdirSync(path.dirname(path.join(f.root, entry.target)), { recursive: true }); writeFileSync(path.join(f.root, entry.target), 'export default function X(){return null}')
  }
  const generated = generatedFiles({ ...f, catalog: f.options.catalog }); writeGenerated(generated, { root: f.root })
  const target = path.join(f.root, 'packages/docs/src/showcase/examples/button/index.generated.ts')
  const expected = readFileSync(target, 'utf8'); assert.equal((expected.match(/id: "c-button-1"/g) ?? []).length, 1)
  assert.ok(expected.indexOf('id: "c-button-1"') < expected.indexOf('id: "c-button-2"'))
  const wrong = expected.replace('id: "c-button-2"', 'id: "c-button-1"'); writeFileSync(target, wrong)
  assert.throws(() => writeGenerated(generated, { root: f.root, check: true }), /stale/)
  assert.equal(readFileSync(target, 'utf8'), wrong)
})
test('AST import audit follows private example helpers and rejects a hidden shared runtime', async t => {
  const f = await ready(t); const entry = f.coverage.examples[0]
  entry.status = 'adapted'; entry.layout = 'half'; entry.target = `packages/docs/src/showcase/examples/button/${entry.id}.tsx`
  mkdirSync(path.dirname(path.join(f.root, entry.target)), { recursive: true })
  writeFileSync(path.join(f.root, entry.target), 'import "./helper"; export default function X(){return null}')
  writeFileSync(path.join(path.dirname(path.join(f.root, entry.target)), 'helper.ts'), 'export type X = import("sonner").X')
  assert.throws(() => validateCoverage({ ...f, catalog: f.options.catalog, allowPending: true }), /forbidden.*sonner/)
})
test('upstream literal assets missing from Git remain explicit provenance findings; metadata-declared absence fails', async () => {
  const f = fixture(); f.files.set(`${prefix}helper.ts`, Buffer.from('export const x="/missing.png"'))
  const lock = await buildSourceLock(f.options)
  assert.deepEqual(lock.examples[0].unresolvedResources, [{ source: `${prefix}helper.ts`, value: '/missing.png', reason: 'not present in pinned Git tree' }])
  const metadata = 'registry-reui/_meta/components/bases/radix/button.json'; const data = JSON.parse(f.files.get(metadata)); data.items[0].files.push({ path: 'components/button/missing.ts' }); f.files.set(metadata, Buffer.from(JSON.stringify(data)))
  await assert.rejects(buildSourceLock(f.options), /missing metadata file/)
})
test('malformed source lock paths and SHA cannot escape restore directory', async t => {
  const f = await ready(t)
  for (const mutate of [l => { l.files[0].source = '../escape' }, l => { l.files[0].sha256 = 'bad' }, l => { l.files.push(l.files[0]) }]) {
    const lock = structuredClone(f.lock); mutate(lock)
    await assert.rejects(restoreCache({ lock, snapshot: f.root, readSource: f.source.readSource }))
  }
})
