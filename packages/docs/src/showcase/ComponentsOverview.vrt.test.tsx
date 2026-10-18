import { createRoot, type Root } from "react-dom/client"
import { page } from "vitest/browser"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import Showcase from "./Showcase"

let root: Root
let container: HTMLDivElement
let originalClass: string

async function captureOverview(path: string) {
  for (const card of Array.from(container.querySelectorAll("[data-overview-card]")).slice(0, 9)) {
    card.scrollIntoView({ block: "center" })
    await expect.poll(() => card.querySelector("[data-overview-loaded]")?.childElementCount).toBeGreaterThan(0)
  }
  await expect.poll(() => Array.from(container.querySelectorAll("img")).every((image) => image.complete && image.naturalWidth > 0)).toBe(true)
  await document.fonts.ready
  Object.assign(container.style, { width: "1280px", height: "900px", overflow: "hidden" })
  window.scrollTo(0, 0)
  await page.screenshot({ element: container, path })
}

beforeEach(() => {
  originalClass = document.documentElement.className
  localStorage.setItem("exui-showcase-language", "en")
  localStorage.removeItem("exui-showcase-theme")
  localStorage.removeItem("exui-showcase-density")
  history.replaceState(null, "", "#/components/")
  container = document.createElement("div")
  document.body.replaceChildren(container)
  root = createRoot(container)
})

afterEach(() => {
  root.unmount()
  document.documentElement.className = originalClass
  localStorage.removeItem("exui-showcase-language")
  localStorage.removeItem("exui-showcase-theme")
  localStorage.removeItem("exui-showcase-density")
})

describe.skipIf(window.innerWidth < 1000)("Components overview", () => {
  it.each(["", "#/components", "#/components/"])("opens the full overview from %s", async (hash) => {
    history.replaceState(null, "", `${location.pathname}${hash}`)
    root.render(<Showcase />)
    await expect.element(page.getByRole("heading", { name: "Components", level: 1, exact: true })).toBeVisible()
    await expect.element(page.getByTestId("components-overview")).toBeVisible()
    expect(location.hash).toBe("#/components/")
    const groups = container.querySelectorAll("[data-overview-group]")
    expect(groups).toHaveLength(2)
    expect(groups[0].querySelectorAll("a")).toHaveLength(86)
    expect(groups[1].querySelectorAll("a")).toHaveLength(5)
    for (const group of groups) {
      const names = Array.from(group.querySelectorAll("a"), (link) => link.textContent?.trim() ?? "")
      expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, "en")))
    }
    expect(container.querySelector('input[type="search"]')).toBeNull()
    expect(container.querySelector('[data-home-link][aria-current="page"]')).not.toBeNull()
    if (hash === "#/components/") {
      await page.getByRole("combobox", { name: "Language", exact: true }).selectOptions("zh-CN")
      await expect.element(page.getByRole("heading", { name: "组件", level: 1, exact: true })).toBeVisible()
      await captureOverview("../../../../output/components-overview-light.png")
    }
  })

  it("opens a component from its card and returns through the logo and browser history", async () => {
    root.render(<Showcase />)
    const overview = page.getByTestId("components-overview")
    await expect.element(overview).toBeVisible()
    await overview.getByRole("link", { name: "Button", exact: true }).click()
    await expect.element(page.getByRole("heading", { level: 1 })).toHaveTextContent("Button")
    expect(location.hash).toBe("#/components/button")
    await page.getByRole("link", { name: "ExUI", exact: true }).click()
    await expect.element(overview).toBeVisible()
    history.back()
    await expect.poll(() => location.hash).toBe("#/components/button")
    history.forward()
    await expect.poll(() => location.hash).toBe("#/components/")
    await overview.getByRole("link", { name: "ExItem", exact: true }).click()
    await expect.element(page.getByRole("heading", { level: 1 })).toHaveTextContent("ExItem")
    await expect.element(page.getByRole("heading", { level: 1 })).toBeVisible()
    await page.getByRole("link", { name: "All components", exact: true }).click()
    await expect.element(overview).toBeVisible()
  })

  it("updates real previews with settings while keeping one navigation target per card", async () => {
    root.render(<Showcase />)
    const overview = page.getByTestId("components-overview")
    await expect.element(overview).toBeVisible()
    const buttonCard = container.querySelector('[data-overview-card="button"]') as HTMLElement
    buttonCard.scrollIntoView({ block: "center" })
    await expect.poll(() => buttonCard.querySelector('[data-overview-loaded="button"] button')?.textContent).toBe("Default")
    const button = buttonCard.querySelector("button") as HTMLButtonElement
    const initialHeight = button.getBoundingClientRect().height
    const initialBackground = getComputedStyle(buttonCard).backgroundColor
    for (const [setting, value] of [["Theme", "dark"], ["Density", "compact"], ["Language", "zh-CN"]]) {
      await page.getByRole("combobox", { name: setting, exact: true }).selectOptions(value)
    }
    await expect.poll(() => button.textContent).toBe("默认")
    expect(buttonCard.querySelector("button")).toBe(button)
    expect(getComputedStyle(buttonCard).backgroundColor).not.toBe(initialBackground)
    expect(button.getBoundingClientRect().height).toBeLessThan(initialHeight)
    expect(button.closest("[inert][aria-hidden=true]")).not.toBeNull()
    expect(button.closest("a")).toBeNull()
    expect(buttonCard.querySelectorAll("a")).toHaveLength(1)
    expect(container.querySelector("main h1")?.textContent).toBe("组件")
    expect(location.hash).toBe("#/components/")
    await captureOverview("../../../../output/components-overview-dark.png")
  })

  it("loads a real preview for all 91 families without runtime failures", async () => {
    const errors: unknown[] = []
    const errorSpy = vi.spyOn(console, "error").mockImplementation((...args) => { errors.push(args) })
    try {
      root.render(<Showcase />)
      await expect.element(page.getByTestId("components-overview")).toBeVisible()
      const cards = Array.from(container.querySelectorAll<HTMLElement>("[data-overview-card]"))
      expect(cards).toHaveLength(91)
      for (const card of cards) {
        card.scrollIntoView({ block: "center" })
        await expect.poll(() => card.querySelector("[data-overview-loaded]")?.childElementCount, { message: card.dataset.overviewCard }).toBeGreaterThan(0)
        expect(card.querySelector("[data-overview-error]"), card.dataset.overviewCard).toBeNull()
      }
      const ids = Array.from(container.querySelectorAll("[id]"), (element) => element.id)
      expect(ids.length).toBe(new Set(ids).size)
      expect(errors).toEqual([])
    } finally { errorSpy.mockRestore() }
  }, 120000)
})
