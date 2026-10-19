import { readFile, readdir, mkdir, writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { dirname, join, posix, relative, resolve, sep } from "node:path"
import { createRequire } from "node:module"

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const requireDocs = createRequire(join(repoRoot, "packages/docs/package.json"))
const { parseDocument } = requireDocs("yaml")
const groups = new Set(["getting-started", "components", "exui", "tokens"])
const guideIds = [
  "getting-started/installation", "getting-started/quick-start", "getting-started/skills", "getting-started/styles", "getting-started/ex-message-migration",
  "tokens/usage", "tokens/customization", "tokens/themes", "tokens/density", "tokens/scaling", "tokens/fumadocs",
]
const locales = ["zh-CN", "en"]
const pathPattern = /^(getting-started|components|exui|tokens)\/([a-z0-9]+(?:-[a-z0-9]+)*)\.mdx$/
const linkPattern = /(?<!!)\[[^\]]+\]\(([^)]+)\)/g

async function contentFiles(dir, prefix = "") {
  const entries = await readdir(dir, { withFileTypes: true })
  const result = []
  for (const entry of entries) {
    if (entry.isSymbolicLink()) throw new Error(`Content symlink is forbidden: ${join(dir, entry.name)}`)
    if (entry.isDirectory()) result.push(...await contentFiles(join(dir, entry.name), `${prefix}${entry.name}/`))
    else if (entry.isFile()) {
      if (!entry.name.endsWith(".mdx")) throw new Error(`Unexpected content file: ${join(dir, entry.name)}`)
      result.push(`${prefix}${entry.name}`)
    }
  }
  return result.sort()
}

function parseFrontmatter(source, path) {
  const normalized = source.replace(/\r\n?/g, "\n")
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(normalized)
  if (!match || !match[2].trim()) throw new Error(`${path}: frontmatter or body is missing`)
  const document = parseDocument(match[1], { uniqueKeys: true, strict: true })
  if (document.errors.length) throw new Error(`${path}: ${document.errors[0].message}`)
  const data = document.toJS()
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error(`${path}: frontmatter must be a mapping`)
  const allowed = new Set(["id", "title", "description", "exampleFamily", "full"])
  for (const key of Object.keys(data)) if (!allowed.has(key)) throw new Error(`${path}: unknown frontmatter key ${key}`)
  for (const key of ["id", "title", "description"]) {
    if (typeof data[key] !== "string" || !data[key].trim()) throw new Error(`${path}: ${key} must be nonempty text`)
  }
  if (data.full !== undefined && typeof data.full !== "boolean") throw new Error(`${path}: full must be boolean`)
  return { data, body: match[2] }
}

function catalogFamilies(source) {
  const families = []
  const re = /module:\s*"([^"]+)",\s*ids:\s*\[([^\]]+)\]/g
  for (const match of source.matchAll(re)) {
    for (const id of match[2].matchAll(/"([a-z0-9-]+)"/g)) families.push(`${match[1] === "exui" ? "exui" : "components"}/${id[1]}`)
  }
  if (!families.length || new Set(families).size !== families.length) throw new Error("Could not load unique family inventory")
  return new Set(families)
}

function headingAnchors(body) {
  const anchors = new Set()
  const counts = new Map()
  for (const line of body.split("\n")) {
    const match = /^#{1,6}\s+(.+?)\s*#*\s*$/.exec(line)
    if (!match) continue
    const base = match[1].replace(/<[^>]+>/g, "").toLocaleLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s+/g, "-")
    if (!base) continue
    const count = counts.get(base) ?? 0
    anchors.add(count ? `${base}-${count}` : base)
    counts.set(base, count + 1)
  }
  return anchors
}

