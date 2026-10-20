import "../../src/showcase/ShowcaseStyles"
import type { CSSProperties } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { Attachment, AttachmentMedia } from "@exre/exui"
import { LanguageContext } from "../../src/showcase/language"
import AttachmentExample from "../../src/showcase/examples/attachment/c-attachment-1"

let root: Root
let container: HTMLDivElement
let originalFontSize: string

beforeEach(async () => {
  container = document.createElement("div")
  document.body.append(container)
  root = createRoot(container)
  originalFontSize = document.documentElement.style.fontSize
  await document.fonts.ready
})
afterEach(() => {
  root.unmount()
  container.remove()
  document.documentElement.style.fontSize = originalFontSize
})

function radii(element: HTMLElement) {
  const style = getComputedStyle(element)
  return [style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomRightRadius, style.borderBottomLeftRadius]
}

function expectConcentricCorners(card: HTMLElement, media: HTMLElement) {
  const outer = card.getBoundingClientRect()
  const inner = media.getBoundingClientRect()
  const insetX = inner.left - outer.left
  const insetY = inner.top - outer.top
  const cardRadii = radii(card).map(parseFloat)
  const mediaRadii = radii(media).map(parseFloat)
  expect(insetX).toBeGreaterThan(0)
  expect(insetY).toBeCloseTo(insetX, 0)
  for (let corner = 0; corner < 4; corner++) {
    const expected = Math.max(0, cardRadii[corner] - insetX)
    expect(Math.abs(mediaRadii[corner] - expected), `corner ${corner}: outer=${cardRadii[corner]}, inset=${insetX}, inner=${mediaRadii[corner]}`).toBeLessThanOrEqual(0.5)
    expect(mediaRadii[corner]).toBeLessThan(cardRadii[corner])
  }
}

describe("Attachment radius", () => {
  it("aligns the icon background's corner centers with the card by reducing its radius", async () => {
    root.render(<Attachment><AttachmentMedia /></Attachment>)
    await expect.poll(() => container.querySelector('[data-slot="attachment-media"]')).not.toBeNull()
    const card = container.querySelector<HTMLElement>('[data-slot="attachment"]')!
    const icon = card.querySelector<HTMLElement>('[data-slot="attachment-media"]')!
    expectConcentricCorners(card, icon)
  })

  it("follows card corners across sizes, orientations, densities and root font sizes", async () => {
    for (const fontSize of [16, 32]) for (const density of ["standard", "compact"]) for (const size of ["default", "sm", "xs"] as const) for (const orientation of ["horizontal", "vertical"] as const) {
      document.documentElement.style.fontSize = `${fontSize}px`
      root.render(<div className={density === "compact" ? "density-compact" : ""}>
        <Attachment size={size} orientation={orientation}><AttachmentMedia variant="image" /></Attachment>
      </div>)
      await expect.poll(() => container.querySelector('[data-slot="attachment"]')?.getAttribute("data-orientation")).toBe(orientation)
      await expect.poll(() => container.querySelector('[data-slot="attachment"]')?.getAttribute("data-size")).toBe(size)
      const card = container.querySelector<HTMLElement>('[data-slot="attachment"]')!
      const media = card.querySelector<HTMLElement>('[data-slot="attachment-media"]')!
      expectConcentricCorners(card, media)
    }
  })

  it("accounts for a scoped radius token while allowing an explicit media override", async () => {
    const style = { "--radius": "0.75rem" } as CSSProperties
    root.render(<Attachment style={style}><AttachmentMedia /></Attachment>)
    await expect.poll(() => container.querySelector('[data-slot="attachment-media"]')).not.toBeNull()
    const card = container.querySelector<HTMLElement>('[data-slot="attachment"]')!
    const media = card.querySelector<HTMLElement>('[data-slot="attachment-media"]')!
    expectConcentricCorners(card, media)
    root.render(<Attachment style={style}><AttachmentMedia className="rounded-none" /></Attachment>)
    await expect.poll(() => radii(media)).toEqual(["0px", "0px", "0px", "0px"])
  })

  it("keeps the reported assistant-reply example aligned in both locales", async () => {
    for (const language of ["en", "zh-CN"] as const) {
      root.render(<LanguageContext.Provider value={{ language, setLanguage: () => {} }}><AttachmentExample /></LanguageContext.Provider>)
      await expect.poll(() => container.querySelector('[data-slot="attachment-media"]')).not.toBeNull()
      const card = container.querySelector<HTMLElement>('[data-slot="attachment"]')!
      expectConcentricCorners(card, card.querySelector<HTMLElement>('[data-slot="attachment-media"]')!)
    }
    if (window.innerWidth >= 1000) {
      Object.assign(container.style, { width: "28rem", padding: "1rem", background: "var(--background)" })
      await page.screenshot({ element: container, path: "../../../../output/attachment-radius.png" })
    }
  })
})
