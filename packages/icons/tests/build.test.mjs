import { test } from 'node:test'
import assert from 'node:assert/strict'
import { copyFile, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

async function checkRejected(source, expected) {
  const root = fileURLToPath(new URL('../', import.meta.url))
  const fixture = await mkdtemp(join(root, '.build-test-'))
  try {
    for (const dir of ['scripts', 'src', 'glass-icons']) await mkdir(join(fixture, dir))
    await copyFile(join(root, 'scripts/build.mjs'), join(fixture, 'scripts/build.mjs'))
    await writeFile(join(fixture, 'package.json'), '{"type":"module"}')
    await writeFile(join(fixture, 'tsconfig.json'), JSON.stringify({ extends: '../tsconfig.json' }))
    await writeFile(join(fixture, 'src/create-glass-icon.ts'), `export type GlassIconColor = 'blue'\n${source}`)
    await writeFile(join(fixture, 'glass-icons/test.svg'), '<svg viewBox="0 0 128 128"><path d="M0 0" /></svg>')
    const result = spawnSync(process.execPath, [join(fixture, 'scripts/build.mjs')], { cwd: fixture, encoding: 'utf8' })
    assert.notEqual(result.status, 0, 'compiler policy violation must fail the build')
    assert.match(result.stdout + result.stderr, expected)
  } finally {
    await rm(fixture, { recursive: true, force: true })
  }
}

test('icon build rejects implicit any', async () => {
  await checkRejected('export type GlassIconProps = {}\nexport function createGlassIcon(value) { return value }\n', /TS7006.*implicitly has an 'any' type/)
})

test('icon build inherits noUnusedLocals from the workspace', async () => {
  await checkRejected('export type GlassIconProps = {}\nexport function createGlassIcon(value: string) { const unused = 1; return value }\n', /TS6133.*unused/)
})
