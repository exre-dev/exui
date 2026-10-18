import "./ShowcaseStyles"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { LanguageContext, type ShowcaseLanguage } from "./language"
import VerticalExample from "./examples/scrollspy/c-scrollspy-1"
import HorizontalExample from "./examples/scrollspy/c-scrollspy-2"

let root: Root
let container: HTMLDivElement
let previousUrl: string
let previousHistoryState: unknown

beforeEach(() => {
  previousUrl = window.location.href
  previousHistoryState = window.history.state
  window.history.replaceState(previousHistoryState, "", window.location.pathname + window.location.search)
  container = document.createElement("div")
  container.style.width = "min(100%, 900px)"
  document.body.append(container)
  root = createRoot(container)
})

afterEach(() => {
  root.unmount()
  container.remove()
  window.history.replaceState(previousHistoryState, "", previousUrl)
})

function buttons(scope: HTMLElement) {
  return Array.from(scope.querySelectorAll<HTMLButtonElement>("[data-scrollspy-anchor]"))
}

async function expectActive(scope: HTMLElement, index: number) {
  await expect.poll(() => buttons(scope).findIndex(button => button.dataset.active === "true"), { timeout: 1500 }).toBe(index)
  expect(buttons(scope).filter(button => button.dataset.active === "true")).toHaveLength(1)
}

describe("Scrollspy example navigation", () => {
  for (const language of ["en", "zh-CN"] satisfies ShowcaseLanguage[]) {
    for (const [name, Example, firstSection] of [
      ["vertical", VerticalExample, 1],
      ["horizontal", HorizontalExample, 6],
    ] as const) {
      it(`tracks every section in both directions and scrolls on click in ${name}/${language}`, async () => {
        root.render(<LanguageContext.Provider value={{ language, setLanguage: () => {} }}><Example /></LanguageContext.Provider>)
        await expect.poll(() => buttons(container).length).toBe(5)
        await expectActive(container, 0)
        const viewport = container.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]')!
        const sections = Array.from({ length: 5 }, (_, index) => container.querySelector<HTMLElement>(`[id$="-section-${firstSection + index}"]`)!)

        for (const index of [1, 2, 3, 4, 3, 2, 1, 0]) {
          viewport.scrollTo({ top: viewport.scrollTop + sections[index].getBoundingClientRect().top - viewport.getBoundingClientRect().top, behavior: "instant" })
          await expectActive(container, index)
        }

        for (const [index, button] of buttons(container).entries()) {
          expect(document.getElementById(button.dataset.scrollspyAnchor!)).toBe(sections[index])
        }
        for (const index of [3, 1]) {
          await page.getByRole("button", { name: language === "en" ? `Section ${index + 1}` : `第 ${index + 1} 节`, exact: true }).click()
          await expect.poll(() => Math.abs(sections[index].getBoundingClientRect().top - viewport.getBoundingClientRect().top - 50), { timeout: 2000 }).toBeLessThanOrEqual(1)
          await expectActive(container, index)
        }
      })
    }
  }

  it("keeps repeated example instances independent", async () => {
    root.render(<><div data-example="first"><VerticalExample /></div><div data-example="second"><VerticalExample /></div></>)
    await expect.poll(() => buttons(container).length).toBe(10)
    const first = container.querySelector<HTMLElement>('[data-example="first"]')!
    const second = container.querySelector<HTMLElement>('[data-example="second"]')!
    await expectActive(first, 0)
    await expectActive(second, 0)
    const section = first.querySelector<HTMLElement>('[id$="-section-3"]')!
    const viewport = first.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]')!
    viewport.scrollTo({ top: viewport.scrollTop + section.getBoundingClientRect().top - viewport.getBoundingClientRect().top, behavior: "instant" })
    await expectActive(first, 2)
    await expectActive(second, 0)
    expect(buttons(first).map(button => button.dataset.scrollspyAnchor)).not.toEqual(buttons(second).map(button => button.dataset.scrollspyAnchor))
  })
})
