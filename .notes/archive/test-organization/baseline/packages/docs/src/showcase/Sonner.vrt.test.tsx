import "./ShowcaseStyles"
import type { CSSProperties } from "react"
import { flushSync } from "react-dom"
import { createRoot, type Root } from "react-dom/client"
import { Toaster, toast } from "@exre/exui"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { examples } from "./examples/sonner/index.generated"

let root: Root
let container: HTMLDivElement
let previousClasses: string
let previousFont: string

beforeEach(() => {
  previousClasses = document.documentElement.className
  previousFont = document.documentElement.style.fontSize
  document.documentElement.style.fontSize = "16px"
  container = document.createElement("div")
  document.body.append(container)
  root = createRoot(container)
})

afterEach(() => {
  toast.dismiss()
  flushSync(() => root.unmount())
  container.remove()
  document.documentElement.className = previousClasses
  document.documentElement.style.fontSize = previousFont
})

function notification() {
  return container.querySelector<HTMLElement>('[data-sonner-toast]:not([data-removed="true"])')
}

function expectCardGeometry() {
  const item = notification()!
  const card = item.dataset.styled === "true" ? item : item.querySelector<HTMLElement>("[data-title] > div")!
  const probe = document.createElement("span")
  probe.style.borderRadius = "var(--border-radius)"
  item.append(probe)
  const expectedRadius = getComputedStyle(probe).borderTopLeftRadius
  probe.remove()
  const style = getComputedStyle(card)
  expect(expectedRadius).not.toBe("0px")
  for (const radius of [style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomLeftRadius, style.borderBottomRightRadius]) {
    expect(radius).toBe(expectedRadius)
  }
  expect(card.getBoundingClientRect().width).toBeCloseTo(item.getBoundingClientRect().width, 1)
  const bounds = card.getBoundingClientRect()
  expect(bounds.left).toBeGreaterThanOrEqual(-1)
  expect(bounds.right).toBeLessThanOrEqual(window.innerWidth + 1)
}

describe("Sonner example notification surfaces", () => {
  for (const { id, Component } of examples) {
    it(`keeps ${id} corners and width consistent with its Toaster`, async () => {
      flushSync(() => root.render(<><Toaster /><Component /></>))
      await expect.element(page.elementLocator(container).getByRole("button").first()).toBeVisible()
      const triggers = Array.from(container.querySelectorAll<HTMLButtonElement>("button"))
      for (const trigger of triggers) {
        await page.elementLocator(trigger).click()
        await expect.poll(notification).toBeTruthy()
        expectCardGeometry()
        toast.dismiss()
        await expect.poll(() => container.querySelectorAll("[data-sonner-toast]").length).toBe(0)
      }
    })
  }

  it("keeps the updatable card consistent through progress and success", async () => {
    const Component = examples.find(example => example.id === "c-sonner-21")!.Component
    flushSync(() => root.render(<><Toaster /><Component /></>))
    await page.elementLocator(container).getByRole("button").click()
    await expect.poll(notification).toBeTruthy()
    const item = notification()
    for (const message of ["Preparing upload...", "Uploading files... 30%", "Uploading files... 70%", "Upload complete!"]) {
      await expect.poll(() => notification()?.textContent, { timeout: 5000 }).toContain(message)
      expect(notification()).toBe(item)
      expectCardGeometry()
    }
  }, 10000)

  for (const theme of ["light", "dark", "pitch-black"]) {
    it(`scales every custom surface and respects a radius override in ${theme}`, async () => {
      document.documentElement.className = theme === "light" ? "" : theme === "dark" ? "dark" : "dark pitch-black"
      const customIds = new Set([9, 10, 11, 12, 13, 14, 15, 16, 17, 20, 21].map(value => `c-sonner-${value}`))
      for (const { id, Component } of examples.filter(example => customIds.has(example.id))) {
        const render = (style?: CSSProperties) => flushSync(() => root.render(<><Toaster style={style} /><Component key={id} /></>))
        render()
        await page.elementLocator(container).getByRole("button").first().click()
        await expect.poll(notification).toBeTruthy()
        for (const rootSize of [16, 21.328, 32]) {
          document.documentElement.style.fontSize = `${rootSize}px`
          await expect.poll(() => notification()!.getBoundingClientRect().width).toBeCloseTo(
            window.innerWidth <= 37.5 * rootSize ? window.innerWidth - 2 * rootSize : 22.25 * rootSize, 1,
          )
          expectCardGeometry()
        }
        render({ "--border-radius": "2rem" } as CSSProperties)
        expectCardGeometry()
        const card = notification()!.querySelector("[data-title] > div")!
        expect(getComputedStyle(card).borderTopLeftRadius).toBe("64px")
        toast.dismiss()
        await expect.poll(() => container.querySelectorAll("[data-sonner-toast]").length).toBe(0)
        document.documentElement.style.fontSize = "16px"
      }
    }, 30000)
  }
})
