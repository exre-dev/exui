import "@exre/exui/style.css"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { page } from "vitest/browser"
import coverage from "../../upstream/reui/coverage.json"
import { catalogPages, pageHref } from "./catalog"
import Showcase from "./Showcase"

type CoverageExample = { id: string; family: string; status: string; order: number }
const examples = coverage.examples as CoverageExample[]
const storageKeys = ["exui-showcase-language", "exui-showcase-theme", "exui-showcase-density"] as const
let root: Root
let container: HTMLDivElement
let previous: { classes: string; lang: string; title: string; hash: string; scrollX: number; scrollY: number; storage: (string | null)[] }

beforeEach(async () => {
  previous = {
    classes: document.documentElement.className, lang: document.documentElement.lang,
    title: document.title, hash: location.hash, scrollX: scrollX, scrollY: scrollY,
    storage: storageKeys.map(key => localStorage.getItem(key)),
  }
  localStorage.setItem(storageKeys[0], "en")
  localStorage.setItem(storageKeys[1], "light")
  localStorage.setItem(storageKeys[2], "standard")
  history.replaceState(null, "", "#/exui/glass")
  container = document.createElement("div")
  document.body.replaceChildren(container)
  root = createRoot(container)
  root.render(<Showcase />)
  await document.fonts.ready
})

afterEach(() => {
  root.unmount()
  document.documentElement.className = previous.classes
  document.documentElement.lang = previous.lang
  document.title = previous.title
  history.replaceState(null, "", previous.hash || location.pathname + location.search)
  storageKeys.forEach((key, index) => {
    const value = previous.storage[index]
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  })
  scrollTo(previous.scrollX, previous.scrollY)
})

function idsIn(pageRoot: Element) {
  return Array.from(pageRoot.querySelectorAll<HTMLElement>("[data-example-id]"), node => node.dataset.exampleId)
}

function inspectDocumentIds(context: string) {
  const allIds = Array.from(document.querySelectorAll<HTMLElement>("[id]"), node => node.id)
  expect(new Set(allIds).size, `${context}: duplicate document id`).toBe(allIds.length)
}

function inspectReferences(scope: Element, context: string) {
  for (const label of scope.querySelectorAll<HTMLLabelElement>("label[for]")) {
    const target = document.getElementById(label.htmlFor)
    expect(target, `${context}: label for=${label.htmlFor}`).not.toBeNull()
    expect(target?.matches("button,input,meter,output,progress,select,textarea"), `${context}: label target`).toBe(true)
  }
  for (const element of scope.querySelectorAll<HTMLElement>("[aria-labelledby],[aria-describedby],[aria-errormessage]")) {
    for (const attribute of ["aria-labelledby", "aria-describedby", "aria-errormessage"] as const) {
      const value = element.getAttribute(attribute)
      if (!value) continue
      // A hidden error message may be absent until validation becomes active.
      if (attribute === "aria-errormessage" && element.getAttribute("aria-invalid") !== "true") continue
      for (const id of value.split(/\s+/).filter(Boolean)) {
        expect(document.getElementById(id), `${context}: ${attribute}=${id}`).not.toBeNull()
      }
    }
  }
  // Collapsed/lazy content can be deliberately unmounted. An active target cannot.
  for (const element of scope.querySelectorAll<HTMLElement>("[aria-controls]")) {
    if (element.getAttribute("aria-expanded") !== "true" && element.getAttribute("aria-selected") !== "true") continue
    for (const id of (element.getAttribute("aria-controls") ?? "").split(/\s+/).filter(Boolean)) {
      expect(document.getElementById(id), `${context}: active aria-controls=${id}`).not.toBeNull()
    }
  }
}

const svgUrlProperties = ["fill", "stroke", "filter", "clip-path", "mask", "mask-image", "marker-start", "marker-mid", "marker-end", "background-image", "backdrop-filter"] as const
const svgReferenceAttributes = ["fill", "stroke", "filter", "clip-path", "mask", "marker-start", "marker-mid", "marker-end"] as const

