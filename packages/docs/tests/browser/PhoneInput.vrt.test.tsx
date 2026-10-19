import "../../src/showcase/ShowcaseStyles"
import { Input } from "@exre/exui"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { LanguageContext } from "../../src/showcase/language"
import { ComponentExamplesHost } from "../../app/components/ComponentExamplesHost"
import Basic from "../../src/showcase/examples/phone-input/c-phone-input-1"
import Small from "../../src/showcase/examples/phone-input/c-phone-input-2"
import Large from "../../src/showcase/examples/phone-input/c-phone-input-3"
import Disabled from "../../src/showcase/examples/phone-input/c-phone-input-4"
import Preset from "../../src/showcase/examples/phone-input/c-phone-input-5"
import Invalid from "../../src/showcase/examples/phone-input/c-phone-input-6"
import Country from "../../src/showcase/examples/phone-input/c-phone-input-7"
import ReadOnly from "../../src/showcase/examples/phone-input/c-phone-input-8"

let container: HTMLDivElement
let root: Root
let previousClasses: string
let previousFontSize: string

beforeEach(() => {
  previousClasses = document.documentElement.className
  previousFontSize = document.documentElement.style.fontSize
  container = document.createElement("div")
  container.style.width = "min(100%, 24rem)"
  document.body.append(container)
  root = createRoot(container)
})

afterEach(() => {
  root.unmount()
  container.remove()
  document.documentElement.className = previousClasses
  document.documentElement.style.fontSize = previousFontSize
})

const examples = [Basic, Small, Large, Disabled, Preset, Invalid, Country, ReadOnly]

describe("PhoneInput surfaces with docs utility layers", () => {
  for (const theme of ["light", "dark", "pitch-black"]) {
    for (const density of ["standard", "compact"] as const) {
      it(`aligns both halves of every example in ${theme}/${density}`, async () => {
        document.documentElement.className = theme === "light" ? "" : `dark ${theme === "pitch-black" ? "pitch-black" : ""}`
        container.className = density === "compact" ? "density-compact" : ""
        root.render(<LanguageContext.Provider value={{ language: "en", setLanguage: () => {} }}>
          {examples.map((Example, index) => <div key={index}><Example /></div>)}
        </LanguageContext.Provider>)
        await expect.poll(() => container.querySelectorAll(".PhoneInput").length).toBe(8)

        for (const fontSize of [16, 32]) {
          document.documentElement.style.fontSize = `${fontSize}px`
          for (const [index, phone] of Array.from(container.querySelectorAll(".PhoneInput")).entries()) {
            const trigger = phone.querySelector<HTMLButtonElement>('[data-slot="combobox-trigger"]')!
            const input = phone.querySelector<HTMLInputElement>('[data-slot="input"]')!
            const height = (index === 1 ? 32 : index === 2 ? 40 : density === "compact" ? 32 : 36) * fontSize / 16
            await expect.poll(() => input.getBoundingClientRect().height).toBeCloseTo(height, 1)
            await expect.poll(() => trigger.getBoundingClientRect().height).toBeCloseTo(height, 1)
            expect(trigger.getBoundingClientRect().top).toBeCloseTo(input.getBoundingClientRect().top, 1)
            expect(trigger.getBoundingClientRect().right).toBeCloseTo(input.getBoundingClientRect().left, 1)
            expect(getComputedStyle(trigger).backgroundColor).toBe(getComputedStyle(input).backgroundColor)
          }
        }

        const disabled = container.querySelectorAll(".PhoneInput")[3]
        expect(disabled.querySelector<HTMLButtonElement>("button")!.disabled).toBe(true)
        expect(disabled.querySelector<HTMLInputElement>('[data-slot="input"]')!.disabled).toBe(true)
        expect(container.querySelectorAll(".PhoneInput")[5].querySelector("[aria-invalid=true]")).not.toBeNull()
        expect(container.querySelectorAll(".PhoneInput")[7].querySelector<HTMLInputElement>('[data-slot="input"]')!.readOnly).toBe(true)
      })

      it(`uses the Input appearance while searching and selecting countries in ${theme}/${density}`, async () => {
        document.documentElement.className = theme === "light" ? "" : `dark ${theme === "pitch-black" ? "pitch-black" : ""}`
        container.className = density === "compact" ? "density-compact" : ""
        root.render(<LanguageContext.Provider value={{ language: "en", setLanguage: () => {} }}>
          <ComponentExamplesHost family="phone-input" density={density} />
          <Input data-reference="search" placeholder="Reference input" />
        </LanguageContext.Provider>)
        await expect.poll(() => container.querySelector('[data-slot="combobox-trigger"]')).not.toBeNull()
        const trigger = container.querySelector<HTMLButtonElement>('[data-slot="combobox-trigger"]')!
        await page.elementLocator(trigger).click()
        await expect.poll(() => document.querySelector('[data-slot="combobox-content"] input')).not.toBeNull()
        const popup = document.querySelector<HTMLElement>('[data-slot="combobox-content"]')!
        const search = popup.querySelector<HTMLInputElement>("input")!
        const reference = container.querySelector<HTMLInputElement>('[data-reference="search"]')!
        expect(getComputedStyle(search).borderRadius).toBe(getComputedStyle(reference).borderRadius)
        expect(parseFloat(getComputedStyle(search).borderRadius)).toBeGreaterThan(0)
        expect(getComputedStyle(search).borderWidth).toBe(getComputedStyle(reference).borderWidth)
        expect(getComputedStyle(search).backgroundColor).toBe(getComputedStyle(reference).backgroundColor)
        expect(search.getBoundingClientRect().height).toBe(reference.getBoundingClientRect().height)
        expect(search.getBoundingClientRect().top).toBeGreaterThan(popup.getBoundingClientRect().top)
        expect(search.getBoundingClientRect().left).toBeGreaterThan(popup.getBoundingClientRect().left)

        await page.elementLocator(search).fill("United States")
        await expect.element(page.getByRole("option", { name: /United States/ })).toBeVisible()
        expect(document.querySelectorAll('[data-slot="combobox-item"]')).toHaveLength(1)
        await userEvent.keyboard("{ArrowDown}{Enter}")
        await expect.poll(() => trigger.getAttribute("aria-expanded")).toBe("false")
        expect(trigger.textContent).toContain("United States")

        await page.elementLocator(trigger).click()
        const reopened = document.querySelector<HTMLInputElement>('[data-slot="combobox-content"] input')!
        await page.elementLocator(reopened).fill("no-such-country")
        await expect.poll(() => document.querySelectorAll('[data-slot="combobox-item"]').length).toBe(0)
        await expect.element(page.getByText("No country found.", { exact: true })).toBeVisible()
        await userEvent.keyboard("{Escape}")
        await expect.poll(() => trigger.getAttribute("aria-expanded")).toBe("false")
      })
    }
  }
})
