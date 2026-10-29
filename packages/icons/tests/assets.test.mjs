import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'

const dir = new URL('../glass-icons/', import.meta.url)
test('glass SVG assets have a complete, self-contained normalized inventory', async () => {
  const files = (await readdir(dir)).filter((name) => name.endsWith('.svg'))
  assert.equal(files.length, 50)
  assert.ok(files.includes('camera.svg') && files.includes('paper-plus.svg'))
  assert.equal(new Set(files).size, files.length)
  for (const name of files) {
    assert.match(name, /^[a-z0-9]+(?:-[a-z0-9]+)*\.svg$/)
    const svg = await readFile(new URL(name, dir), 'utf8')
    assert.match(svg, /viewBox="0 0 128 128"/)
    assert.match(svg, /<path\b/)
    assert.doesNotMatch(svg, /<foreignObject|<image\b|backdrop-filter|<rect\b[^>]*(?:width="128" height="128"|width="1400" height="1400")/i, name)
    const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1])
    assert.equal(new Set(ids).size, ids.length, `${name}: duplicate IDs`)
    for (const [, urlRef, hrefRef] of svg.matchAll(/(?:url\(#([^)]*)\)|(?:href|xlink:href)="#([^"]+)")/g)) {
      const ref = urlRef || hrefRef
      if (ref) assert.ok(ids.includes(ref), `${name}: missing ${ref}`)
    }
    for (const [, ref] of svg.matchAll(/(?:href|xlink:href)="([^"]+)"/g)) assert.ok(ref.startsWith('#'), `${name}: external href`)
  }
})
