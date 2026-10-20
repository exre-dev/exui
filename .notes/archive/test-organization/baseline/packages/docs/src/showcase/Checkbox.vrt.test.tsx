import "./ShowcaseStyles"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import CardExample from "./examples/checkbox/c-checkbox-9"
import SettingsExample from "./examples/checkbox/c-checkbox-10"

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

describe("Checkbox field selection appearance", () => {
  for (const theme of ["light", "dark", "pitch-black"]) {
    for (const density of ["standard", "compact"]) {
      for (const [name, Example] of [["card", CardExample], ["settings", SettingsExample]] as const) {
        it(`keeps ${name} labels transparent when toggled in ${theme}/${density}`, async () => {
          document.documentElement.className = [
            theme === "light" ? "" : "dark",
            theme === "pitch-black" ? "pitch-black" : "",
            density === "compact" ? "density-compact" : "",
          ].join(" ")
          root.render(<Example />)
          await expect.element(page.getByRole("checkbox").first()).toBeChecked()

          const checkboxes = Array.from(container.querySelectorAll<HTMLButtonElement>('[role="checkbox"]'))
          expect(checkboxes).toHaveLength(name === "card" ? 1 : 3)
          for (const [index, checkbox] of checkboxes.entries()) {
            const label = checkbox.closest("label")!
            const control = page.getByRole("checkbox").nth(index)
            expect(getComputedStyle(label).backgroundColor).toBe("rgba(0, 0, 0, 0)")
            if (checkbox.getAttribute("aria-checked") === "true") {
              await userEvent.click(label)
              await expect.element(control).not.toBeChecked()
            }
            const uncheckedBackground = getComputedStyle(checkbox).backgroundColor
            await userEvent.click(label)
            await expect.element(control).toBeChecked()
            expect(getComputedStyle(label).backgroundColor).toBe("rgba(0, 0, 0, 0)")
            expect(getComputedStyle(checkbox).backgroundColor).not.toBe(uncheckedBackground)
            await userEvent.keyboard(" ")
            await expect.element(control).not.toBeChecked()
            expect(getComputedStyle(label).backgroundColor).toBe("rgba(0, 0, 0, 0)")
          }
        })
      }
    }
  }
})
