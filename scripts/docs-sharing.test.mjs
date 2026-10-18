import assert from 'node:assert/strict'
import { existsSync, mkdtempSync, mkdirSync, readFileSync, realpathSync, symlinkSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { test } from 'node:test'

const root = fileURLToPath(new URL('../', import.meta.url))
const moduleUrl = new URL('./docs-sharing.mjs', import.meta.url)
async function sharing() {
  assert.ok(existsSync(moduleUrl), 'Showcase must generate readable per-example sharing documents')
  return import(moduleUrl.href)
}

test('every upstream, extension and ExUI preview has a unique stable share entry', async () => {
  const { loadShareExamples, findRepositoryRoot } = await sharing()
  assert.equal(findRepositoryRoot(path.join(root, 'packages/docs/build/server')), path.resolve(root))
  assert.throws(() => findRepositoryRoot(os.tmpdir()), /Cannot locate ExUI repository/)
  const examples = await loadShareExamples(root)
  assert.equal(new Set(examples.map(example => example.id)).size, examples.length)
  for (const id of ['c-button-1', 'c-input-group-1', 'exui-direction', 'exui-glass-1', 'exui-form-1', 'exui-ex-form-1', 'exui-ex-item-1', 'exui-ex-item-2', 'exui-ex-item-3', 'exui-ex-message-1', 'exui-ex-message-2']) {
    assert.ok(examples.some(example => example.id === id), `missing ${id}`)
  }
})

test('source documents include working setup, dependency versions and every relative source import', async () => {
  const { loadShareExamples, createSourceDocument } = await sharing()
  const examples = await loadShareExamples(root)
  const example = examples.find(example => example.id === 'c-input-group-1')
  const document = createSourceDocument(root, example, '/exui/')
  const version = JSON.parse(readFileSync(path.join(root, 'packages/components/package.json'))).version
  for (const content of ['@exre/exui', version, 'src/main.tsx', 'vite.config.ts', 'src/showcase/examples/input-group/c-input-group-1.tsx', 'src/showcase/examples/_shared/example-runtime.tsx', 'src/showcase/language.ts', 'src/showcase/example-theme.css', 'src/showcase/example-utilities.css', 'src/showcase/examples/input-group/copy.generated.ts']) {
    assert.ok(document.markdown.includes(content), `missing ${content}`)
  }
  assert.ok(document.markdown.includes('/zh-CN/docs/components/input-group/?example=c-input-group-1'))
  assert.ok(!document.markdown.includes('workspace:'))
  assert.ok(!document.markdown.includes('ExampleHeader'))
})

test('code panel JSON reuses extracted files with stable entry order and escaped dual-theme HTML', async () => {
  const { loadShareExamples, createSourceDocument, createExampleSourceJson } = await sharing()
  const example = (await loadShareExamples(root)).find(item => item.id === 'c-button-1')
  const document = createSourceDocument(root, example)
  const source = await createExampleSourceJson(root, example, document)
  assert.equal(source.schemaVersion, 1)
  assert.equal(source.id, example.id)
  assert.equal(source.family, example.page.id)
  assert.equal(source.files[0].path, document.entry)
  assert.equal(source.files.length, document.files.size)
  assert.deepEqual(new Map(source.files.map(file => [file.path, file.code])), document.files)
  assert.ok(source.files.every(file => file.highlightedHtml.includes('shiki')))
  assert.ok(source.files.some(file => file.highlightedHtml.includes('github-light') && file.highlightedHtml.includes('github-dark')))
  const injected = await createExampleSourceJson(root, example, { ...document, entry: 'src/example.tsx', files: new Map([['src/example.tsx', '<script>alert(1)</script>\n']]) })
  assert.equal(injected.files[0].code, '<script>alert(1)</script>\n')
  assert.ok(!injected.files[0].highlightedHtml.includes('<script>alert(1)</script>'))
  assert.ok(injected.files[0].highlightedHtml.includes('&#x3C;'))
})

test('docs development server serves current example source JSON and Markdown at the deployment base', async t => {
  const require = createRequire(path.join(root, 'packages/docs/package.json'))
  const { createServer } = await import(pathToFileURL(require.resolve('vite')).href)
  const { loadShareExamples, createSourceDocument, createExampleSourceJson } = await sharing()
  const example = (await loadShareExamples(root)).find(item => item.id === 'c-button-1')
  const previousBase = process.env.EXUI_DOCS_BASE
  try {
    for (const base of ['/', '/exui/']) await t.test(base, async () => {
      process.env.EXUI_DOCS_BASE = base
      const server = await createServer({
        root: path.join(root, 'packages/docs'),
        configFile: path.join(root, 'packages/docs/vite.config.ts'),
        server: { host: '127.0.0.1', port: 0, open: false },
        logLevel: 'error',
      })
      try {
        await server.listen()
        const address = server.httpServer.address()
        const origin = `http://127.0.0.1:${address.port}`
        const sourceUrl = `${origin}${base}examples/${example.id}/`
        const response = await fetch(`${sourceUrl}source.json?fresh=1`)
        assert.equal(response.status, 200)
        assert.match(response.headers.get('content-type'), /application\/json/)
        assert.equal(response.headers.get('cache-control'), 'no-cache')
        const document = createSourceDocument(root, example, base)
        assert.deepEqual(await response.json(), await createExampleSourceJson(root, example, document))

        const markdown = await fetch(`${sourceUrl}source.md`)
        assert.equal(markdown.status, 200)
        assert.match(markdown.headers.get('content-type'), /text\/markdown/)
        assert.equal(await markdown.text(), document.markdown)
        const missing = await fetch(`${origin}${base}examples/unknown-example/source.json`)
        assert.equal(missing.status, 404)
        assert.doesNotMatch(missing.headers.get('content-type') ?? '', /text\/html/)
      } finally {
        await server.close()
      }
    })
  } finally {
    if (previousBase === undefined) delete process.env.EXUI_DOCS_BASE
    else process.env.EXUI_DOCS_BASE = previousBase
  }
})

test('ExUI source contains only the selected preview and its original state', async () => {
  const { loadShareExamples, createSourceDocument } = await sharing()
  const examples = await loadShareExamples(root)
  const example = examples.find(example => example.id === 'exui-ex-message-2')
  const { markdown } = createSourceDocument(root, example, '/')
  assert.ok(markdown.includes('Start sync'))
  assert.ok(markdown.includes('handle.current?.dismiss()'))
  assert.ok(!markdown.includes('Your workspace is up to date'))
  assert.ok(!markdown.includes('ExampleHeader'))
  assert.ok(!markdown.includes('from "../Preview"'))
})

test('exported extension preserves its Showcase layout classes without the app shell', async () => {
  const { loadShareExamples, createSourceDocument } = await sharing()
  const examples = await loadShareExamples(root)
  const document = createSourceDocument(root, examples.find(example => example.id === 'exui-direction'))
  const styles = [...document.files].filter(([filename]) => filename.endsWith('.css')).map(([, text]) => text).join('\n')
  assert.match(styles, /\.showcase-stack\s*\{[^}]*flex-direction:\s*column/)
  assert.ok(!styles.includes('.showcase-sidebar'))
})

test('readable HTML escapes embedded code and preserves the application entry and base path', async () => {
  const { renderShareHtml } = await sharing()
  const example = { id: 'c-button-1', page: { id: 'button', name: 'Button', group: 'components' } }
  const html = renderShareHtml('<html><head></head><body><div id="root"></div><script type="module" src="/exui/assets/app.js"></script></body></html>', example, '# Example\n<script>alert(1)</script>', '/exui/')
  assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'))
  assert.ok(!html.includes('<script>alert(1)</script>'))
  assert.ok(html.includes('data-share-route="#/components/button?example=c-button-1"'))
  assert.ok(html.includes('src="/exui/assets/app.js"'))
  assert.ok(html.includes('source.md'))
})

test('local source resolution rejects escapes and missing helper files', async () => {
  const { resolveSourceFile } = await sharing()
  assert.throws(() => resolveSourceFile(root, 'src/example.tsx', '../../../package.json'), /outside|escape/)
  assert.throws(() => resolveSourceFile(root, 'src/example.tsx', './missing-helper'), /missing|resolve/i)
  assert.ok(path.isAbsolute(resolveSourceFile(root, 'src/showcase/examples/button/c-button-1.tsx', '../../preview-copy')))
})

test('exported simple, complex and ExUI sources compile as standalone consumers', async () => {
  const { loadShareExamples, createSourceDocument } = await sharing()
  const examples = await loadShareExamples(root)
  for (const id of ['c-input-group-1', 'c-event-calendar-1', 'exui-direction', 'exui-ex-item-3', 'exui-ex-message-2']) {
    const directory = mkdtempSync(path.join(os.tmpdir(), 'exui-source-consumer-'))
    const document = createSourceDocument(root, examples.find(example => example.id === id))
    for (const [filename, text] of document.files) {
      const target = path.join(directory, filename)
      mkdirSync(path.dirname(target), { recursive: true })
      writeFileSync(target, text)
    }
    const manifest = JSON.parse(document.files.get('package.json'))
    for (const name of Object.keys({ ...manifest.dependencies, ...manifest.devDependencies })) {
      const target = path.join(directory, 'node_modules', name)
      mkdirSync(path.dirname(target), { recursive: true })
      symlinkSync(realpathSync(path.join(root, 'packages/docs/node_modules', name)), target, 'junction')
    }
    try {
      execFileSync(process.execPath, [path.join(root, 'packages/docs/node_modules/typescript/bin/tsc'), '--noEmit'], { cwd: directory, stdio: 'pipe' })
      if (id === 'exui-direction') {
        execFileSync(process.execPath, [path.join(root, 'packages/docs/node_modules/vite/bin/vite.js'), 'build', '--logLevel', 'error'], { cwd: directory, stdio: 'pipe' })
        const require = createRequire(path.join(root, 'packages/docs/package.json'))
        const { preview } = await import(pathToFileURL(require.resolve('vite')).href)
        const server = await preview({ root: directory, configFile: false, preview: { host: '127.0.0.1', port: 0 } })
        const { chromium } = require('playwright')
        let browser
        try {
          browser = await chromium.launch({ headless: true })
          const page = await browser.newPage()
          await page.goto(server.resolvedUrls.local[0])
          const stack = page.locator('.showcase-stack')
          await stack.waitFor()
          const layout = await stack.evaluate(element => {
            const style = getComputedStyle(element)
            const groups = element.querySelectorAll('[data-slot="input-group"]')
            return { direction: style.flexDirection, gap: parseFloat(style.gap), width: element.getBoundingClientRect().width, secondBelowFirst: groups[1].getBoundingClientRect().top >= groups[0].getBoundingClientRect().bottom }
          })
          assert.equal(layout.direction, 'column')
          assert.ok(layout.gap > 0 && layout.width > 200 && layout.secondBelowFirst)
        } finally {
          await browser?.close()
          await new Promise(resolve => server.httpServer.close(resolve))
        }
      }
    } catch (error) { assert.fail(`${id} failed standalone consumption: ${error.message}\n${error.stdout ?? ''}\n${error.stderr ?? ''}`) }
  }
})
