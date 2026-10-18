import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { mkdirSync, readFileSync, statSync, readdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadShareExamples } from './docs-sharing.mjs'
import { loadCatalog } from './docs-examples.mjs'
import { docPath, examplePath, locales, normalizeBase, overviewPath } from '../packages/docs/lib/site-contract.mjs'

const repository = fileURLToPath(new URL('../', import.meta.url))
const docsRoot = path.join(repository, 'packages/docs')
const require = createRequire(path.join(docsRoot, 'package.json'))
const mime = { '.html': 'text/html', '.data': 'text/plain', '.md': 'text/markdown', '.json': 'application/json', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ico': 'image/x-icon' }

export function startStaticServer(output, base) {
  const normalizedBase = normalizeBase(base)
  const directory = path.resolve(output)
  const server = createServer((request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
      if (!pathname.startsWith(normalizedBase)) throw new Error('Outside docs base')
      const relative = pathname.slice(normalizedBase.length)
      if (relative.includes('\\') || relative.split('/').some(part => part === '..' || part === '.')) throw new Error('Unsafe path')
      let filename = path.resolve(directory, relative)
      if (filename !== directory && !filename.startsWith(directory + path.sep)) throw new Error('Outside output')
      if (statSync(filename).isDirectory()) filename = path.join(filename, 'index.html')
      const body = readFileSync(filename)
      response.statusCode = 200
      response.setHeader('Content-Type', `${mime[path.extname(filename)] ?? 'application/octet-stream'}; charset=utf-8`)
      response.end(request.method === 'HEAD' ? undefined : body)
    } catch {
      response.statusCode = 404
      response.setHeader('Content-Type', 'text/plain; charset=utf-8')
      response.end('Not found')
    }
  })
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve({ server, origin: `http://127.0.0.1:${server.address().port}` })))
}

export function assertDocumentLinks(html, pageUrl, base, routes) {
  const prefix = normalizeBase(base)
  const page = new URL(pageUrl)
  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const target = new URL(match[1].replaceAll('&amp;', '&'), page)
    if (target.origin !== page.origin || !target.pathname.includes('/docs/')) continue
    assert.ok(target.pathname.startsWith(prefix), `${page.pathname}: document link is outside deployment base: ${target.pathname}`)
    const route = `/${target.pathname.slice(prefix.length)}`
    assert.ok(routes.has(route), `${page.pathname}: document link has no static route: ${target.pathname}`)
  }
}

function dataPath(route, base) {
  const relative = route.endsWith('/') ? `${route.slice(1)}_.data` : `${route.slice(1)}.data`
  return `${base}${relative}`
}

async function checkHttp(origin, url, expectedType, identity, { allowEmpty = false } = {}) {
  const response = await fetch(origin + url)
  assert.equal(response.status, 200, `${url} must be served without fallback`)
  assert.ok(response.headers.get('content-type')?.startsWith(expectedType), `${url} wrong content type`)
  const text = await response.text()
  if (!allowEmpty) assert.ok(text.length > 0, `${url} empty`)
  if (identity) assert.ok(text.includes(identity), `${url} missing ${identity}`)
  return text
}

async function searchFor(page, locale, query, route) {
  const zh = locale === 'zh-CN'
  await page.getByRole('button', { name: zh ? '搜索文档' : /Search/i }).first().click()
  const input = page.locator(`input[aria-label="${zh ? '搜索文档' : 'Search documentation'}"]`)
  await input.waitFor()
  await input.fill(query)
  await page.locator(`[role="option"][id$="${route.slice(0, -1)}"]`).first().click()
  await page.waitForURL(url => url.pathname.endsWith(route))
}

async function selectSetting(page, label, value) {
  const optionNames = {
    light: /^(浅色|Light)$/,
    dark: /^(深色|Dark)$/,
    'pitch-black': /^(纯黑|Pitch black)$/,
    standard: /^(标准|Standard)$/,
    compact: /^(紧凑|Compact)$/,
    'zh-CN': '简体中文',
    en: 'English',
  }
  await page.getByRole('combobox', { name: label, exact: true }).click()
  await page.getByRole('option', { name: optionNames[value], exact: true }).click()
}

