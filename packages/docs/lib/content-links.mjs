import { posix } from "node:path"
import { docPath, examplePath, normalizeBase } from "./site-contract.mjs"

export function rewriteContentLink(href, contentPath, base = "/") {
  const source = /^(en|zh-CN)\/((?:getting-started|components|exui|tokens)\/[a-z0-9-]+)\.mdx$/.exec(contentPath)
  if (!source || !href || href.startsWith("#") || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)) return href
  const [targetPath, anchor] = href.split("#", 2)
  const suffix = anchor === undefined ? "" : `#${anchor}`
  const absolute = /^\/(en|zh-CN)\/docs\/((?:getting-started|components|exui|tokens)\/[a-z0-9-]+)\/?$/.exec(targetPath)
  if (absolute) return docPath(absolute[1], absolute[2], base) + suffix
  const example = /^\.\.\/\.\.\/\.\.\/\.\.\/examples\/([a-z0-9]+(?:-[a-z0-9]+)*)\/$/.exec(targetPath)
  if (example) return examplePath(example[1], base) + suffix
  if (targetPath.startsWith("/")) return href
  const target = posix.normalize(posix.join(posix.dirname(source[2]), targetPath)).replace(/\.mdx$/, "")
  if (/^(?:getting-started|components|exui|tokens)\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(target)) {
    return docPath(source[1], target, base) + suffix
  }
  return href
}

export function remarkContentLinks({ base = "/" } = {}) {
  const prefix = normalizeBase(base)
  return (tree, file) => {
    const content = /\/content\/((?:en|zh-CN)\/(?:getting-started|components|exui|tokens)\/[a-z0-9-]+\.mdx)$/.exec(String(file.path ?? "").replaceAll("\\", "/"))
    if (!content) return
    function visit(node) {
      if ((node.type === "link" || node.type === "definition") && typeof node.url === "string") {
        node.url = rewriteContentLink(node.url, content[1], prefix)
      }
      for (const child of node.children ?? []) visit(child)
    }
    visit(tree)
  }
}
