import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { buildStaticMapping, normalizeBase, normalizeDocsStatic } from '../../../../scripts/docs-static.mjs'
import { assertDocumentLinks, assertExampleInventory } from '../integration/verify-docs-static.mjs'

test('Icons landing pages have standalone HTML/data output in both deployment bases', () => {
  for (const base of ['/', '/exui/']) {
    const mapping = buildStaticMapping({ base, prerenderPaths: ['/en/docs/icons/', '/zh-CN/docs/icons/'] })
    const prefix = base === '/' ? '' : 'exui/'
    for (const locale of ['en', 'zh-CN']) {
      assert.ok(mapping.some(entry => entry.source === `${prefix}${locale}/docs/icons/index.html` && entry.target === `${locale}/docs/icons/index.html`))
      assert.ok(mapping.some(entry => entry.source === `${prefix}${locale}/docs/icons/_.data` && entry.target === `${locale}/docs/icons/_.data`))
    }
  }
  assert.throws(() => buildStaticMapping({ prerenderPaths: ['/en/docs/icons-prototype/'] }), /Unexpected prerender route/)
})

test('rendered document links must resolve to static routes within the deployment base', () => {
  const routes = new Set(['/en/docs/components/button/', '/en/docs/tokens/density/'])
  for (const base of ['/', '/exui/']) {
    const page = `https://docs.example${base}en/docs/components/button/`
    assert.doesNotThrow(() => assertDocumentLinks(`<a href="${base}en/docs/tokens/density/#root">Guide</a><a href="#local">Local</a><a href="https://other.example/docs/file.mdx">External</a>`, page, base, routes))
    assert.throws(() => assertDocumentLinks('<a href="../tokens/density.mdx">Broken</a>', page, base, routes), /no static route/)
    assert.throws(() => assertDocumentLinks(`<a href="${base}en/docs/tokens/missing/">Broken</a>`, page, base, routes), /no static route/)
  }
  assert.throws(() => assertDocumentLinks('<a href="/en/docs/tokens/density/">Missing prefix</a>', 'https://docs.example/exui/en/docs/components/button/', '/exui/', routes), /outside deployment base/)
})

const baselineExamples = [
  { id: 'c-button-1', family: 'button', extension: false, native: false },
  { id: 'exui-glass-1', family: 'glass', extension: false, native: true },
]
const capabilityExamples = [
  { id: 'exui-button-shapes', family: 'button', page: 'components/button', extension: true, native: false },
  { id: 'exui-button-glass', family: 'button', page: 'components/button', extension: true, native: false },
  { id: 'exui-select-apis', family: 'select', page: 'components/select', extension: true, native: false },
]
const capabilityRegistry = { schemaVersion: 1, capabilities: [
  { id: 'button-actions', pages: ['components/button'], examples: ['exui-button-shapes', 'exui-button-glass', 'c-button-1'] },
  { id: 'select-apis', pages: ['components/select'], examples: ['exui-select-apis'] },
] }

test('static inventory accepts exactly the three registered capability extensions beside frozen examples', () => {
  assert.doesNotThrow(() => assertExampleInventory(baselineExamples, [
    ...baselineExamples.map(example => ({ ...example, page: example.family === 'glass' ? 'exui/glass' : 'components/button' })),
    ...capabilityExamples,
  ], capabilityRegistry))
})

test('static inventory rejects missing or changed frozen entries and unauthorized capability additions', () => {
  const current = [...baselineExamples.map(example => ({ ...example, page: 'components/button' })), ...capabilityExamples]
  assert.throws(() => assertExampleInventory(baselineExamples, current.slice(1), capabilityRegistry), /baseline|missing/i)
  assert.throws(() => assertExampleInventory(baselineExamples, current.map(example => example.id === 'c-button-1' ? { ...example, native: true } : example), capabilityRegistry), /baseline|metadata/i)
  assert.throws(() => assertExampleInventory(baselineExamples, [...current, { id: 'exui-rogue', family: 'button', page: 'components/button', extension: true, native: false }], capabilityRegistry), /registered|unregistered/i)
  assert.throws(() => assertExampleInventory(baselineExamples, current.map(example => example.id === 'exui-button-glass' ? { ...example, page: 'components/select', family: 'select' } : example), capabilityRegistry), /family|page/i)
  assert.throws(() => assertExampleInventory(baselineExamples, current.map(example => example.id === 'exui-button-glass' ? { ...example, extension: false } : example), capabilityRegistry), /extension/i)
  assert.throws(() => assertExampleInventory(baselineExamples, current.map(example => example.id === 'exui-select-apis' ? { ...example, native: true } : example), capabilityRegistry), /extension|native/i)
  assert.throws(() => assertExampleInventory(baselineExamples, current.slice(0, -1), capabilityRegistry), /registered|missing/i)
})

const paths = ['/', '/zh-CN/docs/', '/en/docs/', '/zh-CN/docs/exui/', '/en/docs/components/', '/zh-CN/docs/components/button/', '/examples/c-button-1/', '/search/zh-CN/index.json', '/404/']