function validateLinks(records) {
  const pages = new Map(records.map(({ page, body }) => [`${page.locale}/${page.id}`, { page, body, anchors: headingAnchors(body) }]))
  for (const { page, body } of records) {
    for (const match of body.matchAll(linkPattern)) {
      const href = match[1].trim().split(/\s+"/, 1)[0]
      if (/^(?:https?:|mailto:)/.test(href)) continue
      if (href.startsWith("//") || href.includes("\\") || href.includes("?")) throw new Error(`${page.contentPath}: invalid link ${href}`)
      const [targetPath, anchor] = href.split("#", 2)
      if (targetPath.startsWith("../../../../examples/")) {
        const destination = new URL(targetPath, `https://docs.invalid/${page.locale}/docs/${page.id}/`).pathname
        if (anchor || !/^\/examples\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/.test(destination)) throw new Error(`${page.contentPath}: invalid example link ${href}`)
        continue
      }
      let targetId = page.id
      let targetLocale = page.locale
      if (targetPath) {
        if (targetPath.startsWith("/")) {
          const absolute = /^\/(zh-CN|en)\/docs\/(getting-started|components|exui|tokens)\/([a-z0-9-]+)\/?$/.exec(targetPath)
          if (!absolute) throw new Error(`${page.contentPath}: invalid internal link ${href}`)
          targetLocale = absolute[1]
          targetId = `${absolute[2]}/${absolute[3]}`
        } else {
          const resolved = posix.normalize(posix.join(posix.dirname(page.id), targetPath)).replace(/\.mdx$/, "")
          if (!/^(?:getting-started|components|exui|tokens)\/[a-z0-9-]+$/.test(resolved)) throw new Error(`${page.contentPath}: invalid relative link ${href}`)
          targetId = resolved
        }
      }
      const target = pages.get(`${targetLocale}/${targetId}`)
      if (!target) throw new Error(`${page.contentPath}: link target missing: ${href}`)
      if (anchor && !target.anchors.has(decodeURIComponent(anchor))) throw new Error(`${page.contentPath}: anchor missing: ${href}`)
    }
  }
}

export async function loadPages(root = repoRoot) {
  const docsRoot = join(root, "packages/docs")
  const families = catalogFamilies(await readFile(join(docsRoot, "src/showcase/catalog.ts"), "utf8"))
  const records = []
  for (const locale of locales) {
    const contentRoot = join(docsRoot, "content", locale)
    for (const contentPath of await contentFiles(contentRoot)) {
      const match = pathPattern.exec(contentPath)
      if (!match || !groups.has(match[1])) throw new Error(`Invalid content path: ${locale}/${contentPath}`)
      const absolutePath = join(contentRoot, contentPath)
      if (relative(contentRoot, absolutePath).startsWith(`..${sep}`)) throw new Error(`Content path escapes root: ${contentPath}`)
      const { data, body } = parseFrontmatter(await readFile(absolutePath, "utf8"), `${locale}/${contentPath}`)
      const id = `${match[1]}/${match[2]}`
      if (data.id !== id) throw new Error(`${locale}/${contentPath}: id must equal ${id}`)
      const family = match[1] === "components" || match[1] === "exui"
      if (family && (data.exampleFamily !== match[2] || !families.has(id))) throw new Error(`${locale}/${contentPath}: invalid exampleFamily`)
      if (!family && data.exampleFamily !== undefined) throw new Error(`${locale}/${contentPath}: guide cannot declare exampleFamily`)
      records.push({
        page: { id, locale, group: match[1], title: data.title.trim(), description: data.description.trim(), slug: [match[1], match[2]], contentPath, ...(family ? { exampleFamily: data.exampleFamily } : {}), full: data.full ?? false },
        body,
      })
    }
  }
  const expected = new Set([...families, ...guideIds])
  for (const locale of locales) {
    const actual = records.filter(({ page }) => page.locale === locale).map(({ page }) => page.id)
    if (new Set(actual).size !== actual.length) throw new Error(`${locale}: duplicate content ID`)
    const missing = [...expected].filter((id) => !actual.includes(id))
    const extra = actual.filter((id) => !expected.has(id))
    if (missing.length || extra.length) throw new Error(`${locale}: content coverage mismatch; missing: ${missing.join(", ")}; extra: ${extra.join(", ")}`)
  }
  validateLinks(records)
  return records.map(({ page }) => page).sort((a, b) => a.locale.localeCompare(b.locale) || a.id.localeCompare(b.id))
}

export async function writeContentManifest(root = repoRoot) {
  const outputPath = join(root, "packages/docs/.generated/pages.json")
  const pages = await loadPages(root)
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify({ schemaVersion: 1, pages }, null, 2)}\n`, "utf8")
  return outputPath
}

async function main() {
  const mode = process.argv[2] ?? "check"
  if (!["check", "generate"].includes(mode)) throw new Error("Usage: node scripts/docs-content.mjs [check|generate]")
  const pages = await loadPages()
  if (mode === "generate") console.log(await writeContentManifest())
  console.log(`Validated ${pages.length} pages (${pages.length / 2} per locale)`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((error) => { console.error(error); process.exitCode = 1 })
