import { Component, lazy, Suspense, useEffect, useLayoutEffect, useRef, useState, type ComponentType, type ReactNode } from "react"
import { Skeleton } from "@exre/exui"
import { ArrowUpRightIcon } from "lucide-react"
import { catalogPages, pageHref, type CatalogPage } from "./catalog"
import { presentationPages } from "./catalog-presentation"
import { useShowcaseLanguage } from "./language"
import "./ComponentsOverview.css"

// Load one existing example per family, without importing its entire detail page.
const exampleLoaders = import.meta.glob<{ default: ComponentType }>("./examples/*/c-*-1.tsx")
const previews = new Map(catalogPages.filter((entry) => entry.group === "components").map((entry) => [entry.id, lazy(async () => {
  const load = exampleLoaders[`./examples/${entry.id}/c-${entry.id}-1.tsx`]
  if (!load) throw new Error(`Missing overview preview: ${entry.id}`)
  return load()
})]))
const ExUIPreview = lazy(() => import("./OverviewExUIPreviews"))
const widePreviews = new Set(["bubble", "chart", "data-grid", "event-calendar", "filters", "gantt", "kanban", "message-scroller", "navigation-menu", "resizable", "scrollspy", "sidebar", "sortable", "table", "timeline"])
const groups = (["components", "exui"] as const).map((id) => ({ id, pages: presentationPages.filter((entry) => entry.navigationGroup === id).sort((a, b) => a.name.localeCompare(b.name, "en")) }))

type ComponentsOverviewProps = {
  group?: CatalogPage["group"]
  exampleCounts?: Readonly<Record<string, number>>
  density?: "standard" | "compact"
  renderLink?: (entry: CatalogPage, children: ReactNode) => ReactNode
}

class ThumbnailBoundary extends Component<{ children: ReactNode; label: string }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed ? <span data-overview-error>{this.props.label}</span> : this.props.children
  }
}

function FittedPreview({ children, wide }: { children: ReactNode; wide: boolean }) {
  const viewport = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const frame = viewport.current!, content = stage.current!
    const fit = () => {
      const scale = Math.min(1, (frame.clientWidth - 32) / content.offsetWidth, (frame.clientHeight - 32) / Math.max(content.offsetHeight, 1))
      content.style.setProperty("--overview-scale", String(Math.max(scale, .05)))
    }
    const observer = new ResizeObserver(fit)
    observer.observe(frame)
    observer.observe(content)
    fit()
    return () => observer.disconnect()
  }, [])
  return <div ref={viewport} className="overview-preview-viewport">
    <div ref={stage} className={`overview-preview-stage${wide ? " overview-preview-stage-wide" : ""}`}>{children}</div>
  </div>
}

function OverviewCard({ entry, exampleCount, density, renderLink }: { entry: CatalogPage; exampleCount?: number } & Pick<ComponentsOverviewProps, "density" | "renderLink">) {
  const element = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const { language } = useShowcaseLanguage()
  useEffect(() => {
    const observer = new IntersectionObserver(([intersection]) => {
      if (intersection.isIntersecting) { setVisible(true); observer.disconnect() }
    }, { rootMargin: "240px" })
    observer.observe(element.current!)
    return () => observer.disconnect()
  }, [])
  const Demo = previews.get(entry.id)
  const linkContent = <><span>{entry.name}</span>{exampleCount !== undefined && <span className="overview-card-count">{language === "zh-CN" ? `${exampleCount} 个示例` : `${exampleCount} ${exampleCount === 1 ? "example" : "examples"}`}</span>}<ArrowUpRightIcon aria-hidden="true" /></>
  return <article ref={element} className="overview-card" data-overview-card={entry.id}>
    <div className={`overview-card-preview${density ? ` density-${density}` : ""}`} inert aria-hidden="true">
      {visible ? <ThumbnailBoundary label={language === "zh-CN" ? "查看组件" : "View component"}>
        <Suspense fallback={<Skeleton className="overview-preview-skeleton" />}>
          <FittedPreview wide={widePreviews.has(entry.id)}>
            <div data-overview-loaded={entry.id}>{entry.group === "exui" ? <ExUIPreview id={entry.id} /> : Demo ? <Demo /> : null}</div>
          </FittedPreview>
        </Suspense>
      </ThumbnailBoundary> : <Skeleton className="overview-preview-skeleton" />}
    </div>
    {renderLink ? renderLink(entry, linkContent) : <a className="overview-card-link" href={pageHref(entry)}>{linkContent}</a>}
  </article>
}

export default function ComponentsOverview({ group, exampleCounts, density, renderLink }: ComponentsOverviewProps = {}) {
  const { language } = useShowcaseLanguage()
  const zh = language === "zh-CN"
  return <div className="components-overview" data-testid="components-overview">
    {groups.filter(({ id }) => !group || id === group).map(({ id, pages }) => <section key={id} data-overview-group={id} aria-labelledby={`overview-${id}`}>
      <div className="overview-group-heading"><h2 id={`overview-${id}`}>{id === "exui" ? "Blocks" : "Components"}</h2><span>{pages.length}</span></div>
      <p>{id === "exui" ? zh ? "由基础组件组装而成的可复用界面区块。" : "Reusable interface blocks assembled from basic components." : zh ? "用于构建界面的基础组件。" : "Basic components for building interfaces."}</p>
      <div className="overview-grid">{pages.map((entry) => <OverviewCard entry={entry} exampleCount={exampleCounts?.[entry.id]} density={density} renderLink={renderLink} key={entry.id} />)}</div>
    </section>)}
  </div>
}
