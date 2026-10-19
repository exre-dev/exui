import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from "react"
import { Button, GlassSeed, NativeSelect, NativeSelectOption, Skeleton, Toaster, TooltipProvider } from "@exre/exui"
import { LayoutGridIcon, RotateCwIcon } from "lucide-react"
import { overviewPage, pageHref, resolveExample, resolvePage } from "./catalog"
import { presentationPages } from "./catalog-presentation"
import { ExampleNavigationContext } from "./example-navigation"
import { pageComponents } from "./page-loaders"
import { ShowcaseLanguageProvider } from "./ShowcaseLanguageProvider"
import { useShowcaseLanguage } from "./language"
import "./ShowcaseStyles"

const themes = ["light", "dark", "pitch-black"] as const
const densities = ["standard", "compact"] as const
const ComponentsOverview = lazy(() => import("./ComponentsOverview"))

function storedChoice<T extends string>(key: string, values: readonly T[], fallback: T): T {
  try {
    const stored = localStorage.getItem(key)
    return values.find((value) => value === stored) ?? fallback
  } catch { return fallback }
}

function persist(key: string, value: string) {
  try { localStorage.setItem(key, value) } catch { /* Preferences remain usable without storage. */ }
}

class PreviewBoundary extends Component<{ children: ReactNode; retryLabel: string }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) return <div className="showcase-preview" data-page-error="true">
      <Button variant="outline" size="icon" aria-label={this.props.retryLabel} onClick={() => window.location.reload()}><RotateCwIcon aria-hidden="true" /></Button>
    </div>
    return this.props.children
  }
}

function ShowcaseContent() {
  const { language, setLanguage } = useShowcaseLanguage()
  const zh = language === "zh-CN"
  const [active, setActive] = useState(() => resolvePage(location.hash))
  const [target, setTarget] = useState(() => resolveExample(location.hash))
  const [theme, setTheme] = useState(() => storedChoice("exui-showcase-theme", themes, "light"))
  const [density, setDensity] = useState(() => storedChoice("exui-showcase-density", densities, "standard"))

  useEffect(() => {
    const sync = () => {
      const page = resolvePage(location.hash)
      const example = page.group === "overview" ? undefined : resolveExample(location.hash)
      const canonical = `${pageHref(page)}${example ? `?example=${example}` : ""}`
      if (location.hash !== canonical) history.replaceState(null, "", canonical)
      setActive(page)
      setTarget(example)
    }
    sync()
    window.addEventListener("hashchange", sync)
    return () => window.removeEventListener("hashchange", sync)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const previousThemes = themes.filter((value) => root.classList.contains(value))
    const previousDensity = root.classList.contains("density-compact")
    const previousColorScheme = root.style.colorScheme
    return () => {
      root.classList.remove(...themes)
      root.classList.add(...previousThemes)
      root.classList.toggle("density-compact", previousDensity)
      root.style.colorScheme = previousColorScheme
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.remove(...themes)
    document.documentElement.classList.add(theme)
    if (theme === "pitch-black") document.documentElement.classList.add("dark")
    document.documentElement.style.colorScheme = theme === "light" ? "light" : "dark"
    persist("exui-showcase-theme", theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.classList.toggle("density-compact", density === "compact")
    persist("exui-showcase-density", density)
  }, [density])

  const isOverview = active.group === "overview"
  const Page = isOverview ? ComponentsOverview : pageComponents.get(active.id)!
  return <TooltipProvider>
    <GlassSeed />
    <Toaster position="top-right" duration={3000} visibleToasts={3} />
    <div className="showcase-app">
      <header className="showcase-topbar">
        <a className="showcase-brand" href={pageHref(overviewPage)} aria-label="ExUI"><span className="showcase-brand-mark" aria-hidden="true"><span className="showcase-brand-icon" style={{ maskImage: `url("${import.meta.env.BASE_URL}icon.svg")` }} /></span>ExUI</a>
        <div className="showcase-settings">
          <NativeSelect aria-label={zh ? "主题" : "Theme"} value={theme} onChange={(event) => {
            const next = themes.find((value) => value === event.target.value)
            if (next) setTheme(next)
          }}>
            <NativeSelectOption value="light">{zh ? "浅色" : "Light"}</NativeSelectOption>
            <NativeSelectOption value="dark">{zh ? "深色" : "Dark"}</NativeSelectOption>
            <NativeSelectOption value="pitch-black">{zh ? "纯黑" : "Pitch black"}</NativeSelectOption>
          </NativeSelect>
          <NativeSelect aria-label={zh ? "密度" : "Density"} value={density} onChange={(event) => {
            const next = densities.find((value) => value === event.target.value)
            if (next) setDensity(next)
          }}>
            <NativeSelectOption value="standard">{zh ? "标准" : "Standard"}</NativeSelectOption>
            <NativeSelectOption value="compact">{zh ? "紧凑" : "Compact"}</NativeSelectOption>
          </NativeSelect>
          <NativeSelect aria-label={zh ? "语言" : "Language"} value={language} onChange={(event) => {
            if (event.target.value === "en" || event.target.value === "zh-CN") setLanguage(event.target.value)
          }}>
            <NativeSelectOption value="en">English</NativeSelectOption>
            <NativeSelectOption value="zh-CN">简体中文</NativeSelectOption>
          </NativeSelect>
        </div>
      </header>
      <aside className="showcase-sidebar">
        <div className="showcase-home-navigation">
          <Button asChild className="showcase-navigation-link" variant={isOverview ? "secondary" : "ghost"}>
            <a href={pageHref(overviewPage)} data-home-link aria-current={isOverview ? "page" : undefined}><LayoutGridIcon aria-hidden="true" />{zh ? "全部组件" : "All components"}</a>
          </Button>
        </div>
        <nav className="showcase-directory" aria-label={zh ? "组件" : "Components"}>
          {(["components", "exui"] as const).map((group) => <div className="showcase-directory-group" data-nav-group={group} key={group}>
            <div className="showcase-group-name">{group === "exui" ? "Blocks" : "Components"}</div>
            {presentationPages.filter((page) => page.navigationGroup === group).sort((a, b) => a.name.localeCompare(b.name, "en")).map((page) => <Button
              asChild className="showcase-navigation-link" variant={page.id === active.id ? "secondary" : "ghost"} key={page.id}
            >
              <a href={pageHref(page)} data-page-id={page.id} aria-current={page.id === active.id ? "page" : undefined}>{page.name}</a>
            </Button>)}
          </div>)}
        </nav>
      </aside>
      <main className="showcase-main">
        <div className="showcase-page" data-testid="catalog-content">
          <h1 data-testid="catalog-heading">{isOverview && zh ? "组件" : active.name}</h1>
          <PreviewBoundary key={active.id} retryLabel={zh ? "重新加载" : "Reload preview"}>
            <Suspense fallback={<div className="showcase-preview-grid" aria-busy="true"><Skeleton className="showcase-preview-loading" /><Skeleton className="showcase-preview-loading" /></div>}>
              {active.group === "overview" ? <ComponentsOverview /> : <ExampleNavigationContext.Provider value={{ page: active, target }}>
                <div data-page-loaded={active.id}><Page /></div>
              </ExampleNavigationContext.Provider>}
            </Suspense>
          </PreviewBoundary>
        </div>
      </main>
    </div>
  </TooltipProvider>
}

export default function Showcase() {
  return <ShowcaseLanguageProvider><ShowcaseContent /></ShowcaseLanguageProvider>
}
