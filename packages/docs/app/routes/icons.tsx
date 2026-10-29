import { useCallback, useEffect } from "react"
import { useNavigate } from "react-router"
import { DocsLayout } from "fumadocs-ui/layouts/glass"
import { DocsPage } from "fumadocs-ui/layouts/glass/page"
import { IconsGallery } from "../components/icons/IconsGallery"
import { ExIcon } from "../components/ExIcon"
import { NotFound } from "../components/NotFound"
import { Settings } from "../components/Settings"
import { documentTree } from "../lib/source.server"
import { persistPreference, type Locale } from "../lib/preferences"
import { appPath, base } from "../lib/urls"
import { iconsPath, overviewPath, preferenceKeys } from "../../lib/site-contract.mjs"
import { LanguageContext } from "../../src/showcase/language"
import type { Route } from "./+types/icons"

export function loader({ params }: Route.LoaderArgs) {
  if (params.locale !== "zh-CN" && params.locale !== "en") throw new Response("Not found", { status: 404 })
  return { locale: params.locale as Locale, tree: documentTree(params.locale) }
}

export const meta = () => [{ title: "Icons · ExUI" }]
export function ErrorBoundary() { return <NotFound /> }

export default function Icons({ loaderData: page }: Route.ComponentProps) {
  const navigate = useNavigate()
  const setLanguage = useCallback((next: Locale) => {
    persistPreference(preferenceKeys.language, next)
    navigate(appPath(iconsPath(next, base)))
  }, [navigate])
  useEffect(() => { persistPreference(preferenceKeys.language, page.locale) }, [page.locale])
  return <LanguageContext.Provider value={{ language: page.locale, setLanguage }}>
    <DocsLayout tree={page.tree} tabs={false} nav={{ title: <span className="docs-brand"><ExIcon />ExUI</span>, url: overviewPath(page.locale, base) }} slots={{ themeSwitch: Settings }}>
      <DocsPage full><IconsGallery locale={page.locale} /></DocsPage>
    </DocsLayout>
  </LanguageContext.Provider>
}
