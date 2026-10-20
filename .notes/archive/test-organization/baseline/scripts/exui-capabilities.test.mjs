import assert from "node:assert/strict"
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { createRequire } from "node:module"
import { fileURLToPath, pathToFileURL } from "node:url"
import test from "node:test"
import { validateRegistry, renderBounded, removeBounded, sourceReviewDiff, sourceReviewCoverageDiff, docsContent, validateFragment, skillOverlay, acceptSourceReview, writeCapabilityOutputs } from "./exui-capabilities.mjs"

const pages = [{ id: "components/button", locale: "en" }, { id: "components/button", locale: "zh-CN" }]
const examples = [{ id: "c-button-1", page: { group: "components", id: "button" } }]
const record = { id: "button-shape", origin: "adapted", pages: ["components/button"], families: ["button"], symbols: ["Button"], examples: ["c-button-1"], sources: ["packages/components/src/components/ui/button.tsx"], guides: [{ docs: "components/button", skill: "button" }] }
const registry = { schemaVersion: 1, capabilities: [record] }
const inventory = { pages, examples, symbols: ["Button"], sources: ["packages/components/src/components/ui/button.tsx"], skillFiles: ["button"] }

test("registry rejects unknown symbol, missing page/example and path escape", () => {
  assert.doesNotThrow(() => validateRegistry(registry, inventory))
  assert.throws(() => validateRegistry({ ...registry, capabilities: [{ ...record, symbols: ["Unknown"] }] }, inventory), /Unknown.*symbol/i)
  assert.throws(() => validateRegistry({ ...registry, capabilities: [{ ...record, pages: ["components/missing"] }] }, inventory), /missing.*page/i)
  assert.throws(() => validateRegistry({ ...registry, capabilities: [{ ...record, examples: ["c-missing"] }] }, inventory), /missing.*example/i)
  assert.throws(() => validateRegistry({ ...registry, capabilities: [{ ...record, sources: ["../secret.tsx"] }] }, inventory), /invalid.*source/i)
  assert.throws(() => validateRegistry({ ...registry, capabilities: [record, record] }, inventory), /duplicate.*capability/i)
})

test("the current capability map accounts for every new Trace and upstream helper export", async (t) => {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
  const currentRegistry = JSON.parse(await readFile(path.join(root, "packages/docs/exui/capabilities.json"), "utf8"))
  const previous = JSON.parse(await readFile(path.join(root, "packages/docs/exui/source-review.json"), "utf8"))
  const names = [
    "Trace", "TraceLine", "TraceIcon", "TraceTitle", "TraceDescription",
    "TraceCollapsible", "TraceCollapsibleTrigger", "TraceCollapsibleContent",
    "focusCascaderHome", "getCascaderListedValues", "withCascaderMoreRow", "useDataGridAtom",
  ]
  const after = { ...previous, exports: [...new Set([...previous.exports, ...names])].sort() }
  const temporary = await mkdtemp(path.join(tmpdir(), "exui-upgrade-capability-test-"))
  t.after(() => rm(temporary, { recursive: true, force: true }))
  const filename = path.join(temporary, "source-review.json")
  await writeFile(filename, JSON.stringify(previous))
  await acceptSourceReview(filename, after, currentRegistry)
  const accepted = JSON.parse(await readFile(filename, "utf8"))
  for (const name of names) assert.ok(accepted.reviewedExports.includes(name), `${name} lacks a reviewed capability mapping or exclusion`)
})

test("bounded generation replaces only its own section and rejects malformed boundaries", () => {
  const source = "---\nid: components/button\n---\n\nHuman introduction.\n\n## Basic usage\n\nHuman usage.\n"
  const generated = renderBounded(source, "Generated guidance.", "docs")
  assert.match(generated, /Human introduction/)
  assert.match(generated, /Human usage/)
  assert.match(generated, /Generated guidance/)
  assert.equal(renderBounded(generated, "Generated guidance.", "docs"), generated)
  assert.notEqual(renderBounded(generated, "Changed guidance.", "docs"), generated)
  assert.throws(() => renderBounded(generated.replace("{/* exui-capabilities:end:docs */}", ""), "Guidance", "docs"), /malformed.*boundar/i)
})

