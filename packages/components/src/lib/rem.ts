/** Built-in defaults use rem; external numbers retain their CSS-pixel meaning. */
export function toCssLength(value: number | string | undefined, fallback: string): string {
  return value === undefined ? fallback : typeof value === "number" ? `${value}px` : value
}

function ownerDocument(owner?: Element | Document | null): Document | null {
  if (owner) return owner.nodeType === 9 ? owner as Document : owner.ownerDocument
  return typeof document === "undefined" ? null : document
}

export function getRootRem(owner?: Element | Document | null): number {
  const doc = ownerDocument(owner)
  const value = doc?.defaultView?.getComputedStyle(doc.documentElement).fontSize
  const pixels = value ? Number.parseFloat(value) : 16
  return Number.isFinite(pixels) && pixels > 0 ? pixels : 16
}

export function remToPixels(value: number, owner?: Element | Document | null): number {
  return value * getRootRem(owner)
}

interface RootRemStore {
  subscribe: (listener: () => void) => () => void
  getSnapshot: () => number
}

const stores = new WeakMap<Document, RootRemStore>()

/**
 * A single 1rem probe per live document also catches stylesheet and media-query
 * changes, which a MutationObserver on html alone cannot detect. A portal can
 * subscribe against its own document without sharing another document's scale.
 */
export function getRootRemStore(doc: Document): RootRemStore {
  const existing = stores.get(doc)
  if (existing) return existing

  let pixels = getRootRem(doc)
  const listeners = new Set<() => void>()
  let stop: (() => void) | undefined

  const measure = () => {
    const next = getRootRem(doc)
    if (next === pixels) return
    pixels = next
    for (const listener of listeners) listener()
  }

  const start = () => {
    const view = doc.defaultView
    const probe = doc.createElement("span")
    probe.setAttribute("data-exui-rem-probe", "")
    probe.setAttribute("aria-hidden", "true")
    probe.style.cssText = "position:absolute;inset:0 auto auto 0;display:block;box-sizing:content-box;width:1rem;height:0;padding:0;margin:0;border:0;visibility:hidden;pointer-events:none;contain:strict"
    ;(doc.body ?? doc.documentElement).appendChild(probe)
    const resize = view?.ResizeObserver ? new view.ResizeObserver(measure) : undefined
    resize?.observe(probe)
    const mutation = view?.MutationObserver ? new view.MutationObserver(measure) : undefined
    mutation?.observe(doc.documentElement, { attributes: true, attributeFilter: ["class", "style"] })
    view?.addEventListener("resize", measure)
    measure()
    stop = () => {
      resize?.disconnect()
      mutation?.disconnect()
      view?.removeEventListener("resize", measure)
      probe.remove()
      stop = undefined
    }
  }

  const store: RootRemStore = {
    getSnapshot: () => pixels,
    subscribe(listener) {
      listeners.add(listener)
      if (listeners.size === 1) start()
      return () => {
        listeners.delete(listener)
        if (listeners.size === 0) stop?.()
      }
    },
  }
  stores.set(doc, store)
  return store
}
