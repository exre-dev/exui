import "../../src/showcase/ShowcaseStyles"
import { createRoot, type Root } from "react-dom/client"
import { renderToString } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { ComponentExamplesHost } from "../../app/components/ComponentExamplesHost"
import { LanguageContext, type ShowcaseLanguage } from "../../src/showcase/language"

let root: Root
let container: HTMLDivElement
let originalClasses: string
function render(family: string, language: ShowcaseLanguage = "en", density: "standard" | "compact" = "standard", target?: string) {
  root.render(<LanguageContext.Provider value={{ language, setLanguage: () => {} }}><ComponentExamplesHost family={family} density={density} target={target} /></LanguageContext.Provider>)
}
beforeEach(async () => {
  originalClasses = document.documentElement.className
  container = document.createElement("div")
  document.body.append(container)
  root = createRoot(container)
  await document.fonts.ready
})
afterEach(() => {
  root.unmount()
  container.remove()
  document.documentElement.className = originalClasses
  vi.restoreAllMocks()
})

describe("Docs example host", () => {
  it("renders the same placeholder before browser activation", () => {
    const html = renderToString(<LanguageContext.Provider value={{ language: "en", setLanguage: () => {} }}><ComponentExamplesHost family="input" density="standard" /></LanguageContext.Provider>)
    expect(html).toContain('data-testid="examples-hydration-placeholder"')
    expect(html).not.toContain('data-example-id=')
  })

  it("keeps the preview draft through a modal source drawer and settings changes; loads source on demand", async () => {
    const fetched: string[] = []
    const source = { schemaVersion: 1, id: "c-input-1", family: "input", files: [
      { path: "src/showcase/examples/input/c-input-1.tsx", language: "tsx", code: "export const input = 1", highlightedHtml: '<pre class="shiki"><code><span style="--shiki-light:#000;--shiki-dark:#fff">export const input = 1</span></code></pre>' },
      { path: "src/showcase/examples/_shared/example-runtime.tsx", language: "tsx", code: "export const helper = 2", highlightedHtml: '<pre class="shiki"><code>export const helper = 2</code></pre>' },
    ] }
    vi.spyOn(globalThis, "fetch").mockImplementation(async input => {
      fetched.push(String(input))
      return new Response(JSON.stringify(source), { headers: { "content-type": "application/json" } })
    })
    render("input", "en", "standard", "c-input-1")
    await expect.poll(() => container.querySelector('[data-example-id="c-input-1"] input')).not.toBeNull()
    expect(fetched).toHaveLength(0)
    const input = container.querySelector<HTMLInputElement>('[data-example-id="c-input-1"] input')!
    await page.elementLocator(input).fill("Retained draft")
    const card = container.querySelector<HTMLElement>('[data-docs-example-card="c-input-1"]')!
    expect(card.querySelector('[role="tablist"]')).toBeNull()
    expect(card.querySelectorAll('.showcase-example-header button')).toHaveLength(2)
    const trigger = page.elementLocator(card).getByRole("button", { name: "Source", exact: true })
    await trigger.click()
    const drawer = page.getByRole("dialog", { name: "Input · 01 source", exact: true })
    await expect.element(drawer).toBeVisible()
    await expect.poll(() => fetched.length).toBe(1)
    expect(fetched[0]).toMatch(/\/examples\/c-input-1\/source\.json$/)
    await expect.element(drawer.getByRole("combobox", { name: "Example file" })).toHaveValue(source.files[0].path)
    expect(input.closest('[hidden]')).toBeNull()
    const drawerElement = document.querySelector<HTMLElement>('[data-docs-source-drawer]')!
    expect(drawerElement.contains(document.activeElement)).toBe(true)
    expect(drawerElement.closest('.density-compact')).toBeNull()
    expect(drawerElement.hasAttribute('data-docs-example-portal')).toBe(false)
    await expect.poll(() => drawerElement.getBoundingClientRect().right).toBeCloseTo(window.innerWidth, 0)
    expect(drawerElement.getBoundingClientRect().width).toBeCloseTo(Math.min(720, window.innerWidth), 0)
    await drawer.getByRole("combobox", { name: "Example file" }).selectOptions(source.files[1].path)
    const write = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue()
    await drawer.getByRole("button", { name: "Copy file" }).click()
    expect(write).toHaveBeenCalledWith(source.files[1].code)
    await userEvent.keyboard("{Escape}")
    await expect.element(drawer).not.toBeInTheDocument()
    await expect.element(trigger).toHaveFocus()
    render("input", "zh-CN", "compact", "c-input-2")
    await expect.poll(() => container.querySelector('[data-docs-example-card="c-input-2"][data-highlighted="true"]')).not.toBeNull()
    await expect.poll(() => card.classList.contains("density-compact") || !!container.querySelector(".docs-examples-scope.density-compact")).toBe(true)
    expect(container.querySelector('[data-example-id="c-input-1"] input')).toBe(input)
    expect(input.value).toBe("Retained draft")
    await page.elementLocator(card).getByRole("button", { name: "源码", exact: true }).click()
    const translated = page.getByRole("dialog", { name: "Input · 01 源码", exact: true })
    await expect.element(translated.getByRole("button", { name: "复制源码" })).toBeVisible()
    await expect.element(translated.getByRole("combobox", { name: "示例文件" })).toHaveValue(source.files[0].path)
    expect(fetched).toHaveLength(1)
    expect(document.querySelector('[data-docs-source-drawer]')?.closest('.density-compact')).toBeNull()
    await translated.getByRole("button", { name: "关闭", exact: true }).click()
    expect(input.value).toBe("Retained draft")
  })

  it("copies the canonical link from the case title with tooltip and honest failure feedback", async () => {
    render("button")
    await expect.poll(() => container.querySelector('[data-docs-example-card="c-button-1"]')).not.toBeNull()
    const card = container.querySelector<HTMLElement>('[data-docs-example-card="c-button-1"]')!
    const title = page.elementLocator(card).getByRole("button", { name: "Button · 01", exact: true })
    ;(card.querySelector('.showcase-example-number') as HTMLElement).focus()
    await expect.element(page.getByRole("tooltip")).toHaveTextContent("Copy example link")
    const write = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue()
    await title.click()
    expect(write).toHaveBeenCalledWith(`${location.origin}/examples/c-button-1/`)
    await expect.element(page.getByRole("tooltip")).toHaveTextContent("Link copied")
    write.mockRejectedValueOnce(new Error("Denied"))
    await title.click()
    await expect.element(page.getByRole("tooltip")).toHaveTextContent("Copy failed. Please try again.")
  })

  it("copies full Markdown and helper files inside the drawer and closes through its overlay", async () => {
    const fetchSource = globalThis.fetch.bind(globalThis)
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
      if (!String(input).endsWith("/examples/c-input-group-1/source.json")) return fetchSource(input, init)
      return new Response(JSON.stringify({ schemaVersion: 1, id: "c-input-group-1", family: "input-group", files: [
        { path: "src/showcase/examples/input-group/c-input-group-1.tsx", language: "tsx", code: "export const example = 1", highlightedHtml: "<pre><code>export const example = 1</code></pre>" },
      ] }), { headers: { "content-type": "application/json" } })
    })
    render("input-group")
    await expect.poll(() => container.querySelector('[data-docs-example-card="c-input-group-1"]')).not.toBeNull()
    const card = container.querySelector<HTMLElement>('[data-docs-example-card="c-input-group-1"]')!
    await page.elementLocator(card).getByRole("button", { name: "Source", exact: true }).click()
    const drawer = page.getByRole("dialog", { name: "Input Group · 01 source", exact: true })
    await expect.element(drawer.getByRole("combobox", { name: "Example file" })).toBeVisible()
    const write = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue()
    await drawer.getByRole("button", { name: "Copy source", exact: true }).click()
    await expect.poll(() => write.mock.calls.length).toBe(1)
    expect(write.mock.calls[0][0]).toContain(`Reference: ${location.origin}/examples/c-input-group-1/`)
    expect(write.mock.calls[0][0]).toContain("src/showcase/examples/input-group/c-input-group-1.tsx")
    expect(write.mock.calls[0][0]).toContain("src/showcase/examples/_shared/example-runtime.tsx")
    await expect.element(drawer.getByRole("status").filter({ hasText: "Source copied" })).toBeVisible()
    write.mockRejectedValueOnce(new Error("Denied"))
    await drawer.getByRole("button", { name: "Copy source", exact: true }).click()
    await expect.element(drawer.getByRole("status").filter({ hasText: "Copy failed" })).toBeVisible()
    if (window.innerWidth >= 1000) {
      await userEvent.click(document.querySelector<HTMLElement>('[data-slot="sheet-overlay"]')!, { position: { x: 10, y: 10 } })
      await expect.element(drawer).not.toBeInTheDocument()
    }
  })

  it("retries failed source requests and applies density only to an owned Portal", async () => {
    let attempts = 0
    vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
      attempts++
      if (attempts === 1) return new Response("Unavailable", { status: 503 })
      return new Response(JSON.stringify({ schemaVersion: 1, id: "c-popover-1", family: "popover", files: [{ path: "popover.tsx", language: "tsx", code: "popover", highlightedHtml: "<pre>popover</pre>" }] }), { headers: { "content-type": "application/json" } })
    })
    render("popover", "en", "compact")
    await expect.poll(() => container.querySelector('[data-docs-example-card="c-popover-1"]')).not.toBeNull()
    const card = container.querySelector<HTMLElement>('[data-docs-example-card="c-popover-1"]')!
    await page.elementLocator(card).getByRole("button", { name: "Open Popover" }).click()
    await expect.poll(() => document.querySelector('[data-docs-example-portal="c-popover-1"]')).not.toBeNull()
    expect(document.querySelector('[data-docs-example-portal="c-popover-1"]')?.classList.contains("density-compact")).toBe(true)
    await userEvent.keyboard("{Escape}")
    await page.elementLocator(card).getByRole("button", { name: "Source", exact: true }).click()
    const drawer = page.getByRole("dialog", { name: "Popover · 01 source", exact: true })
    await expect.element(drawer.getByRole("alert")).toHaveTextContent("Source failed to load")
    await drawer.getByRole("button", { name: "Retry" }).click()
    await expect.element(drawer.getByRole("combobox", { name: "Example file" })).toHaveValue("popover.tsx")
    expect(attempts).toBe(2)
  })

  it("keeps source controls outside the compact density of an owned toast", async () => {
    render("sonner", "en", "compact")
    await expect.poll(() => container.querySelector('[data-docs-example-card="c-sonner-1"]')).not.toBeNull()
    const card = container.querySelector<HTMLElement>('[data-docs-example-card="c-sonner-1"]')!
    await page.elementLocator(card).getByRole("button", { name: "Show Toast" }).click()
    await expect.poll(() => document.querySelector('[data-sonner-toast][data-docs-example-portal="c-sonner-1"]')).not.toBeNull()
    const toast = document.querySelector<HTMLElement>('[data-sonner-toast][data-docs-example-portal="c-sonner-1"]')!
    expect(toast.classList.contains("density-compact")).toBe(true)
    const trigger = page.elementLocator(card).getByRole("button", { name: "Source", exact: true })
    ;(trigger.element() as HTMLElement).focus()
    await userEvent.keyboard("{Enter}")
    await expect.element(page.getByRole("dialog", { name: "Sonner · 01 source", exact: true })).toBeVisible()
    expect(document.querySelector('[data-docs-source-drawer]')?.classList.contains("density-compact")).toBe(false)
    expect(document.querySelector('[data-docs-source-drawer]')?.hasAttribute("data-docs-example-portal")).toBe(false)
  })

  it("does not assign the documentation drawer to a preview after an assistive click", async () => {
    render("input", "en", "compact")
    await expect.poll(() => container.querySelector('[data-docs-example-card="c-input-1"] input')).not.toBeNull()
    const card = container.querySelector<HTMLElement>('[data-docs-example-card="c-input-1"]')!
    const trigger = page.elementLocator(card).getByRole("button", { name: "Source", exact: true }).element() as HTMLElement
    card.querySelector("input")!.dispatchEvent(new PointerEvent("pointerover", { bubbles: true }))
    // Assistive activation may emit click without pointerdown or keydown.
    trigger.click()
    await expect.element(page.getByRole("dialog", { name: "Input · 01 source", exact: true })).toBeVisible()
    const drawer = document.querySelector<HTMLElement>('[data-docs-source-drawer]')!
    expect(drawer.hasAttribute("data-docs-example-portal")).toBe(false)
    expect(drawer.closest(".density-compact")).toBeNull()
  })
  it("accepts readable Markdown from a static host with a generic MIME type", async () => {
    const markdown = "# Button · 01\n\nExample ID: `c-button-1`\n\n## Files\n"
    vi.spyOn(globalThis, "fetch").mockImplementation(async input => {
      if (String(input).endsWith("/source.md")) return new Response(markdown, { headers: { "content-type": "application/octet-stream" } })
      return new Response(JSON.stringify({ schemaVersion: 1, id: "c-button-1", family: "button", files: [{ path: "button.tsx", language: "tsx", code: "button", highlightedHtml: "<pre>button</pre>" }] }), { headers: { "content-type": "application/json" } })
    })
    render("button")
    await expect.poll(() => container.querySelector('[data-docs-example-card="c-button-1"]')).not.toBeNull()
    const card = container.querySelector<HTMLElement>('[data-docs-example-card="c-button-1"]')!
    await page.elementLocator(card).getByRole("button", { name: "Source", exact: true }).click()
    const drawer = page.getByRole("dialog", { name: "Button · 01 source", exact: true })
    await expect.element(drawer.getByRole("combobox", { name: "Example file" })).toBeVisible()
    const write = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue()
    await drawer.getByRole("button", { name: "Copy source", exact: true }).click()
    await expect.poll(() => write.mock.calls.length).toBe(1)
    expect(write.mock.calls[0][0]).toBe(`Reference: ${location.origin}/examples/c-button-1/\n\n${markdown}`)
  })

  it("retains official numbering and extension headers without assigning them upstream IDs", async () => {
    render("button")
    await expect.poll(() => container.querySelectorAll('[data-example-id]').length).toBe(61)
    expect(container.querySelectorAll('.showcase-example:has([data-example-id]) > .showcase-example-header')).toHaveLength(61)
    expect(container.querySelectorAll('.showcase-example:has([data-example-kind="exui-extension"]) > .showcase-example-header')).toHaveLength(2)
    const first = container.querySelector('[data-docs-example-card="c-button-1"] .showcase-example-header')!
    expect(first.textContent).toContain("Button · 01")
    expect(first.querySelectorAll("button")).toHaveLength(2)
    render("input-group")
    await expect.poll(() => container.querySelector('[data-docs-example-card="exui-direction"]')).not.toBeNull()
    const extension = container.querySelector('[data-docs-example-card="exui-direction"]')!
    expect(extension.querySelector('[data-example-id]')).toBeNull()
    expect(extension.querySelector('.showcase-example-number')?.textContent).toBe("Input Group · E01")
    render("field")
    await expect.poll(() => container.querySelectorAll('[data-docs-example-card]').length).toBe(14)
    expect(Array.from(container.querySelectorAll<HTMLElement>('[data-docs-example-card^="exui-field-"]'), node => node.dataset.docsExampleCard)).toEqual([
      "exui-field-settings", "exui-field-display", "exui-field-layout",
    ])
    expect(Array.from(container.querySelectorAll<HTMLElement>('[data-example-id]'), node => node.dataset.exampleId)).toEqual(
      Array.from({ length: 11 }, (_, index) => `c-field-${index + 1}`),
    )
  })

})