test("docs boundaries compile as MDX and migrate legacy HTML markers once", async () => {
  const requireDocs = createRequire(path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../packages/docs/package.json"))
  const requireFumadocs = createRequire(requireDocs.resolve("fumadocs-mdx"))
  const { compile } = await import(pathToFileURL(requireFumadocs.resolve("@mdx-js/mdx")).href)
  const source = "---\nid: components/button\n---\n\nHuman introduction.\n\n## Basic usage\n\nHuman guidance.\n"
  const legacy = source.replace("\n## Basic usage", "\n<!-- exui-capabilities:begin:docs -->\nOld note.\n<!-- exui-capabilities:end:docs -->\n\n## Basic usage")
  await assert.rejects(compile(legacy, { format: "mdx" }), /Unexpected character/)
  const migrated = renderBounded(legacy, "New note.", "docs")
  assert.equal((migrated.match(/exui-capabilities:begin:docs/g) ?? []).length, 1)
  assert.match(migrated, /\{\/\* exui-capabilities:begin:docs \*\/\}/)
  assert.doesNotMatch(migrated, /<!-- exui-capabilities/)
  await compile(migrated, { format: "mdx" })
  assert.equal(removeBounded(legacy, "docs"), source)
  assert.throws(() => renderBounded(migrated.replace("{/* exui-capabilities:end:docs */}", "<!-- exui-capabilities:end:docs -->"), "Again", "docs"), /malformed.*boundar/i)
})

test("source review requires explicit acceptance for both source and export drift", () => {
  const current = { schemaVersion: 1, files: { "packages/components/src/index.ts": "a" }, exports: ["Button"] }
  assert.deepEqual(sourceReviewDiff(current, current), [])
  assert.match(sourceReviewDiff(current, { ...current, exports: ["Button", "New"] }).join(" "), /export/i)
  assert.match(sourceReviewDiff(current, { ...current, files: { ...current.files, "packages/components/src/index.ts": "b" } }).join(" "), /source/i)
})

test("accepting newly exported names requires capability mapping or a concrete exclusion", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "exui-source-review-test-"))
  t.after(() => rm(root, { recursive: true, force: true }))
  const file = path.join(root, "review.json")
  const before = { schemaVersion: 1, files: {}, exports: ["Button"] }
  const after = { schemaVersion: 1, files: {}, exports: ["Button", "NewPublicWidget"] }
  assert.match(sourceReviewCoverageDiff(before, registry).join(" "), /reaccept/i)
  await writeFile(file, JSON.stringify(before))
  await assert.rejects(acceptSourceReview(file, after, registry), /NewPublicWidget/)
  assert.deepEqual(JSON.parse(await readFile(file, "utf8")), before)
  await acceptSourceReview(file, after, { ...registry, capabilities: [{ ...record, symbols: ["Button", "NewPublicWidget"] }] })
  assert.deepEqual(JSON.parse(await readFile(file, "utf8")).reviewedExports, ["Button", "NewPublicWidget"])
  assert.match(sourceReviewCoverageDiff(JSON.parse(await readFile(file, "utf8")), registry).join(" "), /NewPublicWidget/)
  assert.deepEqual(sourceReviewCoverageDiff(JSON.parse(await readFile(file, "utf8")), { ...registry, capabilities: [{ ...record, symbols: ["Button", "NewPublicWidget"] }] }), [])
  await acceptSourceReview(file, before, registry)
  assert.deepEqual(JSON.parse(await readFile(file, "utf8")).reviewedExports, ["Button"])
  await writeFile(file, JSON.stringify(before))
  await acceptSourceReview(file, after, { ...registry, exportExclusions: { NewPublicWidget: "Internal migration alias, excluded from the documented consumer capability." } })
  assert.deepEqual(JSON.parse(await readFile(file, "utf8")).reviewedExports, ["Button", "NewPublicWidget"])
  await rm(file)
  await assert.rejects(acceptSourceReview(file, after, registry), /bootstrap/i)
  await acceptSourceReview(file, after, registry, { bootstrap: true })
  assert.deepEqual(JSON.parse(await readFile(file, "utf8")).reviewedExports, ["Button"])
})

