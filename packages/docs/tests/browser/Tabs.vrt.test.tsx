import "../../src/showcase/ShowcaseStyles"
import type { CSSProperties } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@exre/exui"
import VerticalExample from "../../src/showcase/examples/tabs/c-tabs-3"
import HorizontalExample from "../../src/showcase/examples/tabs/c-tabs-6"
import { LanguageContext } from "../../src/showcase/language"

let root: Root
let container: HTMLDivElement
let originalClasses: string
let originalFontSize: string

beforeEach(async () => {
  originalClasses = document.documentElement.className
  originalFontSize = document.documentElement.style.fontSize
  container = document.createElement("div")
  container.style.width = "min(100%, 640px)"
  document.body.append(container)
  root = createRoot(container)
  await document.fonts.ready
})

afterEach(() => {
  root.unmount()
  container.remove()
  document.documentElement.className = originalClasses
  document.documentElement.style.fontSize = originalFontSize
})

function corners(element: HTMLElement) {
  const style = getComputedStyle(element)
  const rect = element.getBoundingClientRect()
  return [style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomRightRadius, style.borderBottomLeftRadius]
    .map(value => Math.min(parseFloat(value), rect.width / 2, rect.height / 2))
}

function expectRoundedTrack(list: HTMLElement, vertical: boolean) {
  const items = Array.from(list.querySelectorAll<HTMLElement>('[data-slot="tabs-trigger"]'))
  const outer = list.getBoundingClientRect()
  for (const item of items) {
    const rect = item.getBoundingClientRect()
    for (const radius of corners(item)) expect(radius).toBeCloseTo(Math.min(rect.width, rect.height) / 2, 1)
  }
  const first = items[0].getBoundingClientRect()
  const last = items.at(-1)!.getBoundingClientRect()
  const expected = vertical ? first.height / 2 + first.top - outer.top : outer.height / 2
  for (const radius of corners(list)) expect(Math.abs(radius - expected)).toBeLessThanOrEqual(0.6)
  expect(first.left).toBeGreaterThanOrEqual(outer.left)
  expect(last.right).toBeLessThanOrEqual(outer.right + 0.1)
  expect(last.bottom).toBeLessThanOrEqual(outer.bottom + 0.1)
}

async function expectSelectionShadow(list: HTMLElement) {
  const items = Array.from(list.querySelectorAll<HTMLButtonElement>('[data-slot="tabs-trigger"]:not(:disabled)'))
  for (const index of [0, items.length - 1, 1]) {
    await userEvent.click(items[index])
    await expect.poll(() => items[index].getAttribute("data-state")).toBe("active")
    await expect.poll(() => getComputedStyle(items[index]).boxShadow).not.toBe("none")
    for (const item of items.filter(item => item !== items[index])) {
      await expect.poll(() => getComputedStyle(item).boxShadow).toBe("none")
    }
  }
}

describe("Tabs track and active item appearance", () => {
  for (const theme of ["light", "dark", "pitch-black"]) {
    for (const density of ["standard", "compact"]) {
      it(`keeps real example corners coordinated and shadows on the active item in ${theme}/${density}`, async () => {
        document.documentElement.className = `${theme === "light" ? "" : "dark"} ${theme === "pitch-black" ? "pitch-black" : ""} ${density === "compact" ? "density-compact" : ""}`
        for (const fontSize of [16, 24]) {
          document.documentElement.style.fontSize = `${fontSize}px`
          root.render(<LanguageContext.Provider value={{ language: "zh-CN", setLanguage: () => {} }}>
            <div data-testid="vertical"><VerticalExample /></div>
            <div data-testid="horizontal"><HorizontalExample /></div>
          </LanguageContext.Provider>)
          await expect.element(page.getByRole("tab").first()).toBeVisible()
          const lists = Array.from(container.querySelectorAll<HTMLElement>('[data-slot="tabs-list"]'))
          expect(lists).toHaveLength(2)
          await expect.poll(() => { expectRoundedTrack(lists[0], true); expectRoundedTrack(lists[1], false); return true }).toBe(true)
          for (const list of lists) await expectSelectionShadow(list)
          await expect.element(page.getByRole("tabpanel").last()).toHaveTextContent("分析图表和指标。")
        }
      })
    }
  }

  it("keeps line tabs flat and primary tabs raised with a visible keyboard focus ring", async () => {
    root.render(<>{(["line", "primary"] as const).map(variant => <Tabs key={variant} defaultValue="one">
      <TabsList variant={variant} style={variant === "primary" ? { "--exui-component-tabs-primary-selected-shadow": "0 1px 2px rgb(0 0 0 / 0.2)" } as CSSProperties : undefined}>
        <TabsTrigger value="one">One {variant}</TabsTrigger>
        <TabsTrigger value="two">Two {variant}</TabsTrigger>
        <TabsTrigger value="disabled" disabled>Disabled {variant}</TabsTrigger>
      </TabsList>
      <TabsContent value="one">First {variant}</TabsContent>
      <TabsContent value="two">Second {variant}</TabsContent>
    </Tabs>)}</>)
    await expect.element(page.getByRole("tab").first()).toBeVisible()
    const [line, primary] = Array.from(container.querySelectorAll<HTMLElement>('[data-slot="tabs-list"]'))
    const lineActive = line.querySelector<HTMLElement>('[data-state="active"]')!
    expect(getComputedStyle(lineActive).backgroundColor).toBe("rgba(0, 0, 0, 0)")
    expect(getComputedStyle(lineActive).boxShadow).toBe("none")
    expect(getComputedStyle(lineActive, "::after").opacity).toBe("1")
    await expectSelectionShadow(primary)
    expect(getComputedStyle(primary.querySelector<HTMLElement>('[data-state="active"]')!).boxShadow).toContain("rgba(0, 0, 0, 0.2)")
    expectRoundedTrack(primary, false)
    expect(getComputedStyle(primary.querySelector<HTMLElement>("[disabled]")!).boxShadow).toBe("none")
    await userEvent.keyboard("{ArrowLeft>}")
    try {
      await expect.poll(() => primary.querySelector<HTMLElement>('[data-state="active"]')?.textContent).toBe("One primary")
      await expect.poll(() => getComputedStyle(primary.querySelector<HTMLElement>('[data-state="active"]')!).boxShadow).toContain("3px")
    } finally {
      await userEvent.keyboard("{/ArrowLeft}")
    }
  })


})
