import { loader } from "fumadocs-core/source"
import { zhDocs, enDocs } from "../../.source/server"
import manifest from "../../.generated/pages.json"
import { docPath, normalizeBase, overviewPath } from "../../lib/site-contract.mjs"

const base = normalizeBase(process.env.EXUI_DOCS_BASE ?? "/")
export const sources = {
  "zh-CN": loader({ baseUrl: `${base}zh-CN/docs`, source: zhDocs.toFumadocsSource() }),
  en: loader({ baseUrl: `${base}en/docs`, source: enDocs.toFumadocsSource() }),
}

export function documentTree(locale: "zh-CN" | "en") {
  const groups = ["getting-started", "components", "exui", "tokens"] as const
  const labels = locale === "zh-CN" ? ["入门", "Components", "Blocks", "Tokens 与主题"] : ["Getting started", "Components", "Blocks", "Tokens and themes"]
  return { name: "ExUI", children: [{ type: "page" as const, name: locale === "zh-CN" ? "组件总览" : "All components", url: overviewPath(locale, base) }, ...groups.map((group, index) => ({
    type: "folder" as const,
    name: labels[index],
    defaultOpen: true,
    children: manifest.pages.filter(page => page.locale === locale && page.group === group)
      .sort((a, b) => group === "components" || group === "exui" ? a.title.localeCompare(b.title, "en") : 0)
      .map(page => ({ type: "page" as const, name: page.title, url: docPath(locale, page.id, base) })),
  }))] }
}
