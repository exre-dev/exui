import ts from "typescript"
import type { Plugin } from "vite"
import { normalizeBase } from "./site-contract.mjs"

const managedPrefix = "/examples/reui/"

// Adapt deployment URLs without changing the locked examples or copied sources.
export function prefixExampleAssetUrls(code: string, filename: string, base: string) {
  const prefix = normalizeBase(base)
  if (prefix === "/" || !code.includes(managedPrefix)) return code
  const source = ts.createSourceFile(filename, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const offsets: number[] = []
  function visit(node: ts.Node) {
    if ((ts.isStringLiteralLike(node) || ts.isTemplateHead(node)) && node.text.startsWith(managedPrefix)) {
      const start = node.getStart(source) + 1
      if (!code.startsWith(managedPrefix, start)) throw new Error(`Managed asset path must use a literal prefix: ${filename}`)
      offsets.push(start)
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  let result = code
  for (const start of offsets.sort((left, right) => right - left)) {
    result = result.slice(0, start) + prefix + result.slice(start + 1)
  }
  return result
}

export function exampleAssetBase(): Plugin {
  let base = "/"
  return {
    name: "exui-docs-example-asset-base",
    enforce: "pre",
    configResolved(config) { base = normalizeBase(config.base) },
    transform(code, id) {
      const filename = id.split("?", 1)[0].replaceAll("\\", "/")
      if (base === "/" || !/\/src\/showcase\/(?:examples|pages\/components)\/.+\.[jt]sx?$/.test(filename)) return
      const transformed = prefixExampleAssetUrls(code, filename, base)
      if (transformed !== code) return { code: transformed, map: null }
    },
  }
}
