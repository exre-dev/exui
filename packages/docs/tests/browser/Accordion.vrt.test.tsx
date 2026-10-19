import "../../src/showcase/ShowcaseStyles"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { LanguageContext, type ShowcaseLanguage } from "../../src/showcase/language"
import NestedExample from "../../src/showcase/examples/accordion/c-accordion-8"
import FAQExample from "../../src/showcase/examples/accordion/c-accordion-10"

let root: Root
let container: HTMLDivElement
let previousClasses: string

beforeEach(() => {
  previousClasses = document.documentElement.className
  container = document.createElement("div")
  container.style.width = "min(100%, 320px)"
  document.body.append(container)
  root = createRoot(container)
})

afterEach(() => {
  root.unmount()
  container.remove()
  document.documentElement.className = previousClasses
})

function clippedPixels(panel: HTMLElement) {
  const range = document.createRange()
  range.selectNodeContents(panel.firstElementChild!)
  const bounds = panel.getBoundingClientRect()
  return Math.max(0, ...Array.from(range.getClientRects(), rect => rect.bottom - bounds.bottom))
}

async function expectExpandedText(triggerName: string) {
  const trigger = page.getByRole("button", { name: triggerName, exact: true })
  await expect.element(trigger).toHaveAttribute("aria-expanded", "true")
  const button = Array.from(container.querySelectorAll<HTMLButtonElement>('[data-slot="accordion-trigger"]'))
    .find(button => button.textContent?.trim() === triggerName)!
  const panel = document.getElementById(button.getAttribute("aria-controls")!)!
  await document.fonts.ready
  expect(panel.textContent?.trim().length).toBeGreaterThan(0)
  await expect.poll(() => clippedPixels(panel), { timeout: 1500 }).toBeLessThanOrEqual(1)
  return panel
}

describe("Accordion expanded content geometry", () => {
  for (const language of ["en", "zh-CN"] satisfies ShowcaseLanguage[]) {
    for (const density of ["standard", "compact"]) {
      it(`keeps every FAQ answer visible after opening and reopening in ${language}/${density}`, async () => {
        document.documentElement.className = density === "compact" ? "density-compact" : ""
        root.render(<LanguageContext.Provider value={{ language, setLanguage: () => {} }}><FAQExample /></LanguageContext.Provider>)
        await expectExpandedText("Can I use this for my project?")
        for (const name of ["Is there a Figma file available?", "How do I contribute to ReUI?"]) {
          await page.getByRole("button", { name, exact: true }).click()
          await expectExpandedText(name)
        }
        const trigger = page.getByRole("button", { name: "How do I contribute to ReUI?", exact: true })
        await trigger.click()
        await expect.element(trigger).toHaveAttribute("aria-expanded", "false")
        await trigger.click()
        await expectExpandedText("How do I contribute to ReUI?")
      })

      it(`keeps nested text inside both panels as the inner item and width change in ${language}/${density}`, async () => {
        document.documentElement.className = density === "compact" ? "density-compact" : ""
        root.render(<LanguageContext.Provider value={{ language, setLanguage: () => {} }}><NestedExample /></LanguageContext.Provider>)
        await expectExpandedText("Technical Specifications")
        await expectExpandedText("Additional Details")
        await page.getByRole("button", { name: "Compatibility", exact: true }).click()
        await expectExpandedText("Compatibility")
        await expectExpandedText("Additional Details")
        container.style.width = "240px"
        await expectExpandedText("Compatibility")
        await expectExpandedText("Additional Details")
      })
    }
  }
})