test("offline generation rejects body tampering before any docs or lock writes", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "exui-guarded-generate-test-"))
  t.after(() => rm(root, { recursive: true, force: true }))
  const skillRoot = path.join(root, "skills/exui")
  const references = path.join(skillRoot, "references/components")
  const generated = path.join(skillRoot, "references/generated")
  await mkdir(references, { recursive: true })
  await mkdir(generated, { recursive: true })
  const catalog = '<!-- Generated by scripts/exui-skill/sync-references.mjs. -->\n\n# Local component catalog\n\nUse this catalog to choose a family and read its when-to-use guidance. Each family page links its downloaded c-* pattern descriptions. For exact ExUI exports and props, read [ExUI contracts](exui/setup.md) and the [export inventory](generated/component-exports.md).\n\n- [button](components/button.md)\n'
  const original = '# Button\n\n## When to use\n\nPress.\n'
  const hash = (await import("node:crypto")).createHash("sha256")
  const digest = (value) => hash.copy().update(value).digest("hex")
  await writeFile(path.join(skillRoot, "references/components.md"), catalog)
  await writeFile(path.join(references, "button.md"), original)
  const lock = { schemaVersion: 1, files: { "button.md": digest(original) }, catalogSha256: digest(catalog) }
  const lockFile = path.join(generated, "component-reference-lock.json")
  await writeFile(lockFile, JSON.stringify(lock))
  const docsFile = path.join(root, "docs.mdx")
  await writeFile(docsFile, "Original docs\n")
  await writeFile(path.join(references, "button.md"), `${original}Tampered upstream body.\n`)
  await assert.rejects(writeCapabilityOutputs([{ filename: docsFile, expected: "New docs\n" }, { filename: path.join(references, "button.md"), expected: `${original}New note.\n` }], skillRoot), /reference hash mismatch/i)
  assert.equal(await readFile(docsFile, "utf8"), "Original docs\n")
  assert.deepEqual(JSON.parse(await readFile(lockFile, "utf8")), lock)
  await writeFile(path.join(references, "button.md"), original)
  await writeCapabilityOutputs([{ filename: docsFile, expected: "New docs\n" }, { filename: path.join(references, "button.md"), expected: `${original}New note.\n` }], skillRoot)
  assert.equal(await readFile(docsFile, "utf8"), "New docs\n")
  assert.equal(await readFile(path.join(references, "button.md"), "utf8"), `${original}New note.\n`)
  assert.equal(JSON.parse(await readFile(lockFile, "utf8")).files["button.md"], digest(`${original}New note.\n`))
})

test("shared guidance stays on its primary page and other pages get contextual links", () => {
  const shared = { ...record, id: "glass", origin: "native", pages: ["exui/glass", "components/button"], examples: ["c-button-1"], guides: [{ docs: "exui/glass", skill: "exui/glass.md" }, { docs: "components/button", skill: "button" }] }
  const fragments = new Map([["en/glass", "### Glass behavior\n\nDetailed material semantics.\n\nLong setup instructions remain on the primary guide."]])
  const primary = docsContent({ id: "exui/glass", locale: "en" }, [shared], fragments, examples)
  const linked = docsContent({ id: "components/button", locale: "en" }, [shared], fragments, examples)
  assert.match(primary, /Detailed material semantics/)
  assert.match(primary, /ExUI addition/)
  assert.doesNotMatch(primary, /c-button-1/)
  assert.match(linked, /\.\.\/exui\/glass\.mdx/)
  assert.match(linked, /ExUI addition/)
  assert.match(linked, /c-button-1/)
  assert.doesNotMatch(linked, /Long setup instructions/)
})

test("mixed capability origin is explicit in both locales", () => {
  const mixed = { ...record, origin: "mixed" }
  assert.doesNotThrow(() => validateRegistry({ schemaVersion: 1, capabilities: [mixed] }, inventory))
  const fragments = new Map([["en/button-shape", "### Button shape\n\nUse a capsule."], ["zh-CN/button-shape", "### 按钮形状\n\n使用胶囊形。"]])
  assert.match(docsContent({ id: "components/button", locale: "en" }, [mixed], fragments), /ExUI additions and adaptations/)
  assert.match(docsContent({ id: "components/button", locale: "zh-CN" }, [mixed], fragments), /ExUI 新增与适配/)
})

