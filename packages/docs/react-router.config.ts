import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import type { Config } from "@react-router/dev/config"
import { loadPages } from "../../scripts/docs-content.mjs"
import { loadShareExamples } from "../../scripts/docs-sharing.mjs"
import { docPath, examplePath, locales, normalizeBase, overviewPath, searchPath } from "./lib/site-contract.mjs"

const docsRoot = fileURLToPath(new URL("./", import.meta.url))

export async function enumeratePrerenderPaths() {
  const pages = await loadPages()
  const examples = await loadShareExamples()
  const paths = ["/", "/404/", ...locales.flatMap(locale => [overviewPath(locale), overviewPath(locale, "/", "components"), overviewPath(locale, "/", "exui")]), ...pages.map(page => docPath(page.locale, page.id)), ...examples.map(example => examplePath(example.id)), searchPath("zh-CN"), searchPath("en")]
  await mkdir(path.join(docsRoot, ".generated"), { recursive: true })
  await writeFile(path.join(docsRoot, ".generated/prerender-paths.json"), JSON.stringify({ schemaVersion: 1, paths }, null, 2) + "\n")
  return paths
}

export default {
  ssr: false,
  buildDirectory: "build",
  basename: normalizeBase(process.env.EXUI_DOCS_BASE ?? "/"),
  routeDiscovery: { mode: "initial" },
  future: { v8_trailingSlashAwareDataRequests: true },
  prerender: enumeratePrerenderPaths,
} satisfies Config
