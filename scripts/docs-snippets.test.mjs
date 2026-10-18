import assert from "node:assert/strict"
import test from "node:test"
import { createFamilySnippet, validateFamilySnippet, addCapabilitySources, extractVerifiedModules, authoredGuideModules, glassSurfaceTypeContract } from "./docs-snippets.mjs"

test("family excerpts accept Windows checkout newlines while rejecting source drift", () => {
  const page = { group: "components", exampleFamily: "button", contentPath: "components/button.mdx" }
  const document = { entry: "src/example.tsx", files: new Map([["src/example.tsx", 'import { Button } from "@exre/exui"\nexport default function Example() { return <Button>\n  Go\n</Button> }']]) }
  const snippet = createFamilySnippet(document, "button")
  const source = `\`\`\`tsx source="c-button-1"\n${snippet}\n\`\`\`\n\n[Source](../../../../examples/c-button-1/)\n`
  for (const content of [source, source.replaceAll("\n", "\r\n")]) {
    assert.equal(validateFamilySnippet(page, content, document), "c-button-1")
    assert.throws(() => validateFamilySnippet(page, content.replace("Go", "Changed"), document), /differs/)
    assert.throws(() => validateFamilySnippet(page, content.replace("c-button-1", "c-button-2"), document), /source-linked/)
    assert.throws(() => validateFamilySnippet(page, content.replace("[Source]", "Source"), document), /link is missing/)
  }
})

test("family excerpt keeps public SelectField import alias", () => {
  const document = { entry: "src/example.tsx", files: new Map([["src/example.tsx", `import { SelectField as Select, SelectTrigger } from "@exre/exui"\nexport function Example() { return <Select><SelectTrigger /></Select> }`]]) }
  const snippet = createFamilySnippet(document, "select")
  assert.match(snippet, /SelectField as Select/)
  assert.doesNotMatch(snippet, /import \{ Select,/)
})

test("all capability-linked share sources join independent compilation", () => {
  const document = { entry: "src/example.tsx", files: new Map() }
  const documents = new Map([["c-button-1", document]])
  const examples = [{ id: "c-button-1" }, { id: "exui-button-shapes" }, { id: "c-select-7" }]
  const registry = { capabilities: [{ examples: ["exui-button-shapes", "c-select-7"] }] }
  const calls = []
  addCapabilitySources(documents, examples, registry, (example) => { calls.push(example.id); return document })
  assert.deepEqual(calls, ["exui-button-shapes", "c-select-7"])
  assert.equal(documents.size, 3)
  assert.throws(() => addCapabilitySources(new Map(), examples, { capabilities: [{ examples: ["missing"] }] }, () => document), /missing.*example/i)
})

test("top-level zod verification is allowed but private subpaths remain rejected", () => {
  const verified = '```tsx verify\nimport { z } from "zod"\nexport const schema = z.string()\n```'
  assert.equal(extractVerifiedModules(verified, "test.mdx").length, 1)
  assert.throws(() => extractVerifiedModules(verified.replace('"zod"', '"zod/private"'), "test.mdx"), /unsupported import/i)
})

test("guide module cardinality ignores bounded capability additions", () => {
  const module = '```tsx verify\nimport { Button } from "@exre/exui"\nexport const Example = Button\n```'
  for (const [start, end] of [
    ["{/* exui-capabilities:begin:docs */}", "{/* exui-capabilities:end:docs */}"],
    ["<!-- exui-capabilities:begin:docs -->", "<!-- exui-capabilities:end:docs -->"],
  ]) {
    const source = `${module}\n\n${start}\n${module}\n${end}`
    assert.equal(authoredGuideModules(source, "test.mdx").length, 1)
    assert.equal(extractVerifiedModules(source, "test.mdx").length, 2)
  }
  const mixed = `${module}\n\n{/* exui-capabilities:begin:docs */}\n${module}\n<!-- exui-capabilities:end:docs -->`
  assert.throws(() => authoredGuideModules(mixed, "test.mdx"), /Malformed docs generated boundaries/)
})

test("Glass type contract checks every registered public slot, including later entries", () => {
  const contract = glassSurfaceTypeContract({ capabilities: [{ surfaces: { tabs: ["TabsList", "TabsTrigger"], "data-grid": ["DataGridContainer"] } }] })
  for (const name of ["TabsList", "TabsTrigger", "DataGridContainer"]) assert.match(contract, new RegExp(`ComponentProps<typeof ${name}>\\["glass"\\]`))
  assert.doesNotMatch(contract, /ComponentProps<typeof Tabs>\[/)
})