test("Glass surfaces map is complete, family-scoped and publicly exported", () => {
  const glass = { ...record, id: "glass", pages: ["exui/glass", "components/data-grid"], families: ["data-grid"], symbols: ["Button"], examples: [], surfaces: { "data-grid": ["DataGridContainer"] }, guides: [{ docs: "exui/glass", skill: "exui/glass.md" }, { docs: "components/data-grid", skill: "data-grid" }] }
  const available = { ...inventory, pages: [...pages, { id: "exui/glass", locale: "en" }, { id: "components/data-grid", locale: "en" }], symbols: ["Button", "DataGrid", "DataGridContainer"], skillFiles: ["button", "data-grid", "exui/glass.md"] }
  assert.doesNotThrow(() => validateRegistry({ schemaVersion: 1, capabilities: [glass] }, available))
  assert.throws(() => validateRegistry({ schemaVersion: 1, capabilities: [{ ...glass, surfaces: { "data-grid": ["DataGridRoot"] } }] }, available), /unknown.*surface/i)
  assert.throws(() => validateRegistry({ schemaVersion: 1, capabilities: [{ ...glass, surfaces: { dialog: ["DataGridContainer"] } }] }, available), /surface.*family/i)
  const fragments = new Map([["en/glass", "### Glass material\n\nEach surface opts in independently."]])
  const local = docsContent({ id: "components/data-grid", locale: "en" }, [glass], fragments)
  const primary = docsContent({ id: "exui/glass", locale: "en" }, [glass], fragments)
  const skill = skillOverlay("data-grid", [glass], fragments)
  assert.match(local, /`DataGridContainer`/)
  assert.doesNotMatch(local, /`DataGrid`[, .]/)
  assert.match(skill, /`DataGridContainer`/)
  assert.match(primary, /\| data-grid \| `DataGridContainer` \|/)
  const docsModule = /```tsx verify\n([\s\S]*?)\n```/.exec(local)?.[1]
  const skillModule = /```tsx\n([\s\S]*?)\n```/.exec(skill)?.[1]
  assert.ok(docsModule)
  assert.equal(docsModule, skillModule)
  assert.match(docsModule, /ComponentProps<typeof DataGridContainer>/)
  assert.match(docsModule, /<DataGridContainer \{\.\.\.props\} glass \/>/)
  assert.doesNotMatch(docsModule, /<DataGrid /)
})

test("shared skill note states a concrete behavior and origin before its guide link", () => {
  const shared = { ...record, id: "glass", origin: "adapted", families: ["button"], guides: [{ docs: "components/button", skill: "button" }, { docs: "exui/glass", skill: "exui/glass.md" }] }
  const fragments = new Map([["en/glass", "### Glass behavior\n\nThe glass prop opts in one surface. Popup glass is independent.\n\n```tsx verify\nimport { Button } from \"@exre/exui\"\nexport const Example = Button\n```"]])
  const note = skillOverlay("button", [shared], fragments)
  assert.match(note, /ExUI adaptation/)
  assert.match(note, /glass prop opts in one surface/)
  assert.match(note, /\.\.\/exui\/glass\.md/)
  assert.doesNotMatch(note, /```tsx/)
})

test("removing a capability strips its stale generated block", () => {
  const source = "# Button\n\nHuman guidance.\n\n## When to use\n\nHuman behavior.\n"
  const generated = renderBounded(source, "Old capability claim.", "skill")
  assert.equal(removeBounded(generated, "skill"), source)
  assert.throws(() => removeBounded(generated.replace("<!-- exui-capabilities:end:skill -->", ""), "skill"), /malformed.*boundar/i)
})

test("authored fragments cannot carry context-specific relative links", () => {
  assert.equal(validateFragment("# Note\n\n[Upstream](https://example.com)", "note.md"), "# Note\n\n[Upstream](https://example.com)")
  for (const link of ["../exui/glass.md", "components/button", "#usage", "/en/docs/components/button/"]) {
    assert.throws(() => validateFragment(`[Note](${link})`, "note.md"), /relative link/i)
  }
})
