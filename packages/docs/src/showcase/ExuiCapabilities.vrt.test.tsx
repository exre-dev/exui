import "./ShowcaseStyles"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { ComponentExamplesHost } from "../../app/components/ComponentExamplesHost"
import { LanguageContext, type ShowcaseLanguage } from "./language"

let root: Root
let container: HTMLDivElement

function render(family: "button" | "select", language: ShowcaseLanguage = "en") {
  root.render(<LanguageContext.Provider value={{ language, setLanguage: () => {} }}>
    <ComponentExamplesHost family={family} density="standard" />
  </LanguageContext.Provider>)
}

beforeEach(async () => {
  container = document.createElement("div")
  document.body.append(container)
  root = createRoot(container)
  await document.fonts.ready
})

afterEach(() => {
  root.unmount()
  container.remove()
  vi.restoreAllMocks()
})

describe("ExUI public capability examples", () => {
  it("renders both Button shapes for every variant and an explicit Glass opt-in", async () => {
    render("button")
    await expect.poll(() => container.querySelector('[data-docs-example-card="exui-button-shapes"]')).not.toBeNull()
    const shapeCard = container.querySelector<HTMLElement>('[data-docs-example-card="exui-button-shapes"]')!
    expect(shapeCard.querySelector(".showcase-example-number")?.textContent).toContain("Button shapes")
    expect(shapeCard.textContent).toContain("Capsule Button")
    expect(shapeCard.textContent).toContain("Rounded ActionButton")
    for (const variant of ["default", "outline", "ghost"]) {
      const button = shapeCard.querySelector<HTMLButtonElement>(`[data-slot="button"][data-variant="${variant}"]`)!
      const action = shapeCard.querySelector<HTMLButtonElement>(`[data-slot="action-button"][data-variant="${variant}"]`)!
      expect(button.type).toBe("button")
      expect(action.type).toBe("button")
      expect(Number.parseFloat(getComputedStyle(button).borderTopLeftRadius)).toBeGreaterThan(Number.parseFloat(getComputedStyle(action).borderTopLeftRadius))
    }
    const glassCard = container.querySelector<HTMLElement>('[data-docs-example-card="exui-button-glass"]')!
    expect(glassCard.querySelector(".showcase-example-number")?.textContent).toContain("Glass buttons")
    expect(glassCard.querySelector(".showcase-example-number")?.textContent).not.toBe(shapeCard.querySelector(".showcase-example-number")?.textContent)
    expect(glassCard.querySelector('[data-slot="button"]:not(.ex-glass)')).not.toBeNull()
    expect(glassCard.querySelector('[data-slot="button"].ex-glass')).not.toBeNull()
    expect(glassCard.querySelector('[data-slot="action-button"].ex-glass')).not.toBeNull()
    render("button", "zh-CN")
    await expect.poll(() => shapeCard.textContent).toContain("按钮 默认")
    expect(shapeCard.querySelector(".showcase-example-number")?.textContent).toContain("按钮形状")
    expect(glassCard.querySelector(".showcase-example-number")?.textContent).toContain("玻璃按钮")
    expect(shapeCard.textContent).toContain("操作 描边")
    expect(glassCard.textContent).toContain("玻璃 Button")
  })

  it("changes both Select APIs and keeps trigger and popup Glass independent", async () => {
    render("select")
    await expect.poll(() => container.querySelector('[data-docs-example-card="exui-select-apis"]')).not.toBeNull()
    const card = container.querySelector<HTMLElement>('[data-docs-example-card="exui-select-apis"]')!
    expect(card.querySelector(".showcase-example-number")?.textContent).toContain("Select APIs")
    const triggers = card.querySelectorAll<HTMLElement>('[data-slot="select-trigger"]')
    expect(triggers).toHaveLength(2)
    expect(triggers[0].classList.contains("ex-glass")).toBe(true)
    expect(triggers[1].classList.contains("ex-glass")).toBe(false)
    await page.elementLocator(triggers[0]).click()
    await expect.element(page.getByRole("option", { name: "Pear" })).toBeVisible()
    expect(document.querySelector('[data-slot="select-content"]')?.classList.contains("ex-glass")).toBe(false)
    await page.getByRole("option", { name: "Pear" }).click()
    await expect.poll(() => triggers[0].textContent).toContain("Pear")
    await page.elementLocator(triggers[1]).click()
    await expect.element(page.getByRole("option", { name: "Pear" })).toBeVisible()
    expect(document.querySelector('[data-slot="select-content"]')?.classList.contains("ex-glass")).toBe(true)
    await page.getByRole("option", { name: "Pear" }).click()
    await expect.poll(() => triggers[1].textContent).toContain("Pear")
  })

  it("keeps localized labels and exposes complete source through the production drawer", async () => {
    const originalFetch = globalThis.fetch.bind(globalThis)
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
      if (!String(input).endsWith("/examples/exui-select-apis/source.json")) return originalFetch(input, init)
      return new Response(JSON.stringify({
        schemaVersion: 1,
        id: "exui-select-apis",
        family: "select",
        files: [{ path: "src/showcase/examples/select/exui-select-apis.tsx", language: "tsx", code: "import { Select, SelectField } from '@exre/exui'", highlightedHtml: "<pre>import { Select, SelectField } from '@exre/exui'</pre>" }],
      }), { headers: { "content-type": "application/json" } })
    })
    render("select", "zh-CN")
    await expect.poll(() => container.querySelector('[data-docs-example-card="exui-select-apis"]')).not.toBeNull()
    const card = container.querySelector<HTMLElement>('[data-docs-example-card="exui-select-apis"]')!
    expect(card.querySelector(".showcase-example-number")?.textContent).toContain("Select 两种接口")
    expect(card.textContent).toContain("简化 Select")
    expect(card.textContent).toContain("组合式 SelectField")
    const sourceButton = page.elementLocator(card).getByRole("button", { name: "源码", exact: true })
    await sourceButton.click()
    const drawer = page.getByRole("dialog")
    await expect.element(drawer.getByRole("combobox", { name: "示例文件" })).toHaveValue("src/showcase/examples/select/exui-select-apis.tsx")
    const copy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue()
    await drawer.getByRole("button", { name: "复制源码" }).click()
    await expect.poll(() => copy.mock.calls.length).toBe(1)
    expect(copy.mock.calls[0][0]).toContain("Example ID: `exui-select-apis`")
    expect(copy.mock.calls[0][0]).toContain("SelectField")
    expect(copy.mock.calls[0][0]).toContain("onValueChange")
    expect(copy.mock.calls[0][0]).toContain("onChange")
    await userEvent.keyboard("{Escape}")
    await expect.element(drawer).not.toBeInTheDocument()
    await expect.element(sourceButton).toHaveFocus()
  })
})
