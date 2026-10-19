import test from "node:test"
import assert from "node:assert/strict"
import { cp, mkdtemp, mkdir, readFile, realpath, rm, unlink, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, isAbsolute, join, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"
import { docPath, examplePath, normalizeBase, overviewPath, preferenceKeys, resolveLegacyHash, searchPath } from "../../lib/site-contract.mjs"
import { loadPages, writeContentManifest } from "../../../../scripts/docs-content.mjs"
import { createFamilySnippet, extractVerifiedModules, validateFamilySnippet } from "../../../../scripts/docs-snippets.mjs"
import { remarkContentLinks, rewriteContentLink } from "../../lib/content-links.mjs"

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..")

test("authored content links resolve from source files to public locale routes", () => {
  for (const base of ["/", "/exui/"]) {
    for (const locale of ["en", "zh-CN"]) {
      const source = `${locale}/components/button.mdx`
      assert.equal(rewriteContentLink("../tokens/density.mdx", source, base), `${base}${locale}/docs/tokens/density/`)
      assert.equal(rewriteContentLink("../tokens/colors.mdx#palette", source, base), `${base}${locale}/docs/tokens/colors/#palette`)
      assert.equal(rewriteContentLink("./badge.mdx", source, base), `${base}${locale}/docs/components/badge/`)
      assert.equal(rewriteContentLink("../tokens/density", source, base), `${base}${locale}/docs/tokens/density/`)
      assert.equal(rewriteContentLink("/en/docs/tokens/colors/", source, base), `${base}en/docs/tokens/colors/`)
      assert.equal(rewriteContentLink("../../../../examples/c-button-1/", source, base), `${base}examples/c-button-1/`)
      for (const href of ["#local", "https://example.com/guide.mdx", "mailto:docs@example.com", `${base}${locale}/docs/tokens/colors/`]) {
        assert.equal(rewriteContentLink(href, source, base), href)
      }
    }
  }
})

test("the MDX link transform covers nested and reference links without changing code or images", () => {
  const tree = { type: "root", children: [
    { type: "paragraph", children: [{ type: "link", url: "../tokens/density.mdx" }] },
    { type: "definition", url: "./badge.mdx#variants" },
    { type: "code", value: "[Density](../tokens/density.mdx)" },
    { type: "image", url: "./badge.mdx" },
  ] }
  remarkContentLinks({ base: "/exui/" })(tree, { path: "D:\\repo\\packages\\docs\\content\\zh-CN\\components\\button.mdx" })
  assert.equal(tree.children[0].children[0].url, "/exui/zh-CN/docs/tokens/density/")
  assert.equal(tree.children[1].url, "/exui/zh-CN/docs/components/badge/#variants")
  assert.equal(tree.children[2].value, "[Density](../tokens/density.mdx)")
  assert.equal(tree.children[3].url, "./badge.mdx")
})

test("category overviews preserve existing URLs and validate their group", async () => {
  const { overviewPath } = await import("../../lib/site-contract.mjs")
  assert.equal(overviewPath("zh-CN", "/", "exui"), "/zh-CN/docs/exui/")
  assert.equal(overviewPath("en", "/exui/", "components"), "/exui/en/docs/components/")
  assert.throws(() => overviewPath("en", "/", "unknown"), TypeError)
})

test("base and URL helpers validate paths and never double-prefix", () => {
  assert.equal(normalizeBase("/"), "/")
  assert.equal(normalizeBase("/exui"), "/exui/")
  assert.equal(docPath("zh-CN", "components/button", "/exui/"), "/exui/zh-CN/docs/components/button/")
  assert.equal(examplePath("c-button-1", "/exui"), "/exui/examples/c-button-1/")
  assert.equal(searchPath("en", "/exui/"), "/exui/search/en/index.json")
  assert.equal(overviewPath("en"), "/en/docs/")
  assert.equal(overviewPath("zh-CN", "/exui"), "/exui/zh-CN/docs/")
  assert.throws(() => overviewPath("fr"), TypeError)
  for (const bad of ["exui", "//host/", "https://host/", "/exui/../", "/exui/./", "/exui\\", "/exui?q", "/exui#hash", "/exui%2f/"]) {
    assert.throws(() => normalizeBase(bad), TypeError, bad)
  }
  for (const bad of ["components/../button", "components/button/extra", "components/Button", "unknown/button", "components/%2f"]) {
    assert.throws(() => docPath("en", bad), TypeError, bad)
  }
  assert.throws(() => docPath("fr", "components/button"), TypeError)
  assert.throws(() => examplePath("../button"), TypeError)
  assert.deepEqual(preferenceKeys, { theme: "exui-docs-theme", density: "exui-docs-density", language: "exui-docs-language" })
})

test("legacy hash resolves known families and preserves a valid example", () => {
  const catalog = [{ group: "components", id: "button" }, { group: "exui", id: "glass" }]
  assert.equal(resolveLegacyHash("#/components/button?example=c-button-1", "zh-CN", catalog, "/exui/"), "/exui/zh-CN/docs/components/button/?example=c-button-1")
  assert.equal(resolveLegacyHash("#/exui/glass", "en", catalog), "/en/docs/exui/glass/")
  assert.equal(resolveLegacyHash("#/components/", "en", catalog), "/en/docs/")
  for (const hash of ["#/", "#/components", "#/components/"]) {
    assert.equal(resolveLegacyHash(hash, "zh-CN", catalog, "/exui/"), "/exui/zh-CN/docs/")
  }
  assert.equal(resolveLegacyHash("#/components/button?example=../bad", "en", catalog), "/en/docs/components/button/")
  assert.equal(resolveLegacyHash("#/components/unknown", "en", catalog), null)
  assert.equal(resolveLegacyHash("#/components/button/../../", "en", catalog), null)
})

test("current bilingual content covers 88 families and eleven guides", async () => {
  const pages = await loadPages()
  assert.equal(pages.length, 198)
  assert.equal(pages.filter((page) => page.locale === "zh-CN" && page.exampleFamily).length, 88)
  assert.equal(pages.filter((page) => page.locale === "en" && !page.exampleFamily).length, 11)
  for (const locale of ["en", "zh-CN"]) {
    assert.ok(pages.some(page => page.locale === locale && page.id === "getting-started/ex-message-migration"))
    assert.ok(!pages.some(page => page.locale === locale && page.id === "exui/ex-message"))
  }
  const output = await writeContentManifest()
  const manifest = JSON.parse(await readFile(output, "utf8"))
  assert.equal(manifest.schemaVersion, 1)
  assert.deepEqual(manifest.pages, pages)
  assert.ok(manifest.pages.every((page) => !isAbsolute(page.contentPath)))
})

test("content rejects missing translation, invalid family, links and anchors", async () => {
  const root = await mkdtemp(join(tmpdir(), "exui-docs-content-"))
  const target = join(root, "packages/docs")
  await mkdir(join(target, "src/showcase"), { recursive: true })
  await cp(join(repoRoot, "packages/docs/content"), join(target, "content"), { recursive: true })
  await cp(join(repoRoot, "packages/docs/src/showcase/catalog.ts"), join(target, "src/showcase/catalog.ts"))
  const button = join(target, "content/en/components/button.mdx")
  const original = await readFile(button, "utf8")
  try {
    await writeFile(button, original.replace("exampleFamily: button", "exampleFamily: badge"))
    await assert.rejects(() => loadPages(root), /invalid exampleFamily/)
    await writeFile(button, original.replace("## Basic usage", "[Broken](../tokens/missing.mdx)\n\n## Basic usage"))
    await assert.rejects(() => loadPages(root), /link target missing/)
    await writeFile(button, original.replace("## Basic usage", "[Broken](#missing-anchor)\n\n## Basic usage"))
    await assert.rejects(() => loadPages(root), /anchor missing/)
    await writeFile(button, original.replace("id: components/button", "id: components/other"))
    await assert.rejects(() => loadPages(root), /id must equal/)
    await writeFile(button, original.replace("title: Button", "title: Button\ntitle: Duplicate"))
    await assert.rejects(() => loadPages(root), /duplicate|unique/i)
    await writeFile(button, "")
    await assert.rejects(() => loadPages(root), /frontmatter or body is missing/)
    await unlink(button)
    await assert.rejects(() => loadPages(root), /content coverage mismatch/)
  } finally {
    const canonical = await realpath(root)
    const canonicalTmp = await realpath(tmpdir())
    if (!canonical.startsWith(`${canonicalTmp}${sep}`) || !canonical.includes("exui-docs-content-")) throw new Error("Refusing to remove an unexpected fixture path")
    await rm(canonical, { recursive: true, force: true })
  }
})

test("verify fences require complete modules and public imports", () => {
  assert.equal(extractVerifiedModules("```tsx verify\nimport { Button } from '@exre/exui'\nexport const Demo = () => <Button />\n```", "sample.mdx").length, 1)
  assert.throws(() => extractVerifiedModules("```tsx verify\n<Button />\n```", "sample.mdx"), /complete/)
  assert.throws(() => extractVerifiedModules("```ts verify\nimport x from '@exre/exui/src/private'\nexport { x }\n```", "sample.mdx"), /unsupported import/)
})

test("a family page must show its current public source excerpt and complete-source link", () => {
  const page = { group: "components", exampleFamily: "button", contentPath: "components/button.mdx" }
  const document = { entry: "button.tsx", files: new Map([["button.tsx", 'import { Button } from "@exre/exui"\nexport function Example() { return <Button type="button">Go</Button> }']]) }
  const snippet = createFamilySnippet(document, "button")
  const content = `\`\`\`tsx source="c-button-1"\n${snippet}\n\`\`\`\n\n[Source](../../../../examples/c-button-1/)`
  assert.equal(validateFamilySnippet(page, content, document), "c-button-1")
  assert.throws(() => validateFamilySnippet(page, content.replace("source=\"c-button-1\"", "source=\"c-button-2\""), document), /source-linked/)
  assert.throws(() => validateFamilySnippet(page, content.replace("Go", "Changed"), document), /differs/)
  assert.throws(() => validateFamilySnippet(page, content.replace("[Source]", "Source"), document), /link is missing/)
})

test("canonical catalog preserves loader groups and presentation", async () => {
 const { loadCatalog } = await import("../../../../scripts/docs-examples.mjs")
 const { navigationGroup } = await import("../../lib/site-contract.mjs")
 const catalog = await loadCatalog()
 assert.equal(catalog.length, 88)
 assert.equal(catalog.filter(page => navigationGroup(page) === "components").length, 87)
 assert.equal(catalog.filter(page => navigationGroup(page) === "exui").length, 1)
 assert.equal(catalog.find(page => page.id === "form").group, "exui")
 assert.ok(!catalog.some(page => ["ex-form", "ex-item"].includes(page.id)))
})
