import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const css = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8')

test('ReUI semantic colors resolve through the ExUI theme variables', () => {
  const aliases = {
    primary: 'control-primary',
    'primary-foreground': 'control-primary-foreground',
    accent: 'surface-accent',
    background: 'surface-background',
    foreground: 'text-primary',
    focus: 'control-focus-ring',
    'focus-foreground': 'control-primary-foreground',
    border: 'border-default',
    input: 'border-input',
    ring: 'control-focus-ring',
    destructive: 'control-danger',
    popover: 'surface-popover',
    'popover-foreground': 'surface-popover-foreground',
    success: 'feedback-success',
    'success-foreground': 'feedback-success-foreground',
    warning: 'feedback-warning',
    'warning-foreground': 'feedback-warning-foreground',
    info: 'feedback-info',
    'info-foreground': 'feedback-info-foreground',
    invert: 'text-primary',
    'invert-foreground': 'text-inverse',
  }
  for (const [alias, token] of Object.entries(aliases)) {
    assert.match(css, new RegExp(`--${alias}: var\\(--exui-${token}\\)`))
    for (const selector of ['.dark', '.pitch-black']) {
      const block = css.match(new RegExp(`\\${selector} \\{([^}]+)\\}`))?.[1]
      assert.ok(block?.includes(`--${alias}: var(--exui-${token});`), `${selector} must redeclare --${alias} for subtree themes`)
    }
  }
})
