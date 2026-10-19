import "./ShowcaseStyles"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import ContactExample from "./examples/radio-group/c-radio-group-9"

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

describe("RadioGroup field selection appearance", () => {
  for (const theme of ["light", "dark", "pitch-black"]) {
    for (const density of ["standard", "compact"]) {
      it(`keeps contact labels transparent while selecting by label and keyboard in ${theme}/${density}`, async () => {
        document.documentElement.className = [
          theme === "light" ? "" : "dark",
          theme === "pitch-black" ? "pitch-black" : "",
          density === "compact" ? "density-compact" : "",
        ].join(" ")
        root.render(<ContactExample />)
        await expect.element(page.getByRole("radio").first()).toBeChecked()
        const radios = Array.from(container.querySelectorAll<HTMLButtonElement>('[role="radio"]'))
        expect(radios).toHaveLength(3)
        const labels = radios.map(radio => radio.closest("label")!)
        const expectTransparentLabels = () => {
          for (const label of labels) expect(getComputedStyle(label).backgroundColor).toBe("rgba(0, 0, 0, 0)")
        }
        expectTransparentLabels()
        for (const index of [1, 2, 0]) {
          const uncheckedBackground = getComputedStyle(radios[index]).backgroundColor
          await userEvent.click(labels[index])
          await expect.element(page.getByRole("radio").nth(index)).toBeChecked()
          expect(radios.filter(radio => radio.getAttribute("aria-checked") === "true")).toHaveLength(1)
          expect(getComputedStyle(radios[index]).backgroundColor).not.toBe(uncheckedBackground)
          expectTransparentLabels()
        }
        radios[0].focus()
        // Keep the key held while Radix moves focus asynchronously.
        await userEvent.keyboard("{ArrowDown>}")
        try {
          await expect.element(page.getByRole("radio").nth(1), { timeout: 1500 }).toBeChecked()
        } finally {
          await userEvent.keyboard("{/ArrowDown}")
        }
        expectTransparentLabels()
      })
    }
  }
})
