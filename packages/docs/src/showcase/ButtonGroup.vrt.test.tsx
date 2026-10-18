import "../../app/styles/docs.css"
import { Button, ButtonGroup, ButtonGroupText, SelectField, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@exre/exui"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { ComponentExamplesHost } from "../../app/components/ComponentExamplesHost"
import { LanguageContext, type ShowcaseLanguage } from "./language"

let container: HTMLDivElement
let root: Root
let previousClasses: string

beforeEach(() => {
  previousClasses = document.documentElement.className
  container = document.createElement("div")
  container.className = "docs-examples"
  container.style.width = "min(calc(100vw - 3rem), 55rem)"
  document.body.append(container)
  root = createRoot(container)
})

afterEach(() => {
  root.unmount()
  container.remove()
  document.documentElement.className = previousClasses
})

async function renderExamples(language: ShowcaseLanguage, density: "standard" | "compact") {
  root.render(<LanguageContext.Provider value={{ language, setLanguage: () => {} }}>
    <ComponentExamplesHost family="button-group" density={density} />
  </LanguageContext.Provider>)
  await expect.poll(() => container.querySelectorAll("[data-docs-example-card]").length).toBe(57)
  await document.fonts.ready
}

function expectJoined(group: HTMLElement) {
  // Nested groups are intentionally spaced; their own controls still join.
  if (group.querySelector(':scope > [data-slot="button-group"]')) return
  const segments = Array.from(group.children).filter((child): child is HTMLElement =>
    child instanceof HTMLElement && child.getBoundingClientRect().width > 0 &&
    !["absolute", "fixed"].includes(getComputedStyle(child).position))
  const vertical = group.dataset.orientation === "vertical"
  const id = group.closest<HTMLElement>("[data-docs-example-card]")?.dataset.docsExampleCard ?? "consumer"
  for (const [index, segment] of segments.entries()) {
    const style = getComputedStyle(segment)
    const context = `${id} segment ${index}`
    if (index > 0) {
      expect(style.borderTopLeftRadius, context).toBe("0px")
      expect(vertical ? style.borderTopRightRadius : style.borderBottomLeftRadius, context).toBe("0px")
      expect(vertical ? parseFloat(style.borderTopWidth) : parseFloat(style.borderLeftWidth), context).toBe(0)
    }
    if (index < segments.length - 1) {
      expect(style.borderBottomRightRadius, context).toBe("0px")
      expect(vertical ? style.borderBottomLeftRadius : style.borderTopRightRadius, context).toBe("0px")
      const current = segment.getBoundingClientRect()
      const next = segments[index + 1].getBoundingClientRect()
      expect(Math.abs(vertical ? current.bottom - next.top : current.right - next.left), context).toBeLessThanOrEqual(1)
    }
    if (segment.dataset.slot !== "button-group-separator") {
      if (index === 0) expect(parseFloat(style.borderTopLeftRadius), context).toBeGreaterThan(0)
      if (index === segments.length - 1) expect(parseFloat(style.borderBottomRightRadius), context).toBeGreaterThan(0)
    }
  }
}

describe("ButtonGroup with complete docs utility layers", () => {
  for (const language of ["en", "zh-CN"] as const) {
    for (const theme of ["light", "dark", "pitch-black"]) {
      for (const density of ["standard", "compact"] as const) {
        it(`joins all 57 example combinations in ${language}/${theme}/${density}`, async () => {
          document.documentElement.className = theme === "light" ? "light" : `dark ${theme === "pitch-black" ? "pitch-black" : ""}`
          await renderExamples(language, density)
          const groups = container.querySelectorAll<HTMLElement>('[data-slot="button-group"]')
          expect(groups.length).toBeGreaterThanOrEqual(57)
          for (const group of groups) expectJoined(group)
        })
      }
    }
    it(`names scope and creation menus by their actions and retains the draft in ${language}`, async () => {
      await renderExamples(language, "standard")
      for (const [number, name, firstItem] of [
        [20, language === "en" ? "Filter" : "筛选", language === "en" ? "All Records" : "全部记录"],
        [21, language === "en" ? "Create" : "创建", language === "en" ? "New File" : "新建文件"],
      ] as const) {
        const card = container.querySelector<HTMLElement>(`[data-docs-example-card="c-button-group-${number}"]`)!
        card.scrollIntoView({ block: "center" })
        const input = card.querySelector<HTMLInputElement>("input")!
        await userEvent.fill(input, "draft")
        expectJoined(card.querySelector<HTMLElement>('[data-slot="button-group"]')!)
        // Scope to the real example so other Filter/Create buttons cannot satisfy the action.
        const button = card.querySelector<HTMLButtonElement>('[data-slot="dropdown-menu-trigger"]')!
        expect(button.getAttribute("aria-label")).toBe(name)
        await userEvent.keyboard("{Tab}{Enter}")
        await expect.element(page.getByRole("menuitem", { name: firstItem, exact: true })).toBeVisible()
        await userEvent.keyboard("{Escape}")
        expect(document.activeElement).toBe(button)
        expect(input.value).toBe("draft")
      }
    })
  }

  it("keeps text slots and a form Select connected despite its hidden native control", async () => {
    root.render(<form><ButtonGroup>
      <ButtonGroupText asChild><span>Scope</span></ButtonGroupText>
      <SelectField name="scope" defaultValue="all">
        <SelectTrigger aria-label="Scope"><SelectValue /></SelectTrigger>
        <SelectContent><SelectItem value="all">All records</SelectItem></SelectContent>
      </SelectField>
    </ButtonGroup><ButtonGroup orientation="vertical">
      <Button variant="outline">Follow</Button><ButtonGroupText>2.4k followers</ButtonGroupText>
    </ButtonGroup></form>)
    await expect.element(page.getByRole("combobox", { name: "Scope" })).toBeVisible()
    await document.fonts.ready
    expect(container.querySelector('select[name="scope"]')).not.toBeNull()
    for (const group of container.querySelectorAll<HTMLElement>('[data-slot="button-group"]')) expectJoined(group)
  })
})
