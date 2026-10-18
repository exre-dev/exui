import { Component, useContext, useEffect, useRef, type ReactNode } from "react"
import { ExampleHeader } from "./ExampleHeader"
import { ExampleNavigationContext } from "./example-navigation"
import { useShowcaseLanguage } from "./language"

type PortalScope = { card: HTMLElement; density: "standard" | "compact"; hidden: boolean; nodes: Set<HTMLElement> }
const portalScopes = new Map<string, PortalScope>()
let portalObserver: MutationObserver | null = null
let activeOwner: string | null = null
let activeAt = 0

function rememberOwner(event: Event) {
  const target = event.target
  if (!(target instanceof Element)) return
  // Documentation tools use the site's density and are not preview-owned portals.
  if (target.closest(".showcase-example-header")) { activeOwner = null; return }
  const id = target.closest<HTMLElement>("[data-docs-example-card]")?.dataset.docsExampleCard
    ?? target.closest<HTMLElement>("[data-docs-example-portal]")?.dataset.docsExamplePortal
  if (id && portalScopes.has(id)) { activeOwner = id; activeAt = performance.now() }
  else if (event.type === "pointerdown" || event.type === "keydown" || event.type === "click") activeOwner = null
}
function paintPortal(node: HTMLElement, id: string, scope: PortalScope) {
  if (node.dataset.docsExamplePortal && node.dataset.docsExamplePortal !== id) return
  node.dataset.docsExamplePortal = id
  node.classList.toggle("density-compact", scope.density === "compact")
  node.hidden = scope.hidden
  node.inert = scope.hidden
  scope.nodes.add(node)
}
function observePortals(records: MutationRecord[]) {
  if (!activeOwner || performance.now() - activeAt > 1500) return
  const scope = portalScopes.get(activeOwner)
  if (!scope) return
  const marker = '[data-radix-popper-content-wrapper], [data-slot$="-overlay"], [data-slot$="-content"], [role="dialog"], [role="alertdialog"]'
  for (const record of records) for (const added of record.addedNodes) {
    if (added instanceof HTMLElement) {
      const toasts = added.matches("[data-sonner-toast]") ? [added] : [...added.querySelectorAll<HTMLElement>("[data-sonner-toast]")]
      for (const toast of toasts) paintPortal(toast, activeOwner, scope)
    }
    if (!(added instanceof HTMLElement) || (!added.matches(marker) && !added.querySelector(marker))) continue
    let root = added
    while (root.parentElement && root.parentElement !== document.body) root = root.parentElement
    if (root.parentElement === document.body && ![...portalScopes.values()].some(({ card }) => root.contains(card))) paintPortal(root, activeOwner, scope)
  }
  for (const owner of portalScopes.values()) for (const node of owner.nodes) if (!node.isConnected) owner.nodes.delete(node)
}
function usePortalScope(id: string, card: React.RefObject<HTMLDivElement | null>, density: "standard" | "compact", hidden: boolean) {
  useEffect(() => {
    const element = card.current
    if (!element) return
    portalScopes.set(id, { card: element, density: "standard", hidden: false, nodes: new Set() })
    if (!portalObserver) {
      portalObserver = new MutationObserver(observePortals)
      portalObserver.observe(document.body, { childList: true, subtree: true })
      for (const type of ["pointerdown", "pointerover", "keydown", "click"]) document.addEventListener(type, rememberOwner, true)
    }
    return () => {
      const scope = portalScopes.get(id)
      if (scope?.card === element) {
        for (const node of scope.nodes) if (node.dataset.docsExamplePortal === id) {
          delete node.dataset.docsExamplePortal
          node.classList.remove("density-compact")
          node.hidden = false
          node.inert = false
        }
        portalScopes.delete(id)
      }
      if (activeOwner === id) activeOwner = null
      if (portalScopes.size === 0) {
        portalObserver?.disconnect()
        portalObserver = null
        for (const type of ["pointerdown", "pointerover", "keydown", "click"]) document.removeEventListener(type, rememberOwner, true)
      }
    }
  }, [id, card])
  useEffect(() => {
    const scope = portalScopes.get(id)
    if (!scope) return
    scope.density = density
    scope.hidden = hidden
    for (const node of scope.nodes) if (node.isConnected) paintPortal(node, id, scope)
  }, [id, density, hidden])
}

class CardBoundary extends Component<{ children: ReactNode; retry: string; failedLabel: string }, { failed: boolean; revision: number }> {
  state = { failed: false, revision: 0 }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) return <div className="docs-example-card-error" role="alert"><span>{this.props.failedLabel}</span><button type="button" onClick={() => this.setState(({ revision }) => ({ failed: false, revision: revision + 1 }))}>{this.props.retry}</button></div>
    return <div key={this.state.revision}>{this.props.children}</div>
  }
}

function DocsPreview({ id, content, wrapper, density, family, wide, name, extension }: {
  id: string; content: ReactNode; wrapper: React.RefObject<HTMLDivElement | null>; density: "standard" | "compact"; family: string; wide: boolean; name: string; extension: boolean
}) {
  const { language } = useShowcaseLanguage()
  usePortalScope(id, wrapper, density, false)
  return <div ref={wrapper} data-docs-example-card={id} data-share-example-id={id} data-testid={`example-${id}`} className={`showcase-example docs-example-card${wide ? " showcase-example-wide" : ""}`}>
    <ExampleHeader id={id} name={name} extension={extension} family={family} />
    <div className="docs-example-preview-panel">
      <CardBoundary retry={language === "zh-CN" ? "重试示例" : "Retry example"} failedLabel={language === "zh-CN" ? "示例渲染失败。" : "Example failed to render."}>{content}</CardBoundary>
    </div>
  </div>
}

export function PreviewGrid({ children }: { children: ReactNode }) {
  return <div className="showcase-preview-grid">{children}</div>
}

export function Preview({ children, wide = false, className = "", exampleId, shareId = exampleId, kind, title }: {
  children: ReactNode
  wide?: boolean
  className?: string
  exampleId?: string
  shareId?: string
  kind?: "upstream" | "exui-extension"
  title?: string
}) {
  const navigation = useContext(ExampleNavigationContext)
  const wrapper = useRef<HTMLDivElement>(null)
  const target = navigation?.target
  useEffect(() => {
    if (!shareId || target !== shareId) return
    const element = wrapper.current
    if (!element) return
    element.dataset.highlighted = "true"
    const frame = requestAnimationFrame(() => element.scrollIntoView({ block: "start", behavior: "instant" }))
    const timer = window.setTimeout(() => { delete element.dataset.highlighted }, 2500)
    return () => { cancelAnimationFrame(frame); window.clearTimeout(timer); delete element.dataset.highlighted }
  }, [target, shareId])
  const content = <div data-example-id={exampleId} data-example-kind={kind} className={`showcase-preview${wide ? " showcase-preview-wide" : ""} ${className}`.trim()}>{children}</div>
  if (!shareId || !navigation) return content
  if (navigation.docsMode) return <DocsPreview id={shareId} content={content} wrapper={wrapper} density={navigation.density ?? "standard"} family={navigation.page.id} wide={wide} name={title ?? navigation.page.name} extension={kind === "exui-extension"} />
  return <div ref={wrapper} data-share-example-id={shareId} data-testid={`example-${shareId}`} className={`showcase-example${wide ? " showcase-example-wide" : ""}`}>
    <ExampleHeader id={shareId} name={title ?? navigation.page.name} extension={kind === "exui-extension"} />
    {content}
  </div>
}
