import { useCallback, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { GlassSeed, Toaster, TooltipProvider } from "@exre/exui"
import { DocsLayout } from "fumadocs-ui/layouts/glass"
import { DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/glass/page"
import ComponentsOverview from "../../src/showcase/ComponentsOverview"
import { presentationPages } from "../../src/showcase/catalog-presentation"
import { LanguageContext } from "../../src/showcase/language"
import { docPath, overviewPath, preferenceKeys } from "../../lib/site-contract.mjs"
import { listShareExamples } from "../../lib/source-export.server"
import { ExIcon } from "../components/ExIcon"
import { NotFound } from "../components/NotFound"
import { Settings } from "../components/Settings"
import { documentTree } from "../lib/source.server"
import { persistPreference, usePreferences, type Locale } from "../lib/preferences"
import { appPath, base } from "../lib/urls"
import type { Route } from "./+types/overview"

export async function loader({ params }: Route.LoaderArgs) {
  const locale = params.locale
  if (locale !== "zh-CN" && locale !== "en") throw new Response("Not found", { status: 404 })
  const group = params.group
  if (group !== undefined && group !== "components" && group !== "exui") throw new Response("Not found", { status: 404 })
  const exampleCounts: Record<string, number> = {}
  for (const example of await listShareExamples()) {
    exampleCounts[example.page.id] = (exampleCounts[example.page.id] ?? 0) + 1
  }
  return { locale: locale as Locale, group: group as "components" | "exui" | undefined, tree: documentTree(locale), exampleCounts }
}

export const meta = ({ data }: Route.MetaArgs) => [{ title: `${data?.group === "exui" ? "Blocks" : data?.group === "components" ? "Components" : data?.locale === "zh-CN" ? "组件总览" : "All components"} · ExUI` }]
export function ErrorBoundary() { return <NotFound /> }

export default function Overview({ loaderData: page }: Route.ComponentProps) {
  const { density } = usePreferences()
  const navigate = useNavigate()
  const zh = page.locale === "zh-CN"
  const setLanguage = useCallback((next: Locale) => {
    persistPreference(preferenceKeys.language, next)
    navigate(appPath(overviewPath(next, base, page.group)))
  }, [navigate, page.group])
  useEffect(() => { persistPreference(preferenceKeys.language, page.locale) }, [page.locale])
  return <LanguageContext.Provider value={{ language: page.locale, setLanguage }}>
    <DocsLayout tree={page.tree} tabs={false} nav={{ title: <span className="docs-brand"><ExIcon />ExUI</span>, url: overviewPath(page.locale, base) }} slots={{ themeSwitch: Settings }}>
      <DocsPage full>
        <DocsTitle>{page.group === "exui" ? "Blocks" : page.group === "components" ? "Components" : zh ? "组件总览" : "All components"}<span className="docs-overview-total">{presentationPages.filter(entry => !page.group || entry.navigationGroup === page.group).length}</span></DocsTitle>
        <DocsDescription>{zh ? "Components 是基础组件；Blocks 是由基础组件组装而成的可复用界面区块。选择组件或区块查看用法和示例。" : "Components are basic UI elements. Blocks assemble them into reusable interface sections. Choose a component or block to see its usage and examples."}</DocsDescription>
        <TooltipProvider>
          <GlassSeed />
          <Toaster position="top-right" duration={3000} visibleToasts={3} />
          <ComponentsOverview group={page.group} exampleCounts={page.exampleCounts} density={density} renderLink={(entry, children) =>
            <Link className="overview-card-link" to={appPath(docPath(page.locale, `${entry.group}/${entry.id}`, base))}>{children}</Link>
          } />
        </TooltipProvider>
      </DocsPage>
    </DocsLayout>
  </LanguageContext.Provider>
}
