import { createHash } from "node:crypto"
import { readFile, readdir, writeFile, lstat } from "node:fs/promises"
import { createRequire } from "node:module"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { loadPages } from "./docs-content.mjs"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const requireDocs = createRequire(path.join(repoRoot, "packages/docs/package.json"))
const ts = requireDocs("typescript")
const posix = (value) => value.replaceAll("\\", "/")
const normalize = (value) => value.replace(/\r\n?/g, "\n")
const sha = (value) => createHash("sha256").update(normalize(value)).digest("hex")
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const pagePattern = /^(?:components|exui|tokens|getting-started)\/[a-z0-9]+(?:-[a-z0-9]+)*$/
const sourcePattern = /^packages\/(?:components\/(?:src\/(?:[a-z0-9-]+\/)*[a-z0-9.-]+\.(?:ts|tsx|css)|upstream\/reui\/public-exports\.json)|tokens\/src\/(?:[a-z0-9-]+\/)*[a-z0-9.-]+\.(?:ts|tsx|css))$/
const begin = (kind) => kind === "docs" ? "{/* exui-capabilities:begin:docs */}" : `<!-- exui-capabilities:begin:${kind} -->`
const end = (kind) => kind === "docs" ? "{/* exui-capabilities:end:docs */}" : `<!-- exui-capabilities:end:${kind} -->`
const legacyDocsBegin = "<!-- exui-capabilities:begin:docs -->"
const legacyDocsEnd = "<!-- exui-capabilities:end:docs -->"

