import assert from 'node:assert/strict'
import { test } from 'node:test'
import { assertPrivateCss, assertStyleSources } from './docs-example-styles.mjs'

const utilities = '.max-w-lg {max-width:32rem}.mb-auto {margin-bottom:auto}.hover\\:text-primary:hover {color:var(--primary)}'

test('private CSS rejects a second reset or root brand assignments', () => {
  assert.doesNotThrow(() => assertPrivateCss(utilities))
  for (const invalid of ['@layer base {body{margin:0}}', ':root{--primary:red}', 'html{color:red}', '.dark{--exui-color:red}', '*{box-sizing:border-box}']) {
    assert.throws(() => assertPrivateCss(invalid + utilities))
  }
})

test('source policy rejects automatic or widened scanning and root theme maps', () => {
  const source = '@import "tailwindcss/theme.css" layer(theme) theme(inline reference); @import "tailwindcss/utilities.css" source(none); @source "./examples"; @source "./pages/components";'
  const theme = '@theme inline reference {--color-primary:var(--primary)}'
  assert.doesNotThrow(() => assertStyleSources(source, theme))
  assert.throws(() => assertStyleSources(source.replace('source(none)', ''), theme))
  assert.throws(() => assertStyleSources(source + '@source "../../components/src";', theme))
  assert.throws(() => assertStyleSources(source + '@source inline("grid");', theme))
  assert.throws(() => assertStyleSources(source, theme + ' :root {--primary:red}'))
  assert.throws(() => assertStyleSources(source.replace('theme(inline reference)', 'theme(inline)'), theme))
  assert.throws(() => assertStyleSources(source, theme.replace('@theme inline reference', '@theme inline')))
})
