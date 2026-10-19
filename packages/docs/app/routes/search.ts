import { createSearchAPI } from "fumadocs-core/search/server"
import { sources } from "../lib/source.server"
import { listShareExamples } from "../../lib/source-export.server"
import { docPath } from "../../lib/site-contract.mjs"
import { base } from "../lib/urls"
import type { Route } from "./+types/search"

const examples = await listShareExamples()
const servers = Object.fromEntries(Object.entries(sources).map(([locale, source]) => [locale, createSearchAPI("advanced", {
  indexes: source.getPages().map(page => {
    const family = page.data.exampleFamily
    const names = examples.filter(example => example.page.id === family).map(example => `${example.page.name} ${example.id}`)
    const url = docPath(locale as "en" | "zh-CN", page.data.id, base)
    return { id: url, title: page.data.title, description: page.data.description, url, structuredData: { ...page.data.structuredData, contents: [...page.data.structuredData.contents, ...names.map(content => ({ content, heading: undefined }))] } }
  }),
})]))

export function loader({ params }: Route.LoaderArgs) {
  if (params.locale !== "zh-CN" && params.locale !== "en") throw new Response("Not found", { status: 404 })
  return servers[params.locale].staticGET()
}
