import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const showcase = path.join(root, 'packages/docs')
const requireShowcase = createRequire(path.join(showcase, 'package.json'))
const styleDirectory = path.join(showcase, 'src/showcase')

/** Properties fallback initialization is allowed; a second base/reset is not. */
export function assertPrivateCss(css) {
  assert(!/@layer\s+base\s*\{/.test(css), 'private CSS must not contain a second Preflight/base layer')
  assert(!/(?:^|[{}])\s*(?::root|:host|html|body)\b[^{}]*\{/.test(css), 'private CSS must not assign a global root theme')
  assert(!/--(?:exui-[\w-]+|primary|background|foreground|density-[\w-]+)\s*:/.test(css), 'private CSS must reference public brand/density variables, not assign them')
  assert(!/box-sizing\s*:\s*border-box/.test(css), 'private CSS must not emit a box-sizing reset')
  assert(/\.max-w-lg\s*\{[^}]*max-width:\s*32rem/.test(css), 'original Accordion max-w-lg utility is missing')
  assert(/\.mb-auto\s*\{[^}]*margin-bottom:\s*auto/.test(css), 'original Accordion mb-auto utility is missing')
  assert(css.includes('.hover\\:text-primary'), 'original DataGrid hover variant is missing')
}

export function assertStyleSources(css, theme) {
  assert(!/preflight|@import\s+["']tailwindcss["']/.test(css), 'private entry must not import Preflight')
  assert(css.includes('source(none)'), 'automatic source scanning must stay disabled')
  assert(css.includes('@import "tailwindcss/theme.css" layer(theme) theme(inline reference);'), 'the default theme must stay inline and reference-only to prevent arbitrary values from emitting a root palette')
  assert.deepEqual([...css.matchAll(/@source\s+([^;]+);/g)].map(match => match[1].trim()), ['"./examples"', '"./pages/components"'], 'private sources must be limited to examples and component pages')
  assert(!/:root|:host|\.dark|density-/.test(theme), 'semantic mapping must not assign a root theme or density')
  assert(theme.startsWith('@theme inline reference {'), 'semantic references must compile inline and reference-only without root aliases')
}

async function cssBuild(input) {
  const { build } = await import(pathToFileURL(requireShowcase.resolve('vite')).href)
  const { default: tailwindcss } = await import(pathToFileURL(requireShowcase.resolve('@tailwindcss/vite')).href)
  const result = await build({
    configFile: false,
    root: showcase,
    logLevel: 'error',
    plugins: [tailwindcss()],
    build: { write: false, cssMinify: false, emptyOutDir: false, rollupOptions: { input } },
  })
  const outputs = (Array.isArray(result) ? result : [result]).flatMap(bundle => bundle.output)
  const css = outputs.filter(output => output.type === 'asset' && output.fileName.endsWith('.css')).map(output => String(output.source)).join('\n')
  assert(css.length > 0, 'Vite did not produce a stylesheet')
  return css
}

export async function checkExampleStyles() {
  const utilityPath = path.join(styleDirectory, 'example-utilities.css')
  const [entry, theme] = await Promise.all([readFile(utilityPath, 'utf8'), readFile(path.join(styleDirectory, 'example-theme.css'), 'utf8')])
  assertStyleSources(entry, theme)
  const privateCss = await cssBuild(utilityPath)
  assertPrivateCss(privateCss)
  const publicCss = await readFile(requireShowcase.resolve('@exre/exui/style.css'), 'utf8')
  assert(['.max-w-lg', '.mb-auto'].some(selector => !publicCss.includes(selector)), 'the layout utility proof must include a class absent from the public stylesheet')

  const flags = path.join(showcase, 'public/examples/reui/flags')
  const provenance = JSON.parse(await readFile(path.join(flags, 'sources.json'), 'utf8'))
  assert.equal(provenance.files.length, 10, 'the original grid requires ten locally preserved country flags')
  for (const file of provenance.files) {
    assert(/^[a-z]{2}\.svg$/.test(file.file), `invalid local flag filename: ${file.file}`)
    const bytes = await readFile(path.join(flags, file.file))
    assert.equal(createHash('sha256').update(bytes).digest('hex'), file.sha256, `local flag hash mismatch: ${file.file}`)
  }

  // Check the application's actual Vite output as well as the isolated private sheet.
  const assets = path.join(showcase, 'build/client/assets')
  const productionCss = (await Promise.all((await readdir(assets)).filter(file => file.endsWith('.css')).map(file => readFile(path.join(assets, file), 'utf8')))).join('\n')
  assert(productionCss.includes('.max-w-lg') && productionCss.includes('.mb-auto'), 'production Showcase CSS lacks the original Accordion utilities')
  assert(productionCss.includes('.hover\\:text-primary'), 'production Showcase CSS lacks the source hover variant')

  // A temporary compiler fixture proves arbitrary values and the dark selector.
  // It is outside all product scan roots and never adds test classes to examples.
  const temporary = await mkdtemp(path.join(os.tmpdir(), 'exui-example-style-'))
  let browser
  try {
    const source = entry
      .replace('"tailwindcss/theme.css"', JSON.stringify(requireShowcase.resolve('tailwindcss/theme.css').replaceAll('\\', '/')))
      .replace('"tailwindcss/utilities.css"', JSON.stringify(requireShowcase.resolve('tailwindcss/utilities.css').replaceAll('\\', '/')))
      .replace('"./example-theme.css"', JSON.stringify(path.join(styleDirectory, 'example-theme.css').replaceAll('\\', '/')))
      .replace(/@source[^;]+;/g, '')
      + '\n@source inline("grid grid-cols-[13px_17px] dark:grid-cols-[19px_31px]");\n'
    const fixture = path.join(temporary, 'fixture.css')
    await writeFile(fixture, source)
    const fixtureCss = await cssBuild(fixture)
    assert(fixtureCss.includes('.dark\\:grid-cols-\\[19px_31px\\]') && fixtureCss.includes('.dark *'), 'dark variant is absent from production compiler output')
    const { chromium } = requireShowcase('playwright')
    browser = await chromium.launch({ headless: true })
    const page = await browser.newPage()
    await page.setContent('<div id="utility" class="grid grid-cols-[13px_17px] dark:grid-cols-[19px_31px]"></div>')
    await page.addStyleTag({ content: fixtureCss })
    assert.equal(await page.locator('#utility').evaluate(element => getComputedStyle(element).gridTemplateColumns), '13px 17px')
    await page.evaluate(() => document.documentElement.classList.add('dark'))
    assert.equal(await page.locator('#utility').evaluate(element => getComputedStyle(element).gridTemplateColumns), '19px 31px')
  } finally {
    await browser?.close()
    assert(path.dirname(path.resolve(temporary)) === path.resolve(os.tmpdir()) && path.basename(temporary).startsWith('exui-example-style-'), 'temporary cleanup escaped the intended directory')
    await rm(temporary, { recursive: true, force: true })
  }
  console.log('Showcase private CSS: explicit scan roots, no second reset/root theme, original utilities and hover variant in production; temporary arbitrary/dark utility passes Chromium.')
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  checkExampleStyles().catch(error => { console.error(error); process.exitCode = 1 })
}
