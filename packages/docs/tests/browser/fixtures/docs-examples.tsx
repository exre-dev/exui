import { useCallback, useEffect, useMemo } from "react"
import type { Root } from "react-dom/client"
import { createMemoryRouter, RouterProvider, useLocation, useNavigate, useParams } from "react-router"
import { expect } from "vitest"
import { page } from "vitest/browser"
import { ComponentExamplesHost } from "../../../app/components/ComponentExamplesHost"
import { Settings } from "../../../app/components/Settings"
import { PreferencesProvider, usePreferences, type Density, type Locale, type Theme } from "../../../app/lib/preferences"
import { LanguageContext } from "../../../src/showcase/language"
import coverage from "../../../upstream/reui/coverage.json"
import "../../../app/styles/docs.css"

// The route adapter supplies only loader data. Settings, preferences, example
// navigation, portals and family loading are the same providers used by docs.
export function mountDocsExamples(root: Root, initialFamily: string) {
  let update: (label: string, value: string) => void = () => { throw new Error("Example route is not ready") }
  function ExamplesRoute() {
    const { locale, family } = useParams()
    const { pathname, search } = useLocation()
    const navigate = useNavigate()
    const { density, setDensity, setTheme } = usePreferences()
    const language = locale as Locale
    const setLanguage = useCallback((next: Locale) => {
      void navigate(pathname.replace(/^\/(?:en|zh-CN)\//, `/${next}/`) + search)
    }, [navigate, pathname, search])
    useEffect(() => { document.documentElement.lang = language }, [language])
    update = (label, value) => {
      if (label === "Theme") setTheme(value as Theme)
      else if (label === "Density") setDensity(value as Density)
      else setLanguage(value as Locale)
    }
    const languageContext = useMemo(() => ({ language, setLanguage }), [language, setLanguage])
    return <LanguageContext.Provider value={languageContext}>
      <Settings />
      <section className="docs-examples not-prose" aria-label={language === "zh-CN" ? "示例" : "Examples"}>
        <h2 id="examples">{language === "zh-CN" ? "示例" : "Examples"}</h2>
        <ComponentExamplesHost family={family!} density={density} target={new URLSearchParams(search).get("example") ?? undefined} />
      </section>
    </LanguageContext.Provider>
  }
  const router = createMemoryRouter([{
    id: "routes/docs", path: "/:locale/docs/:group/:family/", Component: ExamplesRoute,
    loader: () => ({ examples: coverage.examples.map(example => example.id), alternateAnchors: ["#examples"] }),
  }], { initialEntries: [`/en/docs/components/${initialFamily}/`] })
  root.render(<PreferencesProvider><RouterProvider router={router} /></PreferencesProvider>)
  return {
    router,
    open: (group: string, family: string) => router.navigate(router.state.location.pathname.replace(/\/docs\/.*$/, `/docs/${group}/${family}/`)),
    setBehindModal: (label: string, value: string) => update(label, value),
    async setting(label: string, value: string) {
      label = ({ 主题: "Theme", 密度: "Density", 语言: "Language" } as Record<string, string>)[label] ?? label
      const zh = router.state.location.pathname.startsWith("/zh-CN/")
      const labels: Record<string, string> = zh ? { Theme: "主题", Density: "预览密度", Language: "语言" } : { Theme: "Theme", Density: "Preview density", Language: "Language" }
      const options: Record<string, string> = zh
        ? { light: "浅色", dark: "深色", "pitch-black": "纯黑", standard: "标准", compact: "紧凑", en: "English", "zh-CN": "简体中文" }
        : { light: "Light", dark: "Dark", "pitch-black": "Pitch black", standard: "Standard", compact: "Compact", en: "English", "zh-CN": "简体中文" }
      await page.getByRole("combobox", { name: labels[label], exact: true }).click()
      await page.getByRole("option", { name: options[value], exact: true }).click()
      if (label === "Language") await expect.poll(() => document.documentElement.lang).toBe(value)
    },
  }
}
