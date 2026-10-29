import { test } from 'node:test'
import assert from 'node:assert/strict'
import { access, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const entry = new URL('../dist/glass-icons/index.js', import.meta.url)
async function icons() {
  await assert.doesNotReject(access(entry), 'build must produce the icon entry')
  const [{ createElement }, { renderToStaticMarkup }, components] = await Promise.all([import('react'), import('react-dom/server'), import(entry.href)])
  return { ...components, createElement, renderToStaticMarkup }
}

test('camera defaults to an 8rem decorative SVG and accepts SVG sizing', async () => {
  const { CameraIcon, createElement, renderToStaticMarkup } = await icons()
  const render = (props) => renderToStaticMarkup(createElement(CameraIcon, props))
  const html = render()
  assert.match(html, /width="8rem"/)
  assert.match(html, /height="8rem"/)
  assert.match(html, /viewBox="0 0 128 128"/)
  assert.match(html, /aria-hidden="true"/)
  assert.match(render({ size: 32 }), /width="32" height="32"/)
  assert.match(render({ size: '2em', width: 40, className: 'test', style: { opacity: 0.5 } }), /width="40" height="2em"[^>]*class="test"[^>]*style="opacity:0.5"/)
})

test('title labels icons and explicit aria labels take precedence', async () => {
  const { CameraIcon, createElement, renderToStaticMarkup } = await icons()
  const html = renderToStaticMarkup(createElement(CameraIcon, { title: 'A & B' }))
  assert.match(html, /role="img"/)
  assert.match(html, /aria-labelledby="([^"]+)"/)
  assert.match(html, /<title id="[^"]+">A &amp; B<\/title>/)
  assert.doesNotMatch(html, /aria-hidden="true"/)
  const explicit = renderToStaticMarkup(createElement(CameraIcon, { title: 'Other', 'aria-label': 'Camera' }))
  assert.match(explicit, /aria-label="Camera"/)
  assert.doesNotMatch(explicit, /aria-labelledby=/)
})

