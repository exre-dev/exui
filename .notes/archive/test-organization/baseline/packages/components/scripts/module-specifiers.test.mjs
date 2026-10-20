import assert from "node:assert/strict"
import { test } from "node:test"
import { findModuleSpecifierOccurrences } from "./module-specifiers.mjs"

test("module specifier offsets remain UTF-16 accurate after astral characters", () => {
  const source = "/** 😀 */\nimport type { RootContent } from 'hast';"
  const [occurrence] = findModuleSpecifierOccurrences(source)
  assert.equal(source.slice(occurrence.valueStart, occurrence.valueStart + occurrence.specifier.length), "hast")
})
