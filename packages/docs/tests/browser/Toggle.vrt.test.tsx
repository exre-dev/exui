import "../../src/showcase/ShowcaseStyles"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { Toggle, ToggleGroup, ToggleGroupItem } from "@exre/exui"
import DefaultToggle from "../../src/showcase/examples/toggle/c-toggle-1"
import OutlineToggle from "../../src/showcase/examples/toggle/c-toggle-2"
import MultipleGroup from "../../src/showcase/examples/toggle-group/c-toggle-group-1"
import SingleGroup from "../../src/showcase/examples/toggle-group/c-toggle-group-2"

let container: HTMLDivElement
let root: Root
let previousClasses: string
let motion: HTMLStyleElement

beforeEach(() => {
  previousClasses = document.documentElement.className
  container = document.createElement("div")
  document.body.append(container)
  motion = document.createElement("style")
  motion.textContent = '[data-test-toggle] * { transition: none !important; }'
  document.head.append(motion)
  container.setAttribute("data-test-toggle", "")
  root = createRoot(container)
})

afterEach(() => {
  root.unmount()
  container.remove()
  motion.remove()
  document.documentElement.className = previousClasses
})

describe("Toggle selection with docs utility layers", () => {
  for (const theme of ["light", "dark", "pitch-black"]) {
    for (const [name, Example] of [
      ["default toggle", DefaultToggle],
      ["outline toggle", OutlineToggle],
      ["multiple group", MultipleGroup],
      ["single outline group", SingleGroup],
    ] as const) {
      it(`shows hover and persistent selection for ${name} in ${theme}`, async () => {
        document.documentElement.className = theme === "light" ? "" : `dark ${theme === "pitch-black" ? "pitch-black" : ""}`
        root.render(<><Example /><button data-testid="pointer-away">Outside toggles</button></>)
        const selector = '[data-slot="toggle"], [data-slot="toggle-group-item"]'
        await expect.poll(() => container.querySelector(selector)).not.toBeNull()
        const toggle = container.querySelector<HTMLButtonElement>(selector)!
        const outside = page.getByTestId("pointer-away")
        if (toggle.dataset.state === "on") await userEvent.click(toggle)
        await expect.poll(() => toggle.dataset.state).toBe("off")
        await outside.hover()
        const idleBackground = getComputedStyle(toggle).backgroundColor

        const probe = document.createElement("span")
        probe.style.backgroundColor = "var(--muted)"
        container.append(probe)
        const selectedBackground = getComputedStyle(probe).backgroundColor
        probe.remove()
        expect(selectedBackground).not.toBe("rgba(0, 0, 0, 0)")
        expect(idleBackground).not.toBe(selectedBackground)

        await userEvent.hover(toggle)
        await expect.poll(() => getComputedStyle(toggle).backgroundColor).toBe(selectedBackground)
        await userEvent.click(toggle)
        await expect.poll(() => toggle.dataset.state).toBe("on")
        await outside.hover()
        await expect.poll(() => getComputedStyle(toggle).backgroundColor, { timeout: 500 }).toBe(selectedBackground)

        toggle.focus()
        await userEvent.keyboard(" ")
        await expect.poll(() => toggle.dataset.state).toBe("off")
        expect(getComputedStyle(toggle).backgroundColor).toBe(idleBackground)
        await userEvent.keyboard(" ")
        await expect.poll(() => toggle.dataset.state).toBe("on")
        expect(getComputedStyle(toggle).backgroundColor).toBe(selectedBackground)
      })
    }
  }

  for (const theme of ["light", "dark", "pitch-black"]) {
    it(`keeps Glass material and disabled guards in ${theme}`, async () => {
      document.documentElement.className = theme === "light" ? "" : `dark ${theme === "pitch-black" ? "pitch-black" : ""}`
      root.render(<>
        <Toggle glass defaultPressed data-testid="glass-toggle">Toggle</Toggle>
        <Toggle glass defaultPressed disabled data-testid="glass-disabled">Disabled</Toggle>
        <ToggleGroup type="single" defaultValue="selected" variant="outline">
          <ToggleGroupItem glass value="selected" data-testid="glass-group-item">Group</ToggleGroupItem>
        </ToggleGroup>
        <button data-testid="pointer-away">Outside toggles</button>
      </>)
      const toggle = page.getByTestId("glass-toggle")
      await expect.element(toggle).toHaveAttribute("data-state", "on")
      await page.getByTestId("pointer-away").hover()
      const fromVariable = (element: HTMLElement, variable: string) => {
        const probe = document.createElement("span")
        probe.style.backgroundColor = `var(${variable})`
        element.append(probe)
        const color = getComputedStyle(probe).backgroundColor
        probe.remove()
        return color
      }
      for (const id of ["glass-toggle", "glass-group-item"]) {
        const element = page.getByTestId(id).element() as HTMLElement
        expect(getComputedStyle(element).backgroundColor).toBe(fromVariable(element, "--_exui-glass-selected-background"))
      }
      const disabled = page.getByTestId("glass-disabled").element() as HTMLElement
      expect(getComputedStyle(disabled).backgroundColor).toBe(fromVariable(disabled, "--_exui-glass-default-background"))
      await toggle.click()
      await page.getByTestId("pointer-away").hover()
      const element = toggle.element() as HTMLElement
      expect(getComputedStyle(element).backgroundColor).toBe(fromVariable(element, "--_exui-glass-default-background"))
      await toggle.hover()
      expect(getComputedStyle(element).backgroundColor).toBe(fromVariable(element, "--_exui-glass-hover-background"))
    })
  }
})
