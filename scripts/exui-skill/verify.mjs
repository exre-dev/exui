import { readFile, readdir, stat } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../skills/exui")
const markdownPaths = (await readdir(root, { recursive: true })).filter((file) => file.endsWith(".md")).map((file) => path.join(root, file))
const documents = new Map(await Promise.all(markdownPaths.map(async (file) => [file, await readFile(file, "utf8")])))
const errors = []
const edges = new Map()
let linkCount = 0
function headings(markdown) {
  const seen = new Map()
  const result = new Set()
  for (const match of markdown.matchAll(/^#{1,6} +(.+)$/gm)) {
    const base = match[1].toLowerCase().replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[^\p{L}\p{N}_\s-]/gu, "").trim().replace(/\s/g, "-")
    const n = seen.get(base) ?? 0
    seen.set(base, n + 1)
    result.add(n ? `${base}-${n}` : base)
  }
  for (const match of markdown.matchAll(/\bid=["']([^"']+)["']/g)) result.add(match[1])
  return result
}
for (const [file, text] of documents) {
  const withoutCode = text.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\s*$/gm, "")
  edges.set(file, [])
  if (/https:\/\/reui\.io\/components\//.test(text)) errors.push(`${file}: remote component link remains`)
  for (const match of withoutCode.matchAll(/!?\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    const href = match[1]
    if (/^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith("//")) continue
    linkCount++
    const [rawPath, hash] = href.split("#")
    const destination = rawPath ? path.resolve(path.dirname(file), decodeURIComponent(rawPath.split("?")[0])) : file
    const relative = path.relative(root, destination)
    if (relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
      errors.push(`${file}: link escapes the skill: ${href}`)
      continue
    }
    if (!(await stat(destination).catch(() => null))?.isFile()) {
      errors.push(`${file}: missing local file: ${href}`)
      continue
    }
    if (documents.has(destination)) {
      edges.get(file).push(destination)
      if (hash && !headings(documents.get(destination)).has(decodeURIComponent(hash))) errors.push(`${file}: missing heading: ${href}`)
    }
  }
}
const reached = new Set()
const queue = [path.join(root, "SKILL.md")]
while (queue.length) {
  const next = queue.pop()
  if (reached.has(next)) continue
  reached.add(next)
  queue.push(...(edges.get(next) ?? []))
}
for (const file of documents.keys()) if (!reached.has(file)) errors.push(`Unreachable Markdown reference: ${path.relative(root, file)}`)
const entry = documents.get(path.join(root, "SKILL.md")) ?? ""
if (!/^---\r?\nname: exui\r?\ndescription: .+\r?\n---/.test(entry)) errors.push("Invalid ExUI entry frontmatter")
if (errors.length) {
  console.error(errors.join("\n"))
  process.exitCode = 1
} else console.log(`Verified ${documents.size} reachable Markdown files and ${linkCount} local links (including heading targets)`)
