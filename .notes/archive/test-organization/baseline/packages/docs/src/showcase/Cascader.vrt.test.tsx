import "./ShowcaseStyles"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { LanguageContext } from "./language"
import CascaderExample from "./examples/cascader/c-cascader-2"

let root: Root
let previousClasses: string

beforeEach(() => {
  previousClasses = document.documentElement.className
  const container = document.createElement("div")
  document.body.replaceChildren(container)
  root = createRoot(container)
})

afterEach(() => {
  root.unmount()
  document.documentElement.className = previousClasses
})

describe("Cascader permission selection", () => {
  for (const theme of ["light", "dark", "pitch-black"]) for (const density of ["standard", "compact"]) {
    it(`shows selected checkmarks with Showcase utilities in ${theme}/${density}`, async () => {
      document.documentElement.className = [theme, theme === "pitch-black" ? "dark" : "", density === "compact" ? "density-compact" : ""].filter(Boolean).join(" ")
      root.render(<LanguageContext.Provider value={{ language: "en", setLanguage: () => {} }}><CascaderExample /></LanguageContext.Provider>)
      await document.fonts.ready
      await page.getByRole("combobox", { name: "Permissions", exact: true }).click()
      await page.getByRole("option", { name: /^Billing/ }).click()

      const invoice = page.getByRole("option", { name: "View invoices", exact: true })
      const subscription = page.getByRole("option", { name: "Manage subscription", exact: true })
      const refund = page.getByRole("option", { name: "Issue refunds", exact: true })
      for (const option of [invoice, subscription, refund]) {
        await option.click()
        await expect.element(option).toHaveAttribute("aria-selected", "true")
        const tick = option.element().querySelector<SVGElement>('[data-slot="cascader-item-tick"]')!
        await expect.poll(() => getComputedStyle(tick).opacity).toBe("1")
        expect(tick.getBoundingClientRect().width).toBeGreaterThan(0)
        expect(getComputedStyle(tick.querySelector("path")!).stroke).not.toBe(getComputedStyle(tick.parentElement!).backgroundColor)
      }

      await invoice.click()
      await expect.element(invoice).toHaveAttribute("aria-selected", "false")
      const invoiceTick = invoice.element().querySelector('[data-slot="cascader-item-tick"]')!
      await expect.poll(() => getComputedStyle(invoiceTick).opacity).toBe("0")
      await page.getByRole("button", { name: "Clear selection", exact: true }).click()
      await expect.element(subscription).toHaveAttribute("aria-selected", "false")
      await expect.element(refund).toHaveAttribute("aria-selected", "false")
      for (const option of [subscription, refund]) {
        const tick = option.element().querySelector('[data-slot="cascader-item-tick"]')!
        expect(getComputedStyle(tick).opacity).toBe("0")
      }
    })
  }
})
