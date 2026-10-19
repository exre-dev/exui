import test from 'node:test'
import assert from 'node:assert/strict'
import { exampleAssetBase, prefixExampleAssetUrls } from '../../lib/example-assets.ts'

const source = [
  'const photo = <img src="/examples/reui/photos/photo.jpg" />',
  'const images = { remote: "/examples/reui/photos/avatar.png" }',
  'const flag = `/examples/reui/flags/${country}.svg`',
  'const staticFlag = `/examples/reui/flags/us.svg`',
  'const picker = <EmojiPicker dataUrl="/examples/reui/emoji/emojibase-data-17.0.0" />',
].join('\n')

test('managed image, flag and emoji URLs respect the deployment prefix', () => {
  const actual = prefixExampleAssetUrls(source, 'example.tsx', '/exui/')
  assert.equal(actual, source.replaceAll('/examples/reui/', '/exui/examples/reui/'))
})

test('root deployment retains the exact locked source and prefixes are idempotent', () => {
  assert.equal(prefixExampleAssetUrls(source, 'example.tsx', '/'), source)
  const once = prefixExampleAssetUrls(source, 'example.tsx', '/exui')
  assert.equal(prefixExampleAssetUrls(once, 'example.tsx', '/exui/'), once)
})

test('comments, remote URLs and unrelated routes are unchanged', () => {
  const code = '// "/examples/reui/photos/comment.jpg"\nconst remote = "https://host/examples/reui/photos/a.jpg"\nconst label = "See /examples/reui/photos/a.jpg"\nconst share = "/examples/c-button-1/"'
  assert.equal(prefixExampleAssetUrls(code, 'example.ts', '/exui/'), code)
})

test('Vite integration transforms example modules while leaving app and maintenance sources alone', () => {
  const plugin = exampleAssetBase()
  plugin.configResolved({ base: '/exui/' })
  assert.equal(plugin.enforce, 'pre')
  assert.equal(plugin.transform(source, 'D:\\repo\\packages\\docs\\src\\showcase\\examples\\demo.tsx?direct').code, source.replaceAll('/examples/reui/', '/exui/examples/reui/'))
  assert.equal(plugin.transform(source, '/repo/packages/docs/src/showcase/pages/components/demo.tsx').code, source.replaceAll('/examples/reui/', '/exui/examples/reui/'))
  assert.equal(plugin.transform(source, '/repo/packages/docs/app/routes/docs.tsx'), undefined)
  assert.equal(plugin.transform(source, '/repo/scripts/docs-sharing.mjs'), undefined)
  const root = exampleAssetBase()
  root.configResolved({ base: '/' })
  assert.equal(root.transform(source, '/repo/packages/docs/src/showcase/examples/demo.tsx'), undefined)
})
