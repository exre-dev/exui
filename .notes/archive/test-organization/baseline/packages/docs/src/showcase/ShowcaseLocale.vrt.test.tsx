import "@exre/exui/style.css"
import { createRoot, type Root } from "react-dom/client"
import { page } from "vitest/browser"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import Showcase from "./Showcase"

let root: Root
let container: HTMLDivElement

beforeEach(() => {
  localStorage.setItem("exui-showcase-language", "en")
  history.replaceState(null, "", "#/components/input")
  container = document.createElement("div")
  document.body.replaceChildren(container)
  root = createRoot(container)
  root.render(<Showcase />)
})

afterEach(() => {
  root?.unmount()
  localStorage.removeItem("exui-showcase-language")
  localStorage.removeItem("exui-showcase-theme")
  localStorage.removeItem("exui-showcase-density")
})

describe.skipIf(window.innerWidth < 1000)("Showcase page language", () => {
  it("changes language without replacing the page or its input draft", async () => {
    await expect.poll(() => container.querySelector('[data-example-id="c-input-1"] input[placeholder="Basic Input"]')).not.toBeNull()
    const originalInput = container.querySelector('[data-example-id="c-input-1"] input') as HTMLInputElement
    const input = page.elementLocator(originalInput)
    await input.fill("Persistent draft")
    const selector = page.getByRole("combobox", { name: "Language", exact: true }).element() as HTMLSelectElement
    selector.value = "zh-CN"
    selector.dispatchEvent(new Event("change", { bubbles: true }))
    await expect.poll(() => document.documentElement.lang).toBe("zh-CN")
    expect(location.hash).toBe("#/components/input")
    expect(container.querySelector('[data-nav-group="components"]')?.textContent).toContain("Components")
    await expect.poll(() => originalInput.value).toBe("Persistent draft")
    expect(container.querySelector('[data-example-id="c-input-1"] input')).toBe(originalInput)
    expect(originalInput.placeholder).toBe("基础输入框")
    expect(document.title).toBe("ExUI")
    await page.getByRole("link", { name: "Button", exact: true }).click()
    await expect.poll(() => container.querySelector('[data-example-id="c-button-44"] button')).not.toBeNull()
    const statusButton = container.querySelector('[data-example-id="c-button-44"] button') as HTMLButtonElement
    await page.elementLocator(statusButton).click()
    await expect.poll(() => statusButton.textContent?.trim()).toBe("已保存")
    const chineseSelector = page.getByRole("combobox", { name: "语言", exact: true }).element() as HTMLSelectElement
    chineseSelector.value = "en"
    chineseSelector.dispatchEvent(new Event("change", { bubbles: true }))
    await expect.poll(() => statusButton.textContent?.trim()).toBe("Saved")
    expect(container.querySelector('[data-example-id="c-button-44"] button')).toBe(statusButton)
  })

  it("restores the manual language and page address across mounts", async () => {
    await expect.element(page.getByRole("heading", { level: 1 })).toHaveTextContent("Input")
    localStorage.setItem("exui-showcase-language", "zh-CN")
    root.unmount()
    root = createRoot(container)
    root.render(<Showcase />)
    await expect.poll(() => document.documentElement.lang).toBe("zh-CN")
    await expect.element(page.getByRole("heading", { level: 1 })).toHaveTextContent("Input")
    await expect.element(page.getByRole("combobox", { name: "主题", exact: true })).toBeVisible()
    expect(location.hash).toBe("#/components/input")
  })
})
