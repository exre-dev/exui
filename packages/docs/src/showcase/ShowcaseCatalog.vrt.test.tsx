import "@exre/exui/style.css"
import { createRoot, type Root } from "react-dom/client"
import { page } from "vitest/browser"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import Showcase from "./Showcase"

let root: Root
let container: HTMLDivElement
let originalClass: string
let motionStyles: HTMLStyleElement

beforeEach(async () => {
  originalClass = document.documentElement.className
  localStorage.setItem("exui-showcase-language", "en")
  localStorage.removeItem("exui-showcase-theme")
  localStorage.removeItem("exui-showcase-density")
  history.replaceState(null, "", "#/components/button")
  container = document.createElement("div")
  container.dataset.testid = "showcase-catalog-fixture"
  document.body.replaceChildren(container)
  motionStyles = document.createElement("style")
  motionStyles.textContent = "*, *::before, *::after { animation: none !important; transition: none !important; }"
  document.head.append(motionStyles)
  root = createRoot(container)
  root.render(<Showcase />)
  await document.fonts.ready
})

afterEach(() => {
  root?.unmount()
  motionStyles.remove()
  document.documentElement.className = originalClass
  localStorage.removeItem("exui-showcase-language")
  localStorage.removeItem("exui-showcase-theme")
  localStorage.removeItem("exui-showcase-density")
})