function fixture(base) {
  const docsRoot = mkdtempSync(path.join(os.tmpdir(), 'exui-docs-static-'))
  const client = path.join(docsRoot, 'build/client')
  const prefix = base === '/' ? '' : base.slice(1)
  const write = (relative, text) => {
    const filename = path.join(client, relative)
    mkdirSync(path.dirname(filename), { recursive: true })
    writeFileSync(filename, text)
  }
  for (const route of paths) {
    const relative = route.slice(1).replace(/\/$/, '')
    if (relative.startsWith('search/')) { write(`${prefix}${relative}`, '{"pages":[]}'); write(`${prefix}${relative}.data`, `data:${route}`); continue }
    write(`${prefix}${relative ? `${relative}/` : ''}index.html`, `<html>${route}</html>`)
    write(`${prefix}${relative ? `${relative}/_.data` : '_.data'}`, `data:${route}`)
  }
  write('assets/app.js', 'console.log("asset")')
  mkdirSync(path.join(docsRoot, 'public'), { recursive: true })
  writeFileSync(path.join(docsRoot, 'public/Icon.png'), 'icon')
  write('Icon.png', 'icon')
  return { docsRoot, client, write }
}

test('base validation rejects URL-like and traversal paths', () => {
  assert.equal(normalizeBase('/'), '/')
  assert.equal(normalizeBase('/exui'), '/exui/')
  for (const invalid of ['https://example.com', '//host/path', '/exui/../', '/a/./b', '/a\\b', '/a?b', '/a#b']) {
    assert.throws(() => normalizeBase(invalid), /EXUI_DOCS_BASE/)
  }
})

test('root and subpath output map only enumerated framework files and preserve URL bytes', async () => {
  for (const base of ['/', '/exui/']) {
    const { docsRoot, client, write } = fixture(base)
    write('unlisted-page/index.html', 'never ship me')
    const result = await normalizeDocsStatic({ docsRoot, base, prerenderPaths: paths, shareExamples: [] })
    assert.equal(result.prerenderPaths, paths.length)
    assert.equal(readFileSync(path.join(client, 'index.html'), 'utf8'), '<html>/</html>')
    assert.equal(readFileSync(path.join(client, 'zh-CN/docs/index.html'), 'utf8'), '<html>/zh-CN/docs/</html>')
    assert.equal(readFileSync(path.join(client, 'en/docs/_.data'), 'utf8'), 'data:/en/docs/')
    assert.equal(readFileSync(path.join(client, 'zh-CN/docs/components/button/index.html'), 'utf8'), '<html>/zh-CN/docs/components/button/</html>')
    assert.equal(readFileSync(path.join(client, 'zh-CN/docs/components/button/_.data'), 'utf8'), 'data:/zh-CN/docs/components/button/')
    assert.equal(readFileSync(path.join(client, '_.data'), 'utf8'), 'data:/')
    assert.equal(readFileSync(path.join(client, 'search/zh-CN/index.json'), 'utf8'), '{"pages":[]}')
    assert.equal(readFileSync(path.join(client, 'search/zh-CN/index.json.data'), 'utf8'), 'data:/search/zh-CN/index.json')
    assert.equal(readFileSync(path.join(client, '404.html'), 'utf8'), '<html>/404/</html>')
    assert.equal(readFileSync(path.join(client, 'assets/app.js'), 'utf8'), 'console.log("asset")')
    assert.ok(!existsSync(path.join(client, 'unlisted-page')))
    assert.ok(!existsSync(path.join(client, 'exui')))
  }
})

test('missing known source and divergent collisions fail while retaining raw client output', async () => {
  const missing = fixture('/exui/')
  await assert.rejects(normalizeDocsStatic({ docsRoot: missing.docsRoot, base: '/', prerenderPaths: paths, shareExamples: [] }), /Missing static source/)
  assert.ok(existsSync(path.join(missing.client, 'exui/index.html')))
  const collision = fixture('/')
  writeFileSync(path.join(collision.docsRoot, 'public/404.html'), 'public error page')
  collision.write('404.html', 'public error page')
  await assert.rejects(normalizeDocsStatic({ docsRoot: collision.docsRoot, base: '/', prerenderPaths: paths, shareExamples: [] }), /Conflicting static target/)
  assert.ok(existsSync(path.join(collision.client, 'index.html')))
  assert.ok(readdirSync(path.join(collision.docsRoot, 'build')).some(name => name.startsWith('.static-staging-')))
})

test('mapping rejects unlisted routes and duplicate target path traversal', () => {
  assert.throws(() => buildStaticMapping({ prerenderPaths: ['/unknown/'] }), /Unexpected prerender route/)
  assert.throws(() => buildStaticMapping({ prerenderPaths: ['/', '/../'] }), /Unsafe prerender path/)
  assert.throws(() => buildStaticMapping({ prerenderPaths: ['/'], assetFiles: ['../outside'] }), /Unsafe relative path/)
})