function localSvgIds(value: string) {
  const found: string[] = []
  for (const match of value.matchAll(/url\(\s*(?:"([^"]+)"|'([^']+)'|([^)]*))\s*\)/g)) {
    const reference = (match[1] ?? match[2] ?? match[3] ?? "").trim()
    if (!reference.includes("#")) continue
    try {
      const url = new URL(reference, document.baseURI)
      if (url.origin === location.origin && url.pathname === location.pathname && url.search === location.search && url.hash) {
        found.push(decodeURIComponent(url.hash.slice(1)))
      }
    } catch { /* A malformed URL cannot be a local definition. */ }
  }
  return found
}

function localHrefId(value: string) {
  if (!value.includes("#")) return null
  try {
    const url = new URL(value, document.baseURI)
    return url.origin === location.origin && url.pathname === location.pathname && url.search === location.search && url.hash
      ? decodeURIComponent(url.hash.slice(1)) : null
  } catch { return null }
}

function inspectSvgReferences(preview: HTMLElement, context: string) {
  const checkTarget = (id: string, property: string, expected?: string) => {
    const target = document.getElementById(id)
    expect(target, `${context}: ${property} points to missing #${id}`).not.toBeNull()
    const sharedGlassSeed = Boolean(target?.closest('[data-slot="glass-seed"]'))
    expect(preview.contains(target) || sharedGlassSeed, `${context}: ${property} crosses example boundary #${id}`).toBe(true)
    if (!sharedGlassSeed) expect(target instanceof SVGElement, `${context}: ${property} target is SVG #${id}`).toBe(true)
    if (expected && !sharedGlassSeed) expect(target?.localName, `${context}: ${property} target type #${id}`).toBe(expected)
    if (["fill", "stroke"].includes(property) && !sharedGlassSeed) {
      expect(["linearGradient", "radialGradient", "pattern"], `${context}: paint server #${id}`).toContain(target?.localName)
    }
  }
  for (const node of preview.querySelectorAll<SVGElement>("svg, svg *")) {
    for (const attribute of svgReferenceAttributes) {
      for (const id of localSvgIds(node.getAttribute(attribute) ?? "")) {
        const targetKind = attribute === "filter" ? "filter" : attribute === "clip-path" ? "clipPath" : attribute === "mask" ? "mask" : attribute.startsWith("marker-") ? "marker" : undefined
        checkTarget(id, attribute, targetKind)
      }
    }
    const href = node.getAttribute("href") ?? node.getAttribute("xlink:href")
    const hrefId = href ? localHrefId(href) : null
    if (hrefId) checkTarget(hrefId, "href")
    for (const id of localSvgIds(node.getAttribute("style") ?? "")) checkTarget(id, "inline style")
    const computed = getComputedStyle(node)
    for (const property of svgUrlProperties) {
      for (const id of localSvgIds(computed.getPropertyValue(property))) {
        const targetKind = property === "filter" || property === "backdrop-filter" ? "filter" : property === "clip-path" ? "clipPath" : property === "mask" || property === "mask-image" ? "mask" : property.startsWith("marker-") ? "marker" : undefined
        checkTarget(id, property === "fill" || property === "stroke" ? property : `computed ${property}`, targetKind)
      }
    }
  }
  // Class-based filter/backdrop effects on HTML can also reference SVG defs.
  for (const node of preview.querySelectorAll<HTMLElement>('.ex-glass,[style*="url("]')) {
    for (const id of localSvgIds(node.getAttribute("style") ?? "")) checkTarget(id, "inline style")
    const computed = getComputedStyle(node)
    for (const property of ["filter", "backdrop-filter", "mask-image", "background-image"] as const) {
      for (const id of localSvgIds(computed.getPropertyValue(property))) checkTarget(id, `computed ${property}`)
    }
  }
}

function hasRealContent(preview: HTMLElement) {
  for (const node of preview.querySelectorAll<HTMLElement>("*")) {
    const rect = node.getBoundingClientRect()
    const style = getComputedStyle(node)
    if (!rect.width || !rect.height || style.display === "none" || style.visibility === "hidden") continue
    if (Array.from(node.childNodes).some(child => child.nodeType === Node.TEXT_NODE && child.textContent?.trim())) return true
    if (node.matches('button,input,select,textarea,svg,img,canvas,video,audio,iframe,[role="progressbar"],[role="meter"]')) return true
    // Skeletons, color swatches and preview surfaces can be meaningful without text.
    if (node.childElementCount === 0 && (
      (style.backgroundColor !== "rgba(0, 0, 0, 0)" && style.backgroundColor !== "transparent") ||
      style.backgroundImage !== "none" ||
      (parseFloat(style.borderTopWidth) > 0 && style.borderTopStyle !== "none")
    )) return true
  }
  return false
}

it("rejects an empty Component even when Preview supplies a painted wrapper", () => {
  const empty = document.createElement("div")
  empty.className = "showcase-preview"
  empty.append(document.createElement("div"))
  document.body.append(empty)
  try {
    expect(hasRealContent(empty)).toBe(false)
    const control = document.createElement("button")
    control.textContent = "Real action"
    empty.append(control)
    expect(hasRealContent(empty)).toBe(true)
  } finally { empty.remove() }
})

it("rejects dangling SVG paint references and definitions from another example", () => {
  const first = document.createElement("div")
  const second = document.createElement("div")
  first.innerHTML = '<svg><rect width="10" height="10" fill="url(#acceptance-gradient)" /></svg>'
  second.innerHTML = '<svg><defs><linearGradient id="acceptance-gradient" /></defs></svg>'
  document.body.append(first, second)
  try {
    expect(() => inspectSvgReferences(first, "fixture")).toThrow()
    first.append(second.firstElementChild!)
    expect(() => inspectSvgReferences(first, "fixture")).not.toThrow()
  } finally { first.remove(); second.remove() }
})

describe.skipIf(window.innerWidth < 1000)("full Showcase example coverage", () => {
  it("retains the 86 upstream component and three ExUI module routes", () => {
    expect(catalogPages.filter(item => item.group === "components")).toHaveLength(86)
    expect(catalogPages.filter(item => item.group === "exui")).toHaveLength(3)
  })

  for (const language of ["en", "zh-CN"] as const) for (const entry of catalogPages) {
    it(`${language}: ${entry.group}/${entry.id} renders every adapted example`, async () => {
      await expect.poll(() => container.querySelector("[data-page-loaded]")?.getAttribute("data-page-loaded")).toBe("glass")
      await page.getByRole("combobox", { name: "Language" }).selectOptions(language)
      await expect.poll(() => document.documentElement.lang).toBe(language)
      const failures: string[] = []
      const renderErrors: string[] = []
      const originalConsoleError = console.error
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
        renderErrors.push(args.map(value => value instanceof Error ? value.stack ?? value.message : String(value)).join(" "))
        originalConsoleError(...args)
      })
      const onError = (event: ErrorEvent) => failures.push(event.message)
      const onRejection = (event: PromiseRejectionEvent) => failures.push(String(event.reason))
      const onResourceError = (event: Event) => {
        if (event.target instanceof HTMLImageElement || event.target instanceof HTMLScriptElement || event.target instanceof HTMLLinkElement) {
          failures.push(`resource: ${event.target instanceof HTMLImageElement ? event.target.currentSrc : event.target instanceof HTMLScriptElement ? event.target.src : event.target.href}`)
        }
      }
      const onTimingBufferFull = () => failures.push("resource timing buffer full; response status coverage incomplete")
      window.addEventListener("error", onError)
      window.addEventListener("error", onResourceError, true)
      window.addEventListener("unhandledrejection", onRejection)
      performance.setResourceTimingBufferSize(10000)
      performance.clearResourceTimings()
      performance.addEventListener("resourcetimingbufferfull", onTimingBufferFull)
      try {
        const navigationStart = performance.now()
        location.hash = pageHref(entry)
        await expect.poll(() => container.querySelector("[data-page-loaded]")?.getAttribute("data-page-loaded"), { timeout: 20000 }).toBe(entry.id)
        const loadedAt = performance.now()
        const loaded = container.querySelector(`[data-page-loaded="${entry.id}"]`)!
        const expected = examples.filter(item => item.family === entry.id && item.status === "adapted")
          .sort((a, b) => a.order - b.order).map(item => item.id)
        await expect.poll(() => idsIn(loaded).length, { timeout: 20000 }).toBeGreaterThanOrEqual(expected.length)
        const official = Array.from(loaded.querySelectorAll<HTMLElement>("[data-example-id]:not([data-example-kind])"))
        expect(official.map(node => node.dataset.exampleId), `${entry.id}: ordered official IDs`).toEqual(expected)
        const extensions = Array.from(loaded.querySelectorAll<HTMLElement>('[data-example-kind="exui-extension"]'))
        if (entry.group === "components" && expected.length === 0) expect(extensions.length, `${entry.id}: all-gap family needs a real extension`).toBeGreaterThan(0)
        expect(idsIn(loaded), `${entry.id}: official IDs only`).toEqual(expected)
        expect(extensions.every(node => !node.hasAttribute("data-example-id")), `${entry.id}: extensions have no official ID`).toBe(true)
        expect(loaded.querySelector('[data-page-error="true"]'), entry.id).toBeNull()
        expect(loaded.querySelector(".showcase-preview"), `${entry.id}: real preview`).not.toBeNull()
        for (const preview of loaded.querySelectorAll<HTMLElement>(".showcase-preview")) {
          preview.scrollIntoView({ block: "center" })
          await expect.poll(() => preview.getBoundingClientRect().width).toBeGreaterThan(0)
          expect(preview.getBoundingClientRect().top, `${entry.id}/${preview.dataset.exampleId}: scroll`).toBeLessThan(innerHeight)
          expect(preview.getBoundingClientRect().bottom, `${entry.id}/${preview.dataset.exampleId}: scroll`).toBeGreaterThan(0)
          expect(preview.querySelector('[data-page-error="true"]'), preview.dataset.exampleId).toBeNull()
          // A mounted preview can precede effect-driven content such as Headless Tree rows.
          await expect.poll(() => hasRealContent(preview), {
            message: `${entry.id}/${preview.dataset.exampleId ?? "extension"}: empty scene`,
          }).toBe(true)
          inspectReferences(preview, `${entry.id}/${preview.dataset.exampleId}`)
          inspectSvgReferences(preview, `${entry.id}/${preview.dataset.exampleId ?? "extension"}`)
          for (const image of preview.querySelectorAll<HTMLImageElement>("img")) {
            image.scrollIntoView({ block: "nearest", inline: "center" })
            await expect.poll(() => image.complete, { timeout: 10000 }).toBe(true)
            expect(image.naturalWidth, `${entry.id}/${preview.dataset.exampleId}: ${image.src}`).toBeGreaterThan(0)
          }
        }
        inspectDocumentIds(entry.id)
        const resourceTimings = performance.getEntriesByType("resource") as PerformanceResourceTiming[]
        const hasResponseStatus = resourceTimings.some(item => typeof item.responseStatus === "number")
          || "responseStatus" in PerformanceResourceTiming.prototype
        const failedResponses = resourceTimings
          .filter(item => new URL(item.name).origin === location.origin && typeof item.responseStatus === "number" && item.responseStatus >= 400)
          .map(item => `${item.name}: ${item.responseStatus}`)
        expect(failedResponses, `${entry.id}: failed resource responses`).toEqual([])
        expect(failures, `${entry.id}: browser exceptions`).toEqual([])
        expect(renderErrors, `${entry.id}: console.error during mounted page`).toEqual([])
        if (["button", "button-group", "data-grid"].includes(entry.id)) {
          const checkedAt = performance.now()
          console.warn(`[Showcase acceptance metrics] ${entry.id}: examples=${expected.length} navigationToLoadedMs=${Math.round(loadedAt - navigationStart)} exampleCheckMs=${Math.round(checkedAt - loadedAt)} resources=${resourceTimings.length} responseStatusSupported=${hasResponseStatus} rendered=${loaded.querySelectorAll("*").length}`)
        }
      } finally {
        window.removeEventListener("error", onError)
        window.removeEventListener("error", onResourceError, true)
        window.removeEventListener("unhandledrejection", onRejection)
        performance.removeEventListener("resourcetimingbufferfull", onTimingBufferFull)
        consoleErrorSpy.mockRestore()
      }
    }, 120000)
  }
})
