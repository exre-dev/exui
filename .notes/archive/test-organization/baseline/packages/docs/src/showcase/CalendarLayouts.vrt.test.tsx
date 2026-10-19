import "./ShowcaseStyles"

import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { ComponentExamplesHost } from "../../app/components/ComponentExamplesHost"
import { LanguageContext, type ShowcaseLanguage } from "./language"

let root: Root
let container: HTMLDivElement
let previousClasses: string

beforeEach(() => {
  previousClasses = document.documentElement.className
  document.documentElement.className = "light"
  container = document.createElement("div")
  container.className = "docs-examples"
  container.style.cssText = "width:850px;max-width:100%"
  document.body.replaceChildren(container)
  root = createRoot(container)
})

afterEach(() => {
  root.unmount()
  document.documentElement.className = previousClasses
})

async function render(language: ShowcaseLanguage, density: "standard" | "compact") {
  root.render(<LanguageContext.Provider value={{ language, setLanguage: () => {} }}>
    <ComponentExamplesHost family="calendar" density={density} />
  </LanguageContext.Provider>)
  await expect.poll(() => container.querySelectorAll("[data-example-id]").length).toBe(30)
  await document.fonts.ready
}

async function layout() {
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
}

describe("Calendar example layouts", () => {
  for (const language of ["en", "zh-CN"] as const) for (const density of ["standard", "compact"] as const) {
    it(`fits every ${language}/${density} preview at desktop and narrow container widths`, async () => {
      await render(language, density)
      for (const width of [850, 540, 342, 272]) {
        container.style.width = `${width}px`
        await layout()
        const previews = [...container.querySelectorAll<HTMLElement>("[data-example-id]")]
        // Check the reported appointment example first, then the rest of the family.
        previews.sort((a, b) => Number(b.dataset.exampleId === "c-calendar-19") - Number(a.dataset.exampleId === "c-calendar-19"))
        await expect.poll(() => previews.filter(preview => preview.scrollWidth > preview.clientWidth + 1)
          .map(preview => `${preview.dataset.exampleId} overflows at ${width}px by ${preview.scrollWidth - preview.clientWidth}px`))
          .toEqual([])
        if (width === 850 && window.innerWidth >= 1000) {
          const first = container.querySelector('[data-docs-example-card="c-calendar-1"]')!.getBoundingClientRect()
          const second = container.querySelector('[data-docs-example-card="c-calendar-2"]')!.getBoundingClientRect()
          const booking = container.querySelector('[data-docs-example-card="c-calendar-19"]')!.getBoundingClientRect()
          expect(first.top).toBeCloseTo(second.top, 1)
          expect(first.right).toBeLessThan(second.left)
          expect(booking.width).toBeGreaterThan(first.width * 1.9)
        }
        if (width <= 342) {
          for (const id of ["c-calendar-20", "c-calendar-21"]) {
            const months = container.querySelectorAll(`[data-example-id="${id}"] [role="grid"]`)
            expect(months.length).toBe(2)
            expect(months[1].getBoundingClientRect().top).toBeGreaterThan(months[0].getBoundingClientRect().bottom)
          }
        }
      }
    })
  }

  it("retains the selected appointment and every time slot when its panels stack", async () => {
    await render("zh-CN", "standard")
    const card = container.querySelector<HTMLElement>('[data-docs-example-card="c-calendar-19"]')!
    const booking = page.elementLocator(card)
    const date = booking.getByRole("button", { name: /2026年2月12日/ })
    await date.click()
    await booking.getByRole("button", { name: "09:30", exact: true }).click()
    const button = date.element()
    container.style.width = "272px"
    await layout()
    expect(date.element()).toBe(button)
    await expect.element(date).toHaveAttribute("data-selected-single", "true")
    const footer = card.querySelector('[data-slot="card-footer"]')!
    expect(footer.textContent).toContain("09:30")
    const slots = [...card.querySelectorAll("button")].filter(item => /^\d{2}:\d{2}$/.test(item.textContent ?? ""))
    expect(slots.length).toBe(37)
    const calendar = card.querySelector('[data-slot="calendar"]')!.getBoundingClientRect()
    expect(slots[0].getBoundingClientRect().top).toBeGreaterThan(calendar.bottom)
    expect(card.querySelector<HTMLElement>("[data-example-id]")!.scrollWidth - card.clientWidth).toBeLessThanOrEqual(1)
    await expect.element(booking.getByRole("button", { name: "确认", exact: true })).toBeEnabled()
  })
})
