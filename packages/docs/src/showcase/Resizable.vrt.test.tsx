import "./ShowcaseStyles"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import NestedResizable from "./examples/resizable/c-resizable-4"
import PlainResizable from "./examples/resizable/c-resizable-2"

let container: HTMLDivElement
let root: Root
let previousClasses: string

beforeEach(() => {
  previousClasses = document.documentElement.className
  container = document.createElement("div")
  container.style.width = "min(100%, 32rem)"
  document.body.append(container)
  root = createRoot(container)
})

afterEach(() => {
  root.unmount()
  container.remove()
  document.documentElement.className = previousClasses
})

describe("Resizable separators with docs utility layers", () => {
  for (const theme of ["light", "dark", "pitch-black"]) {
    for (const density of ["standard", "compact"]) {
      it(`shows and drags both nested separators in ${theme}, ${density}`, async () => {
        document.documentElement.className = theme === "light" ? "" : `dark ${theme === "pitch-black" ? "pitch-black" : ""}`
        container.className = density === "compact" ? "density-compact" : ""
        root.render(<NestedResizable />)
        await expect.poll(() => container.querySelectorAll('[role="separator"]').length).toBe(2)
        await document.fonts.ready

        const horizontal = container.querySelector<HTMLElement>('[role="separator"][aria-orientation="horizontal"]')!
        const nestedGroup = horizontal.parentElement!
        const top = horizontal.previousElementSibling as HTMLElement
        const bottom = horizontal.nextElementSibling as HTMLElement
        await expect.poll(() => horizontal.getBoundingClientRect().width).toBeGreaterThan(nestedGroup.getBoundingClientRect().width * 0.9)
        expect(horizontal.getBoundingClientRect().height).toBeGreaterThanOrEqual(1)
        expect(getComputedStyle(horizontal).backgroundColor).not.toBe("rgba(0, 0, 0, 0)")

        const initialHeight = top.getBoundingClientRect().height
        await userEvent.dragAndDrop(page.elementLocator(horizontal), page.elementLocator(bottom), { steps: 8 })
        await expect.poll(() => top.getBoundingClientRect().height).toBeGreaterThan(initialHeight + 20)

        const vertical = container.querySelector<HTMLElement>('[role="separator"][aria-orientation="vertical"]')!
        const left = vertical.previousElementSibling as HTMLElement
        expect(vertical.getBoundingClientRect().width).toBe(1)
        expect(getComputedStyle(vertical).backgroundColor).not.toBe("rgba(0, 0, 0, 0)")
        expect(vertical.getBoundingClientRect().height).toBeGreaterThan(250)
        const initialWidth = left.getBoundingClientRect().width
        await userEvent.dragAndDrop(page.elementLocator(vertical), page.elementLocator(left), { steps: 8 })
        await expect.poll(() => left.getBoundingClientRect().width).toBeLessThan(initialWidth - 20)

        horizontal.focus()
        const beforeKeyboard = top.getBoundingClientRect().height
        await userEvent.keyboard("{ArrowUp}")
        await expect.poll(() => top.getBoundingClientRect().height).toBeLessThan(beforeKeyboard)
      })

      it(`keeps a vertical separator visible without a grip in ${theme}, ${density}`, async () => {
        document.documentElement.className = theme === "light" ? "" : `dark ${theme === "pitch-black" ? "pitch-black" : ""}`
        container.className = density === "compact" ? "density-compact" : ""
        root.render(<PlainResizable />)
        await expect.poll(() => container.querySelector('[role="separator"]')).not.toBeNull()
        await document.fonts.ready
        const handle = container.querySelector<HTMLElement>('[role="separator"]')!
        await expect.poll(() => handle.getBoundingClientRect().width).toBe(1)
        expect(handle.getBoundingClientRect().height).toBeGreaterThan(150)
        expect(getComputedStyle(handle).backgroundColor).not.toBe("rgba(0, 0, 0, 0)")
      })
    }
  }
})
