import "../../app/styles/docs.css"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { ComponentExamplesHost } from "../../app/components/ComponentExamplesHost"
import { LanguageContext, type ShowcaseLanguage } from "../../src/showcase/language"

let root: Root
let container: HTMLDivElement
let originalClasses: string

beforeEach(() => {
  originalClasses = document.documentElement.className
  container = document.createElement("div")
  container.className = "docs-app docs-examples"
  document.body.append(container)
  root = createRoot(container)
})

afterEach(() => {
  root.unmount()
  container.remove()
  document.documentElement.className = originalClasses
})

function render(language: ShowcaseLanguage, density: "standard" | "compact") {
  root.render(<LanguageContext.Provider value={{ language, setLanguage: () => {} }}>
    <ComponentExamplesHost family="glass" density={density} />
  </LanguageContext.Provider>)
}

// Resolve the public Token in the same theme, without assuming a CSS colour serializer.
function materialBackground() {
  const probe = document.createElement("span")
  probe.style.backgroundColor = "var(--exui-glass-background)"
  container.append(probe)
  const background = getComputedStyle(probe).backgroundColor
  probe.remove()
  return background
}

function expectMaterial(element: Element) {
  expect(element.classList.contains("ex-glass")).toBe(true)
  expect(getComputedStyle(element).backgroundColor).toBe(materialBackground())
  expect(getComputedStyle(element).backdropFilter).toContain("blur(16px)")
}

describe("Glass in the production docs stylesheet", () => {
  for (const theme of ["light", "dark", "pitch-black"]) {
    for (const density of ["standard", "compact"] as const) {
      it(`keeps the card translucent and the draft intact when toggled in ${theme}/${density}`, async () => {
        document.documentElement.className = theme === "pitch-black" ? "dark pitch-black" : theme
        render("zh-CN", density)
        await expect.poll(() => container.querySelector('[data-page-loaded="glass"] [data-slot="card"]')).not.toBeNull()
        const card = container.querySelector('[data-page-loaded="glass"] [data-slot="card"]')!
        expectMaterial(card)
        expect(getComputedStyle(card.parentElement!).backgroundImage).toContain("repeating-linear-gradient")

        const input = page.getByRole("textbox", { name: "合集名称", exact: true })
        await input.fill("Retained collection")
        await page.getByRole("switch", { name: "Glass", exact: true }).click()
        expect(card.classList.contains("ex-glass")).toBe(false)
        expect(getComputedStyle(card).backgroundColor).not.toBe(materialBackground())
        await page.getByRole("switch", { name: "Glass", exact: true }).click()
        expectMaterial(card)
        await expect.element(input).toHaveValue("Retained collection")
      })
    }
  }

  it("keeps portaled sharing and archive surfaces translucent", async () => {
    document.documentElement.className = "light"
    render("en", "standard")
    await page.getByRole("button", { name: "Share", exact: true }).click()
    await expect.poll(() => document.querySelector('[data-slot="popover-content"]')).not.toBeNull()
    expectMaterial(document.querySelector('[data-slot="popover-content"]')!)
    await userEvent.keyboard("{Escape}")
    await page.getByRole("button", { name: "Archive", exact: true }).click()
    await expect.element(page.getByRole("dialog")).toBeVisible()
    expectMaterial(document.querySelector('[data-slot="dialog-content"]')!)
  })
})