async function assertShellLayout(page, mode) {
  await page.evaluate(() => window.scrollTo(0, 0))
  const layout = await page.evaluate(() => {
    const heading = document.querySelector('h1')
    if (!heading) throw new Error('Missing document heading')
    const title = heading.getBoundingClientRect()
    const controls = [...document.querySelectorAll('button')].filter(button => {
      const style = getComputedStyle(button)
      const rect = button.getBoundingClientRect()
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0 && rect.top >= 0 && rect.top < innerHeight
    })
    const intersects = rect => Math.min(title.right, rect.right) > Math.max(title.left, rect.left) + 1 && Math.min(title.bottom, rect.bottom) > Math.max(title.top, rect.top) + 1
    const overlappingControls = controls.filter(button => {
      const rect = button.getBoundingClientRect()
      return rect.top < title.bottom + 16 && intersects(rect)
    }).map(button => ({ label: button.getAttribute('aria-label') ?? button.textContent?.trim().slice(0, 40), className: button.className }))
    const narrowSearch = controls.filter(button => {
      const text = button.textContent?.replace(/\s/g, '') ?? ''
      return (text.includes('\u641c\u7d22\u6587\u6863') || text.includes('Searchdocumentation')) && button.getBoundingClientRect().width < 88
    }).map(button => ({ width: button.getBoundingClientRect().width, text: button.textContent?.trim().slice(0, 40) }))
    const visibleDesktopHidden = controls.filter(button => button.classList.contains('md:hidden')).map(button => button.getAttribute('aria-label') ?? button.className)
    return { heading: { x: title.x, y: title.y, right: title.right }, viewport: innerWidth, overlappingControls, narrowSearch, visibleDesktopHidden }
  })
  assert.ok(layout.heading.right <= layout.viewport + 1, `${mode} heading clips outside viewport: ${JSON.stringify(layout)}`)
  assert.deepEqual(layout.overlappingControls, [], `${mode} shell control overlaps document heading: ${JSON.stringify(layout)}`)
  assert.deepEqual(layout.narrowSearch, [], `${mode} search trigger is too narrow for its label: ${JSON.stringify(layout)}`)
  if (mode === 'desktop') assert.deepEqual(layout.visibleDesktopHidden, [], `Desktop renders md:hidden controls: ${JSON.stringify(layout)}`)
}

function inspectSourceJson(text, example, markdown) {
  const source = JSON.parse(text)
  assert.equal(source.schemaVersion, 1)
  assert.equal(source.id, example.id)
  assert.equal(source.family, example.page.id)
  assert.ok(Array.isArray(source.files) && source.files.length > 0)
  const paths = new Set()
  for (const file of source.files) {
    assert.ok(file.path && !paths.has(file.path), `Duplicate source file ${example.id}/${file.path}`)
    assert.ok(typeof file.code === 'string' && typeof file.highlightedHtml === 'string')
    assert.ok(file.highlightedHtml.includes('shiki'))
    assert.ok(markdown.includes(`### ${file.path}`), `Markdown/JSON source drift ${example.id}/${file.path}`)
    paths.add(file.path)
  }
}

export function assertExampleInventory(baselineExamples, currentExamples, capabilityRegistry) {
  assert.equal(capabilityRegistry.schemaVersion, 1, 'Capability registry schema drift')
  const index = (examples, label) => {
    const entries = new Map()
    for (const example of examples) {
      assert.ok(!entries.has(example.id), `Duplicate ${label} example ID: ${example.id}`)
      entries.set(example.id, example)
    }
    return entries
  }
  const baseline = index(baselineExamples, 'baseline')
  const current = index(currentExamples, 'current')
  for (const [id, expected] of baseline) {
    const actual = current.get(id)
    assert.ok(actual, `Missing baseline example: ${id}`)
    assert.deepEqual(
      { id: actual.id, family: actual.family, extension: actual.extension, native: actual.native },
      expected,
      `Changed baseline example metadata: ${id}`,
    )
  }
  const registered = new Map()
  for (const capability of capabilityRegistry.capabilities) {
    for (const id of capability.examples) {
      if (baseline.has(id)) continue
      if (!registered.has(id)) registered.set(id, new Set())
      for (const page of capability.pages) registered.get(id).add(page)
    }
  }
  for (const [id, example] of current) {
    if (baseline.has(id)) continue
    const pages = registered.get(id)
    assert.ok(pages, `Unregistered capability example: ${id}`)
    assert.equal(example.extension, true, `Capability example must be an extension: ${id}`)
    assert.equal(example.native, false, `Capability example must not be native: ${id}`)
    assert.equal(example.page?.split('/').at(-1), example.family, `Capability example family/page mismatch: ${id}`)
    assert.ok(pages.has(example.page), `Capability example page is not registered for family: ${id}`)
  }
  for (const id of registered.keys()) assert.ok(current.has(id), `Missing registered capability example: ${id}`)
}