describe.skipIf(window.innerWidth < 1000)("Showcase component pages", () => {
  it.each(["light", "dark", "pitch-black"])("records the desktop Button page in %s", async (theme) => {
    await expect.poll(() => container.querySelectorAll('[data-page-loaded="button"] [data-example-id]').length).toBe(61)
    const selector = page.getByRole("combobox", { name: "Theme", exact: true }).element() as HTMLSelectElement
    selector.value = theme
    selector.dispatchEvent(new Event("change", { bubbles: true }))
    await expect.poll(() => document.documentElement.classList.contains(theme)).toBe(true)
    Object.assign(container.style, { width: "1280px", height: "900px", overflow: "hidden" })
    await page.getByTestId("catalog-heading").hover()
    expect(container.querySelector(".showcase-sidebar :hover")).toBeNull()
    const bounds = container.getBoundingClientRect()
    console.warn(`[Showcase screenshot diagnostics] theme=${theme} selector=[data-testid=showcase-catalog-fixture] bounds=${Math.round(bounds.width)}x${Math.round(bounds.height)} scrollHeight=${container.scrollHeight} documentScrollHeight=${document.documentElement.scrollHeight} runningAnimations=${document.getAnimations().filter(animation => animation.playState === "running").length} devicePixelRatio=${window.devicePixelRatio}`)
    await expect.element(page.getByTestId("showcase-catalog-fixture")).toMatchScreenshot(`showcase-button-${theme}`)
  }, 60000)

  it("renders only the two desktop navigation groups and component previews", async () => {
    await expect.element(page.getByRole("heading", { level: 1 })).toHaveTextContent("Button")
    await expect.element(page.getByRole("navigation")).toBeVisible()
    expect(container.querySelectorAll("[data-nav-group]")).toHaveLength(2)
    expect(container.querySelector('[data-nav-group="exui"]')?.textContent).toContain("Blocks")
    // The examples can contain their own headings, code, and search fields.
    // Keep the shell free of the old catalog marketing and search UI.
    expect(container.querySelector('.showcase-topbar input[type="search"], .showcase-sidebar input[type="search"], .showcase-page > input[type="search"]')).toBeNull()
    expect(container.querySelectorAll(".showcase-page > h2, .showcase-page > h3, .showcase-page > pre, .showcase-page > section, .showcase-page > p")).toHaveLength(0)
    expect(container.querySelector(".showcase-page > h1")?.textContent).toBe("Button")
    expect(container.querySelector(".showcase-topbar")?.textContent).not.toMatch(/For AI Agents|Quality recipes|catalogue entries|Browse categories/)
    await expect.poll(() => container.querySelectorAll('[data-page-loaded="button"] [data-example-id]').length).toBe(61)
  })

  it("navigates to an independent ExUI page and restores browser history", async () => {
    await page.getByRole("link", { name: "Glass", exact: true }).click()
    await expect.element(page.getByRole("heading", { level: 1 })).toHaveTextContent("Glass")
    expect(location.hash).toBe("#/exui/glass")
    await page.getByRole("link", { name: "Form", exact: true }).click()
    await expect.element(page.getByRole("heading", { level: 1 })).toHaveTextContent("Form")
    history.back()
    await expect.poll(() => location.hash).toBe("#/exui/glass")
    await expect.element(page.getByRole("heading", { level: 1 })).toHaveTextContent("Glass")
    history.forward()
    await expect.poll(() => location.hash).toBe("#/exui/form")
  })

  it("preserves the current input through theme and density settings", async () => {
    await page.getByRole("link", { name: "Input", exact: true }).click()
    await expect.poll(() => container.querySelector('[data-example-id="c-input-1"] input[placeholder="Basic Input"]')).not.toBeNull()
    const input = page.elementLocator(container.querySelector('[data-example-id="c-input-1"] input') as HTMLInputElement)
    await input.fill("Persistent draft")
    const originalInput = input.element()
    for (const theme of ["dark", "pitch-black", "light"]) {
      const select = page.getByRole("combobox", { name: "Theme", exact: true }).element() as HTMLSelectElement
      select.value = theme
      select.dispatchEvent(new Event("change", { bubbles: true }))
      await expect.poll(() => document.documentElement.classList.contains(theme)).toBe(true)
      await expect.element(input).toHaveValue("Persistent draft")
      expect(input.element()).toBe(originalInput)
    }
    const density = page.getByRole("combobox", { name: "Density", exact: true }).element() as HTMLSelectElement
    density.value = "compact"
    density.dispatchEvent(new Event("change", { bubbles: true }))
    await expect.poll(() => document.documentElement.classList.contains("density-compact")).toBe(true)
    await expect.element(input).toHaveValue("Persistent draft")
    expect(input.element()).toBe(originalInput)
  })

  it("normalizes unknown and mismatched component addresses", async () => {
    location.hash = "#/exui/button"
    await expect.poll(() => location.hash).toBe("#/components/button")
    location.hash = "#/components/missing"
    await expect.poll(() => location.hash).toBe("#/components/button")
    await expect.element(page.getByRole("heading", { level: 1 })).toHaveTextContent("Button")
  })

  it.each(["en", "zh-CN"])("loads a real preview for every navigation entry in %s", async (language) => {
    await expect.element(page.getByRole("heading", { level: 1 })).toHaveTextContent("Button")
    const languageSelector = page.getByRole("combobox", { name: "Language", exact: true }).element() as HTMLSelectElement
    languageSelector.value = language
    languageSelector.dispatchEvent(new Event("change", { bubbles: true }))
    await expect.poll(() => document.documentElement.lang).toBe(language)
    const links = Array.from(container.querySelectorAll<HTMLAnchorElement>('nav a[href^="#/"]'))
    expect(links).toHaveLength(91)
    const diagnostics: string[] = []
    const originalError = console.error
    const errorSpy = vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
      if (args.join(" ").includes("both value and defaultValue")) diagnostics.push(`${location.hash}: ${args.join(" ")}`)
      originalError(...args)
    })
    try {
      for (const link of links) {
        link.click()
        await expect.poll(() => container.querySelector("main h1")?.textContent).toBe(link.textContent)
        await expect.poll(() => container.querySelector("[data-page-loaded]")?.getAttribute("data-page-loaded")).toBe(link.getAttribute("data-page-id"))
        expect(container.querySelector("main .showcase-preview"), link.textContent ?? "").not.toBeNull()
        expect(container.querySelector('[data-page-error="true"]'), link.textContent ?? "").toBeNull()
      }
    } finally {
      errorSpy.mockRestore()
    }
    expect(diagnostics).toEqual([])
  }, 120000)
})