test('each instance has disjoint IDs and resolves every local reference', async () => {
  const { CameraIcon, createElement, renderToStaticMarkup } = await icons()
  const html = renderToStaticMarkup(createElement('div', null, createElement(CameraIcon), createElement(CameraIcon)))
  const instances = [...html.matchAll(/<svg\b[\s\S]*?<\/svg>/g)].map((match) => match[0])
  assert.equal(instances.length, 2)
  const all = new Set()
  for (const instance of instances) {
    const ids = [...instance.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])
    assert.ok(ids.length > 0)
    for (const id of ids) { assert.ok(!all.has(id), `duplicate ${id}`); all.add(id) }
    for (const [, url, href] of instance.matchAll(/(?:url\(#([^)]*)\)|(?:href|xlink:href)="#([^"]+)")/g)) {
      assert.ok(ids.includes(url || href), `unresolved ${url || href}`)
    }
  }
})

test('build contains 50 components and standalone SVGs with URL types', async () => {
  const { createElement, renderToStaticMarkup, ...exports } = await icons()
  assert.equal(Object.keys(exports).filter((name) => name.endsWith('Icon')).length, 50)
  for (const [name, Icon] of Object.entries(exports)) {
    const html = renderToStaticMarkup(createElement(Icon))
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])
    assert.equal(new Set(ids).size, ids.length, name)
    for (const id of ids) assert.match(id, /^\S+$/, `${name}: whitespace in ID`)
    for (const [, url, href] of html.matchAll(/(?:url\(#([^)]*)\)|(?:href|xlink:href)="#([^"]+)")/g)) {
      assert.ok(ids.includes(url || href), `${name}: unresolved ${url || href}`)
    }
  }
  const dir = new URL('../dist/glass-icons/', import.meta.url)
  const files = await readdir(dir)
  assert.equal(files.filter((name) => name.endsWith('.svg')).length, 50)
  for (const name of files.filter((name) => name.endsWith('.svg'))) {
    assert.match(await readFile(new URL(`${name}.d.ts`, dir), 'utf8'), /export default url/)
  }
})

const palettes = {
  blue: ['#39AFFD', '#477FFF', '#4096FE', '#0062FF', '#3EA0FE'],
  green: ['#9BF763', '#26AB5B', '#72DC60', '#30AD31'],
  purple: ['#BC94FF', '#9F66FF', '#BA90FF', '#8237FF'],
  pink: ['#FF759F', '#FF196E', '#FF749F', '#E31352'],
  coral: ['#FFA78F', '#F23E2C', '#FFAC95', '#EF5641'],
  orange: ['#FFB37F', '#FF7B0D', '#FFCBB9', '#EB6F0A'],
}

test('every icon accepts all six color presets without leaving paint from its original palette', async () => {
  const { createElement, renderToStaticMarkup, ...components } = await icons()
  for (const [name, Icon] of Object.entries(components)) {
    for (const [color, allowed] of Object.entries(palettes)) {
      const html = renderToStaticMarkup(createElement(Icon, { color }))
      const paints = [...html.matchAll(/\b(?:fill|stroke|stop-color)="(#[0-9a-f]+)"/gi)].map(match => match[1].toUpperCase())
      assert.ok(paints.length > 0, `${name}/${color}: colored artwork is present`)
      assert.ok(paints.every(paint => allowed.includes(paint)), `${name}/${color}: unexpected paint ${paints.join(', ')}`)
      assert.doesNotMatch(html, /<svg\b[^>]*\bcolor=/, 'color selects artwork instead of forwarding an inert SVG attribute')
    }
  }
})

test('recoloring preserves glass highlights, masks, geometry, opacity and shadow alpha', async () => {
  const { createElement, renderToStaticMarkup, ...components } = await icons()
  function material(markup) {
    return markup
      .replace(/\b(fill|stroke|stop-color)="#[0-9a-f]+"/gi, '$1="PAINT"')
      .replace(/(<feColorMatrix\b[^>]*\bvalues=")([^"]+)(")/g, (_match, before, value, after) => {
        const matrix = value.split(/\s+/).map(Number)
        for (const index of [4, 9, 14]) matrix[index] = 0
        return before + matrix.join(' ') + after
      })
  }
  for (const [name, Icon] of Object.entries(components)) {
    const original = renderToStaticMarkup(createElement(Icon))
    const blue = renderToStaticMarkup(createElement(Icon, { color: 'blue' }))
    assert.ok(material(blue) === material(original), `${name}: only paint and shadow RGB may change`)
    const shadowMatrices = markup => [...markup.matchAll(/<feColorMatrix\b[^>]*\bvalues="([^"]+)"/g)]
      .map(match => match[1].split(/\s+/).map(Number)).filter(matrix => [4, 9, 14].some(index => matrix[index] !== 0))
    const shadows = shadowMatrices(blue)
    assert.equal(shadows.length, shadowMatrices(original).length, `${name}: existing shadows are preserved`)
    for (const matrix of shadows) assert.deepEqual([matrix[4], matrix[9], matrix[14]], [0.15375, 0.522433, 0.9], name)
  }
})

test('unsupported runtime colors retain the original artwork and separate instances keep their own palettes', async () => {
  const { HeartIcon, createElement, renderToStaticMarkup } = await icons()
  const original = renderToStaticMarkup(createElement(HeartIcon))
  for (const color of ['', 'red', '#123456', 'toString', '__proto__']) {
    assert.ok(renderToStaticMarkup(createElement(HeartIcon, { color })) === original, `${color}: original artwork must be retained`)
  }
  const html = renderToStaticMarkup(createElement('div', null,
    createElement(HeartIcon, { color: 'blue' }), createElement(HeartIcon, { color: 'green' }), createElement(HeartIcon)))
  const instances = [...html.matchAll(/<svg\b[\s\S]*?<\/svg>/g)].map(match => match[0])
  assert.match(instances[0], /stop-color="#39AFFD"/)
  assert.match(instances[1], /stop-color="#9BF763"/)
  assert.match(instances[2], /stop-color="#FF759F"/)
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1])
  assert.equal(new Set(ids).size, ids.length)
})

test('public color types accept preset words and reject arbitrary CSS colors', async () => {
  const root = fileURLToPath(new URL('../', import.meta.url)).replace(/[\\/]$/, '')
  const fixture = await mkdtemp(join(root, '.color-types-'))
  try {
    await writeFile(join(fixture, 'check.ts'), `import type { GlassIconProps } from '../dist/glass-icons/index.js'
const presets: GlassIconProps[] = [{}, { color: 'blue' }, { color: 'green' }, { color: 'purple' }, { color: 'pink' }, { color: 'coral' }, { color: 'orange' }]
// @ts-expect-error Hex colors are outside the preset-only contract.
const hex: GlassIconProps = { color: '#123456' }
// @ts-expect-error Unlisted CSS color words are outside the preset-only contract.
const other: GlassIconProps = { color: 'red' }
// @ts-expect-error CSS variables are outside the preset-only contract.
const variable: GlassIconProps = { color: 'var(--primary)' }
void [presets, hex, other, variable]
`)
    const require = createRequire(import.meta.url)
    const result = spawnSync(process.execPath, [require.resolve('typescript/bin/tsc'), '--ignoreConfig', '--noEmit', '--strict', '--module', 'NodeNext', '--moduleResolution', 'NodeNext', '--lib', 'ES2022,DOM', join(fixture, 'check.ts')], { cwd: root, encoding: 'utf8' })
    assert.equal(result.status, 0, result.stdout + result.stderr)
  } finally {
    assert.equal(dirname(fixture), root)
    await rm(fixture, { recursive: true, force: true })
  }
})
