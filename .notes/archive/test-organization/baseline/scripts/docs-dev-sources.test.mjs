import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const docsRoot = fileURLToPath(new URL('../packages/docs/', import.meta.url))
const require = createRequire(path.join(docsRoot, 'package.json'))
const { createServer } = await import(pathToFileURL(require.resolve('vite')).href)

for (const base of ['/', '/exui/']) {
  test(`docs development serves real example sources at ${base}`, async t => {
    const previousBase = process.env.EXUI_DOCS_BASE
    process.env.EXUI_DOCS_BASE = base
    t.after(() => {
      if (previousBase === undefined) delete process.env.EXUI_DOCS_BASE
      else process.env.EXUI_DOCS_BASE = previousBase
    })
    const cacheDir = mkdtempSync(path.join(os.tmpdir(), 'exui-docs-dev-sources-'))
    assert.equal(path.dirname(cacheDir), path.resolve(os.tmpdir()))
    let server
    t.after(async () => {
      await server?.close()
      rmSync(cacheDir, { recursive: true, force: true })
    })
    server = await createServer({
      root: docsRoot,
      configFile: path.join(docsRoot, 'vite.config.ts'),
      cacheDir,
      logLevel: 'error',
      server: { host: '127.0.0.1', port: 0, open: false },
    })
    await server.listen()
    const origin = `http://127.0.0.1:${server.httpServer.address().port}`
    const sourceUrl = `${origin}${base}examples/c-input-1/source`

    await t.test('code view receives highlighted JSON rather than route HTML', async () => {
      const response = await fetch(`${sourceUrl}.json`)
      assert.equal(response.status, 200)
      assert.match(response.headers.get('content-type'), /^application\/json\b/)
      const source = await response.json()
      assert.equal(source.schemaVersion, 1)
      assert.equal(source.id, 'c-input-1')
      assert.equal(source.family, 'input')
      assert.ok(source.files.length > 0)
      assert.ok(source.files[0].code.length > 0)
      assert.match(source.files[0].highlightedHtml, /<pre\b/)
    })

    await t.test('copy source receives the readable Markdown document', async () => {
      const response = await fetch(`${sourceUrl}.md`)
      assert.equal(response.status, 200)
      assert.match(response.headers.get('content-type'), /^text\/markdown\b/)
      const markdown = await response.text()
      assert.ok(markdown.startsWith('# '))
      assert.ok(markdown.includes('Example ID: `c-input-1`'))
      assert.ok(markdown.includes('c-input-1.tsx'))
    })

    await t.test('HEAD and missing examples retain source endpoint semantics', async () => {
      const head = await fetch(`${sourceUrl}.json`, { method: 'HEAD' })
      assert.equal(head.status, 200)
      assert.match(head.headers.get('content-type'), /^application\/json\b/)
      assert.equal(await head.text(), '')
      const missing = await fetch(`${origin}${base}examples/missing-example/source.md`)
      assert.equal(missing.status, 404)
    })
  })
}