export async function verifyDocsStatic({ output = path.join(docsRoot, 'build/client'), base = '/', browser = true } = {}) {
  const normalizedBase = normalizeBase(base)
  const manifest = JSON.parse(readFileSync(path.join(docsRoot, '.generated/prerender-paths.json'), 'utf8'))
  assert.equal(manifest.schemaVersion, 1)
  const paths = manifest.paths
  const staticRoutes = new Set(paths)
  const pageManifest = JSON.parse(readFileSync(path.join(docsRoot, '.generated/pages.json'), 'utf8'))
  assert.equal(pageManifest.schemaVersion, 1)
  const pageByRoute = new Map(pageManifest.pages.map(page => [`/${page.locale}/docs/${page.id}/`, page]))
  const overviewRoutes = locales.flatMap(locale => [overviewPath(locale), overviewPath(locale, '/', 'components'), overviewPath(locale, '/', 'exui')])
  assert.deepEqual(new Set(paths.filter(route => route.includes('/docs/'))), new Set([...pageByRoute.keys(), ...overviewRoutes]), 'Document prerender paths must cover content and both overviews')
  const examples = await loadShareExamples(repository)
  const baseline = JSON.parse(readFileSync(path.join(repository, 'scripts/fixtures/docs-site-baseline.json'), 'utf8'))
  const catalog = await loadCatalog(repository)
  const coverage = JSON.parse(readFileSync(path.join(docsRoot, 'upstream/reui/coverage.json'), 'utf8'))
  const capabilities = JSON.parse(readFileSync(path.join(docsRoot, 'exui/capabilities.json'), 'utf8'))
  const byId = values => new Map(values.map(value => [value.id, value]))
  assert.deepEqual(byId(catalog), byId(baseline.families), 'Family catalog drift from pre-migration baseline')
  assertExampleInventory(baseline.examples, examples.map(example => ({ id: example.id, family: example.page.id, page: `${example.page.group}/${example.page.id}`, extension: !!example.extension, native: !!example.functionName })), capabilities)
  assert.deepEqual(byId(coverage.examples.filter(example => example.status === 'excluded')), byId(baseline.exclusions), 'Upstream exclusions drift from pre-migration baseline')
  const { server, origin } = await startStaticServer(output, normalizedBase)
  let chromiumBrowser
  try {
    const exampleIds = new Set(examples.map(example => example.id))
    const routeIds = new Set(paths.filter(route => route.startsWith('/examples/')).map(route => route.split('/')[2]))
    assert.deepEqual(routeIds, exampleIds, 'Prerender share list must equal current source inventory')
    let documentCount = 0
    const assetUrls = new Set()
    for (const route of paths) {
      const url = normalizedBase + route.slice(1)
      if (route.startsWith('/search/')) {
        JSON.parse(await checkHttp(origin, url, 'application/json'))
        await checkHttp(origin, dataPath(route, normalizedBase), 'text/plain')
        continue
      }
      const html = await checkHttp(origin, url, 'text/html', route.startsWith('/examples/') ? route.split('/')[2] : undefined)
      assert.ok(html.includes('<html'), `Missing document markup ${url}`)
      assertDocumentLinks(html, origin + url, normalizedBase, staticRoutes)
      const page = pageByRoute.get(route)
      if (page) assert.ok(html.includes(page.title), `Prerendered document missing title: ${route}`)
      if (overviewRoutes.includes(route)) {
        const locale = route.split('/')[1]
        const group = route.split('/')[3]
        for (const family of catalog.filter(family => !group || family.group === group)) {
          assert.ok(html.includes(`data-overview-card="${family.id}"`), `${route} missing card ${family.id} without JavaScript`)
          assert.ok(html.includes(`href="${docPath(locale, `${family.group}/${family.id}`, normalizedBase)}"`), `${route} missing link ${family.id}`)
        }
      }
      for (const match of html.matchAll(/(?:src|href)="([^"?#]+\.(?:js|css|svg|png|jpe?g|webp|woff2?|ico))"/g)) {
        if (match[1].startsWith(normalizedBase)) assetUrls.add(match[1])
      }
      await checkHttp(origin, dataPath(route, normalizedBase), 'text/plain')
      if (route.includes('/docs/')) documentCount++
    }
    for (const example of examples) {
      const url = examplePath(example.id, normalizedBase)
      const markdown = await checkHttp(origin, `${url}source.md`, 'text/markdown', `Example ID: \`${example.id}\``)
      const json = await checkHttp(origin, `${url}source.json`, 'application/json', `"id":"${example.id}"`)
      inspectSourceJson(json, example, markdown)
    }
    await checkHttp(origin, `${normalizedBase}examples/reui/photos/0a10b9bc070f3bdf60.jpg`, 'image/jpeg')
    await checkHttp(origin, `${normalizedBase}examples/reui/flags/us.svg`, 'image/svg+xml')
    JSON.parse(await checkHttp(origin, `${normalizedBase}examples/reui/emoji/emojibase-data-17.0.0/zh/data.json`, 'application/json'))
    for (const url of assetUrls) await checkHttp(origin, url, mime[path.extname(url)], undefined, { allowEmpty: true })
    for (const relative of readdirSync(path.join(output, 'assets'))) {
      if (relative.endsWith('.js') || relative.endsWith('.css')) await checkHttp(origin, `${normalizedBase}assets/${relative}`, mime[path.extname(relative)], undefined, { allowEmpty: true })
    }
    const missing = await fetch(`${origin}${normalizedBase}never-a-real-page/`)
    assert.equal(missing.status, 404, 'Unknown route must not receive SPA fallback')
    const notFoundPage = await checkHttp(origin, `${normalizedBase}404.html`, 'text/html')
    assert.match(notFoundPage, /noindex/i, 'Static 404 page must declare noindex')
    const root = await checkHttp(origin, normalizedBase, 'text/html')
    if (normalizedBase !== '/') assert.ok(!root.includes(`${normalizedBase.slice(0, -1)}${normalizedBase}`), 'Base path duplicated in output')
    console.log(`HTTP verified: ${paths.length} prerender paths, ${examples.length} source triples, static assets and 404`)

    if (browser) {
      const { chromium } = require('playwright')
      chromiumBrowser = await chromium.launch({ headless: true })
      const context = await chromiumBrowser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-US', reducedMotion: 'reduce', permissions: ['clipboard-read', 'clipboard-write'] })
      const page = await context.newPage()
      const screenshots = path.join(repository, 'output/docs-site/screenshots')
      mkdirSync(screenshots, { recursive: true })
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      page.on('request', request => {
        const url = new URL(request.url())
        if (url.origin === origin && !url.pathname.startsWith(normalizedBase)) errors.push(`Unexpected root request ${url.pathname}`)
        if (url.origin === origin && /(?:\/api\/|\/__manifest|\/__route)/.test(url.pathname)) errors.push(`Runtime service request ${url.pathname}`)
      })
      page.on('response', response => {
        if (response.url().startsWith(origin) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`)
      })
      await page.goto(origin + overviewPath('zh-CN', normalizedBase))
      await page.locator('[data-overview-loaded="accordion"] > *').first().waitFor()
      assert.equal(await page.locator('[data-overview-card]').count(), catalog.length)
      assert.equal(await page.locator('#nd-toc').count(), 0, 'Overview must not render a right-side table of contents')
      assert.equal(await page.locator('[data-testid="components-overview"] input[type="search"]').count(), 0, 'Overview must not add a search field')
      assert.ok(await page.locator('[data-overview-loaded]').count() < catalog.length, 'Offscreen previews must load on demand')
      for (const family of catalog) {
        const card = page.locator(`[data-overview-card="${family.id}"]`)
        assert.equal(await card.getByRole('link').count(), 1, 'Only the card link must be accessible')
        assert.equal(await card.locator('.overview-card-link').getAttribute('href'), docPath('zh-CN', `${family.group}/${family.id}`, normalizedBase))
        assert.equal(await card.locator('.overview-card-count').textContent(), `${examples.filter(example => example.page.id === family.id).length} 个示例`)
        assert.equal(await card.locator('.overview-card-preview[inert][aria-hidden="true"]').count(), 1)
        await card.scrollIntoViewIfNeeded()
        await card.locator('[data-overview-loaded] > *').first().waitFor()
      }
      assert.equal(await page.locator('[data-overview-error]').count(), 0, 'Every overview preview must render')
      await selectSetting(page, '语言', 'en')
      await page.waitForURL(url => url.pathname === overviewPath('en', normalizedBase))
      await page.getByRole('heading', { name: /^All components/, level: 1 }).waitFor()
      assert.equal(await page.locator('[data-overview-card="button"] .overview-card-link').getAttribute('href'), docPath('en', 'components/button', normalizedBase))
      await page.locator('[data-overview-card="button"] .overview-card-link').click()
      await page.waitForURL(url => url.pathname === docPath('en', 'components/button', normalizedBase))
      await page.getByRole('heading', { name: 'Button', exact: true, level: 1 }).waitFor()
      await page.getByRole('link', { name: 'ExUI', exact: true }).click()
      await page.waitForURL(url => url.pathname === overviewPath('en', normalizedBase))
      console.log('Overview verified: all families, lazy previews, actual counts, language, cards and brand navigation')
      const docRoute = paths.find(route => route.startsWith('/zh-CN/docs/components/button/')) ?? paths.find(route => route.includes('/docs/'))
      assert.ok(docRoute, 'No prerendered document to inspect')
      await page.goto(origin + normalizedBase + docRoute.slice(1))
      await page.locator('body').waitFor()
      assert.ok((await page.locator('body').innerText()).length > 40)
      await page.reload()
      assert.ok((await page.locator('body').innerText()).length > 40)
      const id = examples.find(example => example.id === 'c-button-1')?.id ?? examples[0].id
      await page.goto(`${origin}${normalizedBase}en/docs/components/button/`)
      assert.equal(await page.locator('html').getAttribute('lang'), 'en', 'English document must declare its language')
      await page.evaluate(() => localStorage.setItem('exui-docs-language', 'en'))
      await page.goto(origin + examplePath(id, normalizedBase))
      await page.waitForURL(url => url.pathname === `${normalizedBase}en/docs/components/button/` && url.searchParams.get('example') === id)
      await page.waitForFunction(() => document.documentElement.lang === 'en')
      assert.equal(await page.locator('html').getAttribute('lang'), 'en', 'English share redirect must preserve document language')
      assert.ok(page.url().includes(`?example=${id}`))
      await page.goto(`${origin}${normalizedBase}#/components/button?example=${id}`)
      await page.waitForURL(url => url.pathname.includes('/docs/components/button/') && url.searchParams.get('example') === id)
      await page.goto(`${origin}${normalizedBase}zh-CN/docs/components/input/`)
      const card = page.locator('[data-testid="example-c-input-1"]')
      await card.waitFor()
      const input = card.locator('[data-example-id="c-input-1"] input').first()
      await input.waitFor()
      await input.fill('docs static draft 413')
      await input.evaluate(element => { element.dataset.staticIdentity = 'input-413' })
      const assertDraft = async () => {
        assert.equal(await input.inputValue(), 'docs static draft 413')
        assert.equal(await input.getAttribute('data-static-identity'), 'input-413')
      }
      let sourceRequests = 0
      page.on('request', request => { if (request.url().endsWith('/examples/c-input-1/source.json')) sourceRequests++ })
      assert.equal(sourceRequests, 0, 'Code source must be lazy')
      assert.equal(await card.getByRole('tablist').count(), 0, 'Example previews must not have code tabs')
      await card.getByRole('button', { name: '源码', exact: true }).click()
      const sourceDrawer = page.getByRole('dialog', { name: /^Input · 01 / })
      await sourceDrawer.getByRole('combobox', { name: '示例文件' }).waitFor()
      assert.equal(sourceRequests, 1, 'First source drawer must fetch one JSON source')
      await page.screenshot({ path: path.join(screenshots, 'source-drawer-desktop.png'), animations: 'disabled' })
      await sourceDrawer.getByRole('button', { name: '关闭', exact: true }).click()
      await sourceDrawer.waitFor({ state: 'hidden' })
      await assertDraft()
      await selectSetting(page, '语言', 'en')
      await page.waitForURL(url => url.pathname.includes('/en/docs/components/input/'))
      await assertDraft()
      const codeColors = new Map()
      for (const theme of ['light', 'dark', 'pitch-black']) {
        await selectSetting(page, 'Theme', theme)
        assert.ok(await page.locator('html').evaluate((element, expected) => element.classList.contains(expected), theme))
        await card.getByRole('button', { name: 'Source', exact: true }).click()
        await sourceDrawer.locator('.docs-example-source-code pre').first().waitFor()
        const color = await sourceDrawer.locator('.docs-example-source-code pre').first().evaluate(element => getComputedStyle(element).backgroundColor)
        codeColors.set(theme, color)
        await page.keyboard.press('Escape')
        await sourceDrawer.waitFor({ state: 'hidden' })
        await assertDraft()
      }
      assert.notEqual(codeColors.get('light'), codeColors.get('dark'), 'Code highlighter must react to light/dark themes')
      assert.equal(codeColors.get('dark'), codeColors.get('pitch-black'), 'Pitch-black must use dark code highlighting')
      for (const density of ['compact', 'standard']) {
        await selectSetting(page, 'Preview density', density)
        await assertDraft()
      }
      await page.evaluate(() => {
        history.pushState({}, '', `${location.pathname}?example=c-input-2`)
        dispatchEvent(new PopStateEvent('popstate'))
      })
      await page.waitForURL(url => url.searchParams.get('example') === 'c-input-2')
      await assertDraft()
      await page.goBack()
      await page.waitForURL(url => url.searchParams.get('example') !== 'c-input-2')
      await assertDraft()
      await card.getByRole('button', { name: 'Source', exact: true }).click()
      const fileSelect = sourceDrawer.getByRole('combobox', { name: 'Example file' })
      await fileSelect.waitFor()
      assert.equal(sourceRequests, 1, 'Reopening code must use the cached source')
      const fileOptions = await fileSelect.locator('option').evaluateAll(options => options.map(option => option.value))
      assert.ok(fileOptions.length > 1, 'Code view must expose dependencies and setup files')
      await fileSelect.selectOption(fileOptions[1])
      assert.equal(await fileSelect.inputValue(), fileOptions[1])
      await sourceDrawer.getByRole('button', { name: 'Copy file' }).click()
      await sourceDrawer.getByRole('status').filter({ hasText: 'File copied' }).waitFor()
      const selectedSource = await (await fetch(`${origin}${examplePath('c-input-1', normalizedBase)}source.json`)).json()
      assert.equal((await page.evaluate(() => navigator.clipboard.readText())).replaceAll('\r\n', '\n'), selectedSource.files[1].code.replaceAll('\r\n', '\n'))
      await sourceDrawer.getByRole('button', { name: 'Copy source' }).click()
      await sourceDrawer.getByRole('status').filter({ hasText: 'Source copied' }).waitFor()
      assert.ok((await page.evaluate(() => navigator.clipboard.readText())).includes(`Example ID: \`c-input-1\``))
      await page.evaluate(() => { Object.defineProperty(navigator.clipboard, 'writeText', { configurable: true, value: async () => { throw new Error('clipboard denied') } }) })
      await sourceDrawer.getByRole('button', { name: 'Copy file' }).click()
      await sourceDrawer.locator('.docs-example-source-feedback').filter({ hasText: 'Copy failed' }).waitFor()
      await sourceDrawer.getByRole('button', { name: 'Copy source' }).click()
      await sourceDrawer.locator('.docs-source-drawer-feedback').filter({ hasText: 'Copy failed' }).waitFor()
      await page.evaluate(() => { delete navigator.clipboard.writeText })
      await sourceDrawer.getByRole('button', { name: 'Copy file' }).click()
      await sourceDrawer.getByRole('status').filter({ hasText: 'File copied' }).waitFor()
      await page.keyboard.press('Escape')
      await sourceDrawer.waitFor({ state: 'hidden' })
      await card.getByRole('button', { name: 'Input · 01', exact: true }).click()
      await card.getByRole('status').filter({ hasText: 'Link copied' }).waitFor()
      assert.equal(await page.evaluate(() => navigator.clipboard.readText()), `${origin}${examplePath('c-input-1', normalizedBase)}`)
      let sourceFailures = 0
      await page.route('**/examples/c-input-2/source.json', route => {
        if (sourceFailures++ === 0) void route.abort('failed')
        else void route.continue()
      })
      const secondCard = page.locator('[data-testid="example-c-input-2"]')
      await secondCard.getByRole('button', { name: 'Source', exact: true }).click()
      const secondDrawer = page.getByRole('dialog', { name: 'Input · 02 source', exact: true })
      await secondDrawer.getByRole('alert').filter({ hasText: 'Source failed to load' }).waitFor()
      await secondDrawer.getByRole('button', { name: 'Retry' }).click()
      await secondDrawer.getByRole('combobox', { name: 'Example file' }).waitFor()
      assert.equal(sourceFailures, 2, 'Failed source must retry the same static JSON')
      await page.unroute('**/examples/c-input-2/source.json')
      await page.keyboard.press('Escape')
      await secondDrawer.waitFor({ state: 'hidden' })

      let staleRequests = 0
      await page.route('**/examples/c-input-3/source.json', async route => {
        staleRequests++
        if (staleRequests === 1) await new Promise(resolve => setTimeout(resolve, 1800))
        try { await route.continue() } catch { /* The hidden panel aborts its stale request. */ }
      })
      const thirdCard = page.locator('[data-testid="example-c-input-3"]')
      const firstStaleRequest = page.waitForRequest(request => request.url().endsWith('/examples/c-input-3/source.json'))
      await thirdCard.getByRole('button', { name: 'Source', exact: true }).click()
      await firstStaleRequest
      const thirdDrawer = page.getByRole('dialog', { name: 'Input · 03 source', exact: true })
      await page.keyboard.press('Escape')
      await thirdDrawer.waitFor({ state: 'hidden' })
      await page.waitForTimeout(1900)
      await thirdCard.getByRole('button', { name: 'Source', exact: true }).click()
      await thirdDrawer.getByRole('combobox', { name: 'Example file' }).waitFor()
      assert.ok(staleRequests >= 2, 'Hidden panel must cancel stale source work and fetch again')
      await page.unroute('**/examples/c-input-3/source.json')
      await page.keyboard.press('Escape')
      await thirdDrawer.waitFor({ state: 'hidden' })
      console.log('Browser state verified: source lifecycle, clipboard and same-instance settings')
      assert.equal((await page.locator('body').evaluate(element => element.scrollWidth <= document.documentElement.clientWidth + 1)), true, 'Desktop horizontal overflow')

      await searchFor(page, 'en', 'Button', '/en/docs/components/button/')
      await selectSetting(page, 'Language', 'zh-CN')
      await page.waitForURL(url => url.pathname.endsWith('/zh-CN/docs/components/button/'))
      await searchFor(page, 'zh-CN', '密度', '/zh-CN/docs/tokens/density/')
      await searchFor(page, 'zh-CN', '安装', '/zh-CN/docs/getting-started/installation/')

      const retryPage = await context.newPage()
      let searchFetches = 0
      await retryPage.route('**/search/zh-CN/index.json*', route => {
        if (searchFetches++ === 0) void route.fulfill({ status: 503, contentType: 'application/json', body: '{}' })
        else void route.continue()
      })
      await retryPage.goto(`${origin}${normalizedBase}zh-CN/docs/components/button/`)
      await retryPage.locator('[data-testid="example-c-button-1"]').waitFor()
      await retryPage.getByRole('button', { name: '搜索文档' }).click()
      await retryPage.locator('input[aria-label="搜索文档"]').fill('Button')
      await retryPage.getByRole('alert').filter({ hasText: '搜索索引加载失败' }).waitFor()
      await retryPage.getByRole('button', { name: '重试' }).click()
      await retryPage.locator('[role="option"][id$="/zh-CN/docs/components/button"]').first().waitFor()
      assert.equal(searchFetches, 2, 'Search retry must refetch the static index')
      await retryPage.close()
      console.log('Browser search verified: three queries and failed index retry')

      const unknownPage = await context.newPage()
      await unknownPage.goto(`${origin}${normalizedBase}zh-CN/docs/components/input/?example=unknown-example`)
      await unknownPage.getByRole('status').filter({ hasText: '未找到示例' }).waitFor()
      assert.ok((await unknownPage.locator('body').innerText()).includes('Input'), 'Unknown example must preserve the known document')
      assert.equal((await unknownPage.goto(`${origin}${normalizedBase}zh-CN/docs/components/no-such-family/`)).status(), 404)
      assert.equal((await unknownPage.goto(`${origin}${normalizedBase}examples/no-such-id/`)).status(), 404)
      await unknownPage.close()

      const representative = await context.newPage()
      await representative.goto(`${origin}${normalizedBase}zh-CN/docs/components/dialog/`)
      const dialogCard = representative.locator('[data-testid="example-c-dialog-1"]')
      await dialogCard.waitFor()
      await dialogCard.getByRole('button', { name: '基础对话框' }).click()
      const dialog = representative.getByRole('dialog', { name: '编辑资料' })
      await dialog.waitFor()
      assert.ok(await dialog.evaluate(element => element.contains(document.activeElement)), 'Dialog focus must enter the portal')
      assert.ok(await representative.locator('[data-docs-example-portal="c-dialog-1"]').count(), 'Dialog portal must belong to its example')
      await dialog.getByRole('textbox', { name: '姓名' }).fill('Static verifier')
      await dialog.getByRole('button', { name: '保存更改' }).click()
      await dialog.waitFor({ state: 'hidden' })
      await dialogCard.getByRole('button', { name: '源码', exact: true }).click()
      const dialogSource = representative.getByRole('dialog', { name: 'Dialog · 01 源码', exact: true })
      await dialogSource.getByRole('combobox', { name: '示例文件' }).waitFor()
      assert.equal(await dialogSource.getAttribute('data-docs-example-portal'), null, 'Documentation drawer must not inherit preview portal ownership')

      const representativeCases = [
        ['components/sidebar', 'c-sidebar-1', '[data-slot="sidebar"]'],
        ['components/chart', 'c-chart-1', '.recharts-surface'],
        ['components/data-grid', 'c-data-grid-1', 'table'],
        ['exui/form', 'exui-form-1', 'form'],
      ]
      for (const [documentId, exampleId, selector] of representativeCases) {
        await representative.goto(`${origin}${normalizedBase}zh-CN/docs/${documentId}/`)
        const component = representative.locator(`[data-testid="example-${exampleId}"]`)
        await component.waitFor()
        await component.locator(selector).first().waitFor()
        assert.ok(await component.locator(selector).count(), `Missing rendered ${documentId} structure`)
      }
      const formCard = representative.locator('[data-testid="example-exui-form-1"]')
      await formCard.getByRole('textbox', { name: '项目名称' }).fill('Verification project')
      await formCard.getByRole('button', { name: '保存项目' }).click()
      await formCard.getByRole('status').filter({ hasText: 'Verification project' }).waitFor()
      await representative.goto(`${origin}${normalizedBase}zh-CN/docs/exui/ex-message/`)
      const messageCard = representative.locator('[data-testid="example-exui-ex-message-1"]')
      await messageCard.waitFor()
      await messageCard.getByRole('button', { name: '提示' }).click()
      await representative.getByText('工作区已是最新状态', { exact: true }).waitFor()
      await representative.goto(`${origin}${normalizedBase}zh-CN/docs/components/button/`)
      assert.equal(await representative.getByText('工作区已是最新状态', { exact: true }).count(), 0, 'ExMessage toast must clean up on route departure')
      for (const [family, exampleId, asset] of [
        ['button', 'c-button-56', 'photos/0a10b9bc070f3bdf60.jpg'],
        ['badge', 'c-badge-25', 'flags/us.svg'],
      ]) {
        await representative.goto(`${origin}${normalizedBase}zh-CN/docs/components/${family}/`)
        const selector = `[data-testid="example-${exampleId}"] img[src$="${asset}"]`
        const image = representative.locator(selector).first()
        await image.waitFor()
        assert.equal(await image.getAttribute('src'), `${normalizedBase}examples/reui/${asset}`, `${family} image must use the docs base`)
        await image.scrollIntoViewIfNeeded()
        await representative.waitForFunction(value => {
          const element = document.querySelector(value)
          return element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0
        }, selector)
      }
      const emojiData = representative.waitForResponse(response => response.url().includes('/examples/reui/emoji/') && response.url().endsWith('/zh/data.json'))
      await representative.goto(`${origin}${normalizedBase}zh-CN/docs/components/emoji-picker/`)
      await representative.locator('[data-testid="example-c-emoji-picker-1"]').scrollIntoViewIfNeeded()
      const emojiResponse = await emojiData
      assert.equal(new URL(emojiResponse.url()).pathname, `${normalizedBase}examples/reui/emoji/emojibase-data-17.0.0/zh/data.json`, 'Emoji data must use the docs base')
      assert.equal(emojiResponse.status(), 200, 'Emoji data must load from static output')
      await representative.close()
      console.log('Browser examples verified: Dialog, Sidebar, Chart, DataGrid, Form, ExMessage and managed assets')

      await page.goto(`${origin}${normalizedBase}zh-CN/docs/components/button/`)
      await page.locator('[data-testid="example-c-button-1"]').waitFor()
      const themeSurfaces = new Map()
      for (const theme of ['light', 'dark', 'pitch-black']) {
        await selectSetting(page, '主题', theme)
        await page.waitForFunction(expected => document.documentElement.classList.contains(expected), theme)
        await page.evaluate(() => document.fonts.ready)
        await page.getByRole('heading', { name: '基本用法' }).waitFor()
        const surface = await page.evaluate(() => ({ body: getComputedStyle(document.body).backgroundColor, card: getComputedStyle(document.querySelector('.docs-example-card')).backgroundColor, foreground: getComputedStyle(document.body).color }))
        assert.ok(surface.body && surface.foreground, `Missing Glass colors for ${theme}`)
        themeSurfaces.set(theme, surface)
        await page.evaluate(() => window.scrollTo(0, 0))
        await assertShellLayout(page, 'desktop')
        await page.screenshot({ path: path.join(screenshots, `glass-desktop-${theme}.png`), animations: 'disabled' })
      }
      assert.notEqual(themeSurfaces.get('light').body, themeSurfaces.get('dark').body, 'Light/dark Glass body color must differ')
      assert.notEqual(themeSurfaces.get('dark').body, themeSurfaces.get('pitch-black').body, 'Dark/pitch-black Glass body color must differ')

      const mobile = await chromiumBrowser.newContext({ viewport: { width: 390, height: 844 }, locale: 'zh-CN', reducedMotion: 'reduce' })
      const mobilePage = await mobile.newPage()
      await mobilePage.goto(`${origin}${normalizedBase}zh-CN/docs/components/input/`)
      await mobilePage.locator('[data-testid="example-c-input-1"]').waitFor()
      assert.equal(await mobilePage.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, 'Mobile horizontal overflow')
      await mobilePage.getByRole('button', { name: '打开导航' }).click()
      await mobilePage.locator(`a[href="${normalizedBase}zh-CN/docs/components/accordion/"]:visible`).first().click()
      await mobilePage.waitForURL(url => url.pathname.endsWith('/zh-CN/docs/components/accordion/'))
      await mobilePage.goto(`${origin}${normalizedBase}zh-CN/docs/components/button/`)
      await mobilePage.locator('[data-testid="example-c-button-1"]').waitFor()
      await mobilePage.getByRole('button', { name: '打开导航' }).click()
      await selectSetting(mobilePage, '主题', 'dark')
      await mobilePage.waitForFunction(() => document.documentElement.classList.contains('dark'))
      await selectSetting(mobilePage, '预览密度', 'compact')
      assert.ok(await mobilePage.locator('[data-page-loaded="button"]').evaluate(element => element.classList.contains('density-compact')), 'Mobile drawer must update preview density')
      await selectSetting(mobilePage, '语言', 'en')
      await mobilePage.waitForURL(url => url.pathname === `${normalizedBase}en/docs/components/button/`)
      await mobilePage.waitForFunction(() => document.documentElement.lang === 'en')
      assert.equal(await mobilePage.locator('html').getAttribute('lang'), 'en', 'Mobile drawer language must update the document')
      await mobilePage.goto(`${origin}${normalizedBase}zh-CN/docs/components/button/`)
      await mobilePage.locator('[data-testid="example-c-button-1"]').waitFor()
      for (const theme of ['light', 'dark', 'pitch-black']) {
        await mobilePage.evaluate(value => localStorage.setItem('exui-docs-theme', value), theme)
        await mobilePage.reload()
        await mobilePage.waitForFunction(expected => document.documentElement.classList.contains(expected), theme)
        await mobilePage.evaluate(() => document.fonts.ready)
        await mobilePage.getByRole('heading', { name: '基本用法' }).waitFor()
        assert.equal(await mobilePage.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `Mobile horizontal overflow in ${theme}`)
        await assertShellLayout(mobilePage, 'mobile')
        await mobilePage.screenshot({ path: path.join(screenshots, `glass-mobile-${theme}.png`), animations: 'disabled' })
      }
      await mobile.close()
      const noJs = await chromiumBrowser.newContext({ javaScriptEnabled: false })
      const staticPage = await noJs.newPage()
      await staticPage.goto(origin + examplePath(id, normalizedBase))
      assert.ok((await staticPage.locator('body').innerText()).includes('## Files'))
      await staticPage.goto(origin + normalizedBase + docRoute.slice(1))
      assert.ok((await staticPage.locator('body').innerText()).length > 40)
      await noJs.close()
      assert.deepEqual(errors, [], 'Browser runtime errors')
      await context.close()
    }
    return { origin, base: normalizedBase, paths: paths.length, documents: documentCount, examples: examples.length }
  } finally {
    await chromiumBrowser?.close()
    await new Promise(resolve => server.close(resolve))
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  verifyDocsStatic({ output: path.resolve(repository, process.argv[2] ?? 'packages/docs/build/client'), base: process.argv[3] ?? '/' })
    .then(result => console.log(JSON.stringify(result)))
    .catch(error => { console.error(error); process.exitCode = 1 })
}