function boundedRange(text, kind) {
  const variants = kind === "docs" ? [[begin(kind), end(kind)], [legacyDocsBegin, legacyDocsEnd]] : [[begin(kind), end(kind)]]
  const starts = variants.flatMap(([start], variant) => [...text.matchAll(new RegExp(start.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"))].map((match) => ({ index: match.index, variant, marker: start })))
  const stops = variants.flatMap(([, stop], variant) => [...text.matchAll(new RegExp(stop.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"))].map((match) => ({ index: match.index, variant, marker: stop })))
  if (starts.length !== stops.length || starts.length > 1 || (starts.length === 1 && (starts[0].variant !== stops[0].variant || starts[0].index > stops[0].index))) throw new Error(`Malformed ${kind} generated boundaries`)
  return starts.length ? { start: starts[0].index, stop: stops[0].index + stops[0].marker.length } : null
}

function uniqueStrings(value, name, pattern, allowEmpty = false) {
  if (!Array.isArray(value) || (!allowEmpty && !value.length)) throw new Error(`${name}: nonempty array required`)
  const seen = new Set()
  for (const item of value) {
    if (typeof item !== "string" || !pattern.test(item)) throw new Error(`Invalid ${name}: ${item}`)
    if (seen.has(item)) throw new Error(`Duplicate ${name}: ${item}`)
    seen.add(item)
  }
}

export function validateRegistry(registry, inventory) {
  if (registry?.schemaVersion !== 1 || !Array.isArray(registry.capabilities) || !registry.capabilities.length) throw new Error("Invalid capabilities registry schema")
  const pages = new Set(inventory.pages.map((page) => page.id))
  const examples = new Map(inventory.examples.map((example) => [example.id, example]))
  const symbols = new Set(inventory.symbols)
  const sources = new Set(inventory.sources)
  const skillFiles = new Set(inventory.skillFiles)
  const ids = new Set()
  if (registry.exportExclusions !== undefined) {
    if (!registry.exportExclusions || typeof registry.exportExclusions !== "object" || Array.isArray(registry.exportExclusions)) throw new Error("Invalid export exclusions")
    for (const [name, rationale] of Object.entries(registry.exportExclusions)) {
      if (!symbols.has(name)) throw new Error(`Unknown excluded public export ${name}`)
      if (typeof rationale !== "string" || rationale.trim().length < 20) throw new Error(`Export exclusion ${name} requires a concrete rationale`)
    }
  }
  for (const item of registry.capabilities) {
    if (!idPattern.test(item.id ?? "")) throw new Error(`Invalid capability id: ${item.id}`)
    if (ids.has(item.id)) throw new Error(`Duplicate capability: ${item.id}`)
    ids.add(item.id)
    if (!["native", "adapted", "mixed"].includes(item.origin)) throw new Error(`${item.id}: invalid origin`)
    uniqueStrings(item.pages, `${item.id} page`, pagePattern)
    uniqueStrings(item.families, `${item.id} family`, idPattern, true)
    uniqueStrings(item.symbols, `${item.id} symbol`, /^[A-Za-z_$][\w$]*$/)
    uniqueStrings(item.examples, `${item.id} example`, idPattern, true)
    uniqueStrings(item.sources, `${item.id} source`, sourcePattern)
    if (!Array.isArray(item.guides) || !item.guides.length) throw new Error(`${item.id}: guides required`)
    for (const page of item.pages) if (!pages.has(page)) throw new Error(`${item.id}: missing docs page ${page}`)
    for (const family of item.families) if (!skillFiles.has(family)) throw new Error(`${item.id}: missing skill family ${family}`)
    for (const symbol of item.symbols) if (!symbols.has(symbol)) throw new Error(`${item.id}: Unknown public symbol ${symbol}`)
    if (item.surfaces !== undefined) {
      if (!item.surfaces || typeof item.surfaces !== "object" || Array.isArray(item.surfaces)) throw new Error(`${item.id}: invalid surfaces map`)
      for (const [family, names] of Object.entries(item.surfaces)) {
        if (!item.families.includes(family)) throw new Error(`${item.id}: surface family ${family} is not listed`)
        uniqueStrings(names, `${item.id} ${family} surface`, /^[A-Za-z_$][\w$]*$/)
        for (const name of names) if (!symbols.has(name)) throw new Error(`${item.id}: unknown public surface ${name}`)
      }
      for (const family of item.families) if (!Object.hasOwn(item.surfaces, family)) throw new Error(`${item.id}: missing surface family ${family}`)
    }
    for (const source of item.sources) if (!sources.has(source)) throw new Error(`${item.id}: missing component source ${source}`)
    for (const exampleId of item.examples) {
      const example = examples.get(exampleId)
      if (!example) throw new Error(`${item.id}: missing share example ${exampleId}`)
      if (!item.pages.includes(`${example.page.group}/${example.page.id}`)) throw new Error(`${item.id}: example ${exampleId} belongs to an unlisted page`)
    }
    const guidedPages = new Set()
    const guidedFamilies = new Set()
    for (const guide of item.guides) {
      if (!guide || typeof guide !== "object" || !item.pages.includes(guide.docs)) throw new Error(`${item.id}: invalid guide docs page ${guide?.docs}`)
      if (typeof guide.skill !== "string" || !(item.families.includes(guide.skill) || /^exui\/[a-z0-9-]+\.md$/.test(guide.skill)) || !skillFiles.has(guide.skill)) throw new Error(`${item.id}: missing skill guide ${guide.skill}`)
      for (const label of ["en", "zh-CN"]) if (guide[label] !== undefined && (typeof guide[label] !== "string" || !guide[label].trim())) throw new Error(`${item.id}: invalid ${label} label`)
      guidedPages.add(guide.docs)
      if (item.families.includes(guide.skill)) guidedFamilies.add(guide.skill)
    }
    for (const page of item.pages) if (!guidedPages.has(page)) throw new Error(`${item.id}: page ${page} has no guide`)
    for (const family of item.families) if (!guidedFamilies.has(family)) throw new Error(`${item.id}: family ${family} has no guide`)
  }
  return registry.capabilities
}

export function renderBounded(source, content, kind) {
  const text = normalize(source)
  const range = boundedRange(text, kind)
  const block = `${begin(kind)}\n${content.trim()}\n${end(kind)}`
  if (range) return text.slice(0, range.start) + block + text.slice(range.stop)
  if (kind === "docs") {
    const match = /^---\n[\s\S]*?\n---\n/.exec(text)
    if (!match) throw new Error("Docs page lacks frontmatter")
    const next = text.indexOf("\n## ", match[0].length)
    if (next < 0) throw new Error("Docs page lacks insertion heading")
    return `${text.slice(0, next).trimEnd()}\n\n${block}\n${text.slice(next)}`
  }
  const next = text.indexOf("\n## ")
  if (next < 0) throw new Error("Skill page lacks insertion heading")
  return `${text.slice(0, next).trimEnd()}\n\n${block}\n${text.slice(next)}`
}

export function removeBounded(source, kind) {
  const text = normalize(source)
  const range = boundedRange(text, kind)
  if (!range) return text
  const before = text.slice(0, range.start).trimEnd()
  const after = text.slice(range.stop).trimStart()
  return `${before}\n\n${after}`
}

async function walkFiles(directory) {
  const result = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) throw new Error(`Symlink in reviewed source: ${entry.name}`)
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) result.push(...await walkFiles(file))
    else if (entry.isFile() && /\.(?:ts|tsx|css)$/.test(entry.name)) result.push(file)
  }
  return result.sort()
}

async function sourceInventory(root) {
  const files = await walkFiles(path.join(root, "packages/components/src"))
  const relative = files.map((file) => posix(path.relative(root, file)))
  const hashes = Object.fromEntries(await Promise.all(files.map(async (file, index) => [relative[index], sha(await readFile(file, "utf8"))])))
  const entry = path.join(root, "packages/components/src/index.ts")
  const program = ts.createProgram([entry], { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler, jsx: ts.JsxEmit.ReactJSX, skipLibCheck: true, noEmit: true, allowArbitraryExtensions: true })
  const checker = program.getTypeChecker()
  const module = checker.getSymbolAtLocation(program.getSourceFile(entry))
  if (!module) throw new Error("Cannot resolve public component root exports")
  const exports = checker.getExportsOfModule(module).map((symbol) => symbol.name).sort()
  if (!exports.length) throw new Error("No public component exports found")
  return { schemaVersion: 1, files: hashes, exports }
}

export function sourceReviewDiff(accepted, current) {
  if (accepted?.schemaVersion !== 1 || !accepted.files || !Array.isArray(accepted.exports)) return ["source review missing or invalid"]
  const differences = []
  for (const name of new Set([...Object.keys(accepted.files), ...Object.keys(current.files)])) if (accepted.files[name] !== current.files[name]) differences.push(`source ${name}`)
  if (accepted.exports.join("\0") !== current.exports.join("\0")) differences.push("public exports")
  return differences
}

function exportCovered(name, registry) {
  if (registry.capabilities.some((item) => item.symbols.includes(name) || Object.values(item.surfaces ?? {}).some((names) => names.includes(name)))) return true
  const rationale = registry.exportExclusions?.[name]
  return typeof rationale === "string" && rationale.trim().length >= 20
}

export function sourceReviewCoverageDiff(accepted, registry, liveExports = accepted?.exports ?? []) {
  if (!Array.isArray(accepted?.reviewedExports) || accepted.reviewedExports.some((name) => typeof name !== "string")) return ["source review missing or invalid reviewedExports; explicitly reaccept the audited baseline"]
  const live = new Set(liveExports)
  return accepted.reviewedExports.filter((name) => live.has(name) && !exportCovered(name, registry)).map((name) => `reviewed public export lost capability mapping: ${name}`)
}

export async function acceptSourceReview(reviewPath, current, registry, { bootstrap = false } = {}) {
  let previous
  try { previous = JSON.parse(await readFile(reviewPath, "utf8")) }
  catch (error) {
    if (error.code !== "ENOENT") throw error
    previous = null
  }
  if (!previous && !bootstrap) throw new Error("Source review snapshot is missing; an initial audited baseline requires --bootstrap-source-review")
  if (previous && bootstrap) throw new Error("Source review snapshot already exists; use --accept-source-review for reviewed changes")
  const previousCoverage = previous?.reviewedExports === undefined ? [] : sourceReviewCoverageDiff(previous, registry, current.exports)
  if (previous && (previous.schemaVersion !== 1 || !Array.isArray(previous.exports) || !previous.files || previousCoverage.length)) throw new Error(`Previous source review or capability mapping is invalid: ${previousCoverage.join(", ")}`)
  const newExports = current.exports.filter((name) => !previous?.exports.includes(name))
  const missing = newExports.filter((name) => !exportCovered(name, registry))
  if (previous && missing.length) throw new Error(`New public exports lack capability mapping or concrete reviewed exclusion: ${missing.join(", ")}`)
  const live = new Set(current.exports)
  const reviewedExports = [...new Set([...(previous?.reviewedExports ?? []), ...current.exports.filter((name) => exportCovered(name, registry))])].filter((name) => live.has(name)).sort()
  await writeFile(reviewPath, `${JSON.stringify({ ...current, reviewedExports }, null, 2)}\n`, "utf8")
}

export function validateFragment(source, filename) {
  const markdown = normalize(source).trim()
  if (!markdown || /^---\n/.test(markdown)) throw new Error(`${filename}: empty or frontmatter capability fragment`)
  for (const match of markdown.matchAll(/(?<!!)\[[^\]]+\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    if (!/^(?:https?:\/\/|mailto:)/.test(match[1])) throw new Error(`${filename}: relative link ${match[1]} is unsupported`)
  }
  return markdown
}

async function loadInputs(root) {
  const base = path.join(root, "packages/docs/exui")
  const registry = JSON.parse(await readFile(path.join(base, "capabilities.json"), "utf8"))
  const pages = await loadPages(root)
  const { loadShareExamples } = await import("./docs-sharing.mjs")
  const examples = await loadShareExamples(root)
  const current = await sourceInventory(root)
  const extraSources = [...new Set(registry.capabilities.flatMap((item) => item.sources ?? []))].filter((source) => !Object.hasOwn(current.files, source))
  for (const source of extraSources) {
    if (!sourcePattern.test(source)) throw new Error(`Invalid capability source: ${source}`)
    const metadata = await lstat(path.join(root, source)).catch(() => null)
    if (!metadata?.isFile() || metadata.isSymbolicLink()) throw new Error(`Missing or invalid capability source: ${source}`)
    current.files[source] = sha(await readFile(path.join(root, source), "utf8"))
  }
  const skillDirectory = path.join(root, "skills/exui/references")
  const componentFiles = await readdir(path.join(skillDirectory, "components"))
  const nativeFiles = await readdir(path.join(skillDirectory, "exui"))
  const skillFiles = [...componentFiles.filter((file) => file.endsWith(".md")).map((file) => file.slice(0, -3)), ...nativeFiles.filter((file) => file.endsWith(".md")).map((file) => `exui/${file}`)]
  const capabilities = validateRegistry(registry, { pages, examples, symbols: current.exports, sources: Object.keys(current.files), skillFiles })
  const fragments = new Map()
  for (const capability of capabilities) for (const locale of ["en", "zh-CN"]) {
    const filename = path.join(base, locale, `${capability.id}.md`)
    const markdown = await readFile(filename, "utf8")
    fragments.set(`${locale}/${capability.id}`, validateFragment(markdown, filename))
  }
  return { pages, registry, capabilities, fragments, examples, current, skillFamilies: componentFiles.filter((file) => file.endsWith(".md")).map((file) => file.slice(0, -3)) }
}

function fragmentTitle(fragment, id) {
  return /^#{1,4}\s+(.+)$/m.exec(fragment)?.[1] ?? id.replaceAll("-", " ")
}

function originLabel(origin, locale) {
  if (locale === "zh-CN") return origin === "native" ? "ExUI 新增" : origin === "mixed" ? "ExUI 新增与适配" : "ExUI 适配"
  return origin === "native" ? "ExUI addition" : origin === "mixed" ? "ExUI additions and adaptations" : "ExUI adaptation"
}

function firstProse(fragment) {
  const paragraphs = fragment.replace(/^#{1,4}\s+[^\n]+\n/, "").trim().split(/\n\s*\n/)
  const paragraph = paragraphs.find((value) => value && !value.startsWith("```") && !value.startsWith("#")) ?? ""
  return paragraph.split(/(?<=[.!?。！？])\s+/).slice(0, 2).join(" ").trim()
}

function localSurfaceLine(item, family, locale) {
  const names = item.surfaces?.[family]
  if (!names) return null
  return `${locale === "zh-CN" ? "本家族支持 Glass 的公开组件" : "Glass surfaces in this family"}: ${names.map((name) => `\`${name}\``).join(", ")}${locale === "zh-CN" ? "。" : "."}`
}

function localSurfaceExample(item, family) {
  const name = item.surfaces?.[family]?.[0]
  if (!name) return null
  return `import type { ComponentProps } from "react"\nimport { ${name} } from "@exre/exui"\n\nexport function GlassExample(props: ComponentProps<typeof ${name}>) {\n  return <${name} {...props} glass />\n}`
}

function surfaceTable(item, locale) {
  if (!item.surfaces) return null
  const lines = [locale === "zh-CN" ? "#### 各组件家族的 Glass 表面" : "#### Glass surfaces by component family", "", locale === "zh-CN" ? "| 家族 | 支持 Glass 的公开组件 |" : "| Family | Glass surfaces |", "| --- | --- |"]
  for (const family of item.families) lines.push(`| ${family} | ${item.surfaces[family].map((name) => `\`${name}\``).join(", ")} |`)
  return lines.join("\n")
}

export function docsContent(page, capabilities, fragments, examples = []) {
  const matches = capabilities.filter((item) => item.pages.includes(page.id))
  if (!matches.length) return null
  const lines = [page.locale === "en" ? "## ExUI capabilities" : "## ExUI 能力", ""]
  const byExample = new Map(examples.map((example) => [example.id, `${example.page.group}/${example.page.id}`]))
  for (const item of matches) {
    const fragment = fragments.get(`${page.locale}/${item.id}`)
    lines.push(`**${originLabel(item.origin, page.locale)}**`, "")
    if (item.pages[0] === page.id || item.pages.length === 1) {
      lines.push(fragment, "")
      const table = surfaceTable(item, page.locale)
      if (table) lines.push(table, "")
    }
    else {
      let target = path.posix.relative(path.posix.dirname(page.id), item.pages[0]) + ".mdx"
      if (!target.startsWith(".")) target = `./${target}`
      const title = fragmentTitle(fragment, item.id)
      lines.push(`### ${title}`, "", firstProse(fragment), "")
      const localSurface = localSurfaceLine(item, page.id.startsWith("components/") ? page.id.slice("components/".length) : "", page.locale)
      if (localSurface) lines.push(localSurface, "")
      const example = localSurfaceExample(item, page.id.startsWith("components/") ? page.id.slice("components/".length) : "")
      if (example) lines.push(page.locale === "en" ? "Keep this surface in its usual family composition; the wrapper opts that surface into Glass." : "请将此表面保留在常规的组件组合中；这个封装只为该表面启用 Glass。", "", `\`\`\`tsx verify\n${example}\n\`\`\``, "")
      lines.push(page.locale === "en" ? `Read [${title}](${target}) for complete usage guidance.` : `请阅读[${title}](${target})，了解完整用法。`, "")
    }
    const localExamples = item.examples.filter((example) => byExample.get(example) === page.id)
    for (const example of localExamples) lines.push(`- [${page.locale === "en" ? "Live example" : "在线示例"}](../../../../examples/${example}/)`)
    if (localExamples.length) lines.push("")
  }
  return lines.join("\n").trim()
}

export function skillOverlay(family, capabilities, fragments) {
  const matches = capabilities.filter((item) => item.families.includes(family))
  if (!matches.length) return null
  const lines = ["## ExUI capability notes", ""]
  for (const item of matches) {
    const fragment = fragments.get(`en/${item.id}`)
    const nativeGuide = item.guides.find((guide) => guide.skill.startsWith("exui/"))?.skill
    lines.push(`**${originLabel(item.origin, "en")}**`, "")
    if (nativeGuide) {
      const title = fragmentTitle(fragment, item.id)
      lines.push(`### ${title}`, "", firstProse(fragment), "")
      const localSurface = localSurfaceLine(item, family, "en")
      if (localSurface) lines.push(localSurface, "")
      const example = localSurfaceExample(item, family)
      if (example) lines.push("Keep this surface in its usual family composition; the wrapper opts that surface into Glass.", "", `\`\`\`tsx\n${example}\n\`\`\``, "")
      lines.push(`Read [${title}](../${nativeGuide}) for the ExUI contract and complete examples.`, "")
    } else lines.push(fragment, "")
  }
  return lines.join("\n").trim()
}

export async function capabilitySkillOverlays(root = repoRoot) {
  const inputs = await loadInputs(root)
  const families = new Map()
  for (const item of inputs.capabilities) for (const family of item.families) families.set(family, skillOverlay(family, inputs.capabilities, inputs.fragments))
  return families
}

export async function writeCapabilityOutputs(outputs, targetSkillRoot) {
  const referenceRoot = path.join(targetSkillRoot, "references/components")
  const pending = new Map()
  for (const output of outputs) {
    const relative = path.relative(referenceRoot, output.filename)
    if (!relative.startsWith("..") && !path.isAbsolute(relative)) pending.set(posix(relative), output.expected)
  }
  const { prepareOverlayLockRefresh } = await import("./exui-skill/sync-references.mjs")
  const prepared = await prepareOverlayLockRefresh(targetSkillRoot, pending)
  for (const output of outputs) if (normalize(output.actual ?? await readFile(output.filename, "utf8")) !== output.expected) await writeFile(output.filename, output.expected, "utf8")
  await writeFile(prepared.lockFile, `${JSON.stringify(prepared.snapshot, null, 2)}\n`, "utf8")
}

export async function runCapabilities(mode, root = repoRoot) {
  if (!["--check", "--write", "--accept-source-review", "--bootstrap-source-review"].includes(mode)) throw new Error("Usage: exui-capabilities.mjs --check|--write|--accept-source-review|--bootstrap-source-review")
  const { pages, registry, capabilities, fragments, examples, current, skillFamilies } = await loadInputs(root)
  const reviewPath = path.join(root, "packages/docs/exui/source-review.json")
  if (mode === "--accept-source-review" || mode === "--bootstrap-source-review") {
    await acceptSourceReview(reviewPath, current, registry, { bootstrap: mode === "--bootstrap-source-review" })
    return { capabilities: capabilities.length, pages: 0 }
  }
  const accepted = JSON.parse(await readFile(reviewPath, "utf8").catch(() => "null"))
  const differences = sourceReviewDiff(accepted, current)
  if (differences.length) throw new Error(`Source review drift: ${differences.slice(0, 12).join(", ")}; inspect changes then run --accept-source-review explicitly`)
  const coverageDrift = sourceReviewCoverageDiff(accepted, registry)
  if (coverageDrift.length) throw new Error(`Source review coverage drift: ${coverageDrift.join(", ")}`)
  const outputs = []
  for (const page of pages) {
    const content = docsContent(page, capabilities, fragments, examples)
    const filename = path.join(root, "packages/docs/content", page.locale, page.contentPath)
    const actual = await readFile(filename, "utf8")
    const expected = content ? renderBounded(actual, content, "docs") : removeBounded(actual, "docs")
    if (content || normalize(actual) !== expected) outputs.push({ filename, actual, expected })
  }
  for (const family of skillFamilies) {
    const filename = path.join(root, "skills/exui/references/components", `${family}.md`)
    const actual = await readFile(filename, "utf8")
    const content = skillOverlay(family, capabilities, fragments)
    const expected = content ? renderBounded(actual, content, "skill") : removeBounded(actual, "skill")
    if (content || normalize(actual) !== expected) outputs.push({ filename, actual, expected })
  }
  if (mode === "--check") {
    const stale = outputs.filter((output) => normalize(output.actual) !== output.expected)
    if (stale.length) throw new Error(`Generated capability drift: ${stale.map((item) => posix(path.relative(root, item.filename))).join(", ")}`)
  } else await writeCapabilityOutputs(outputs, path.join(root, "skills/exui"))
  return { capabilities: capabilities.length, pages: outputs.length }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCapabilities(process.argv[2] ?? "--check").then((result) => console.log(`${process.argv[2] ?? "--check"}: ${result.capabilities} capabilities, ${result.pages} generated targets`)).catch((error) => { console.error(error.message); process.exitCode = 1 })
}
