import { Component, useEffect, useState, type ComponentType, type ReactNode } from "react"
import { GlassSeed, Toaster, TooltipProvider } from "@exre/exui"
import { catalogPages } from "../../src/showcase/catalog"
import { componentLoaders } from "../../src/showcase/component-loaders.generated"
import { ExampleNavigationContext } from "../../src/showcase/example-navigation"
import { useShowcaseLanguage } from "../../src/showcase/language"
import "../../src/showcase/DocsExamples.css"

const loaders: Record<string, () => Promise<{ default: ComponentType }>> = componentLoaders

class FamilyBoundary extends Component<{ children: ReactNode; failedLabel: string; retryLabel: string; onRetry: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) return <div className="docs-examples-state" role="alert">{this.props.failedLabel} <button type="button" onClick={() => { this.setState({ failed: false }); this.props.onRetry() }}>{this.props.retryLabel}</button></div>
    return this.props.children
  }
}

function FamilySession({ family, target, density }: { family: string; target?: string; density: "standard" | "compact" }) {
  const { language } = useShowcaseLanguage()
  const zh = language === "zh-CN"
  const page = catalogPages.find(item => item.id === family)
  const [Page, setPage] = useState<ComponentType | null>(null)
  const [failed, setFailed] = useState(false)
  const [revision, setRevision] = useState(0)
  const [missingTarget, setMissingTarget] = useState(false)
  useEffect(() => {
    if (!page) return
    let cancelled = false
    setFailed(false)
    const load = page.group === "exui"
      ? import("../../src/showcase/pages/exui").then(({ pages }) => ({ default: pages[family] }))
      : loaders[family]?.()
    if (!load) { setFailed(true); return }
    void load.then(module => {
      if (!module.default) throw new Error(`Missing example family: ${family}`)
      if (!cancelled) setPage(() => module.default)
    }).catch(() => { if (!cancelled) setFailed(true) })
    return () => { cancelled = true }
  }, [family, page, revision])
  useEffect(() => {
    if (!target || !Page) { setMissingTarget(false); return }
    const frame = requestAnimationFrame(() => setMissingTarget(![...document.querySelectorAll<HTMLElement>("[data-docs-example-card]")].some(element => element.dataset.docsExampleCard === target)))
    return () => cancelAnimationFrame(frame)
  }, [target, Page])
  if (!page) return <div className="docs-examples-state" role="alert">{zh ? "未找到示例家族。" : "Example family not found."}</div>
  if (failed) return <div className="docs-examples-state" role="alert">{zh ? "示例加载失败。" : "Examples failed to load."} <button type="button" onClick={() => { setPage(null); setRevision(value => value + 1) }}>{zh ? "重试" : "Retry"}</button></div>
  if (!Page) return <div className="docs-examples-state" role="status" aria-busy="true">{zh ? "正在加载示例…" : "Loading examples…"}</div>
  return <ExampleNavigationContext.Provider value={{ page, target, docsMode: true, density }}>
    <div data-page-loaded={family} className={`docs-examples-scope not-prose${density === "compact" ? " density-compact" : ""}`}>
      {missingTarget && <div className="docs-examples-state" role="status">{zh ? "未找到指定示例。" : "Requested example not found."}</div>}
      <FamilyBoundary key={revision} failedLabel={zh ? "示例家族渲染失败。" : "Example family failed to render."} retryLabel={zh ? "重试" : "Retry"} onRetry={() => { setPage(null); setRevision(value => value + 1) }}><Page /></FamilyBoundary>
    </div>
  </ExampleNavigationContext.Provider>
}

export function ComponentExamplesHost({ family, target, density }: { family: string; target?: string; density: "standard" | "compact" }) {
  const { language } = useShowcaseLanguage()
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  if (!ready) return <div className="docs-examples-state" data-testid="examples-hydration-placeholder" aria-busy="true">{language === "zh-CN" ? "正在加载示例…" : "Loading examples…"}</div>
  return <TooltipProvider>
    <GlassSeed />
    <Toaster position="top-right" duration={3000} visibleToasts={3} />
    <FamilySession key={family} family={family} target={target} density={density} />
  </TooltipProvider>
}
