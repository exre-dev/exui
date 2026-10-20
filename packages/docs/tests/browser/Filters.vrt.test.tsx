import "../../app/styles/docs.css"
import { Filters, createFilterQuery, createFilterRule } from "@exre/exui"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { ComponentExamplesHost } from "../../app/components/ComponentExamplesHost"
import { LanguageContext, type ShowcaseLanguage } from "../../src/showcase/language"

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
    <ComponentExamplesHost family="filters" density={density} />
  </LanguageContext.Provider>)
  await expect.poll(() => container.querySelectorAll("[data-docs-example-card]").length).toBe(12)
  await document.fonts.ready
  return Array.from(container.querySelectorAll<HTMLElement>('[data-slot="filter-chip"]'))
}

describe("Filters with complete docs utility layers", () => {
  it("keeps a removed field's full path discoverable in a narrow chip", async () => {
    const path = ["Archived workspace", "Legacy team", "Former assignee"]
    root.render(<Filters
      fields={[]}
      query={createFilterQuery([createFilterRule({ id: "removed", path, operator: "is", value: "Ada" })])}
    />)
    await expect.poll(() => container.querySelector('[data-slot="filter-chip"][data-unknown]')).not.toBeNull()
    const chip = container.querySelector<HTMLElement>('[data-slot="filter-chip"][data-unknown]')!
    expect(chip.firstElementChild!.getAttribute("title")).toBe(path.join(" > "))
    expect(chip.getBoundingClientRect().width).toBeLessThanOrEqual(container.getBoundingClientRect().width + 1)
  })

  it("preserves the consumer's custom chip borders and corners", async () => {
    root.render(<Filters
      fields={[{ id: "name", label: "Name", type: "text" }]}
      query={createFilterQuery([createFilterRule({ id: "custom", path: ["name"], operator: "contains", value: "Ada" })])}
      renderChip={rule => <div data-slot="filter-chip" data-rule-id={rule.id} role="group" aria-label="Custom filter">
        <span style={{ border: "1px solid", borderRadius: "12px" }}>Name</span>
        <button type="button" style={{ border: "1px solid", borderRadius: "12px" }}>Ada</button>
      </div>}
    />)
    const custom = page.getByRole("group", { name: "Custom filter" })
    await expect.element(custom).toBeVisible()
    const children = Array.from(custom.element().children)
    expect(getComputedStyle(children[0]).borderTopRightRadius).toBe("12px")
    expect(getComputedStyle(children[1]).borderTopLeftRadius).toBe("12px")
    expect(getComputedStyle(children[1]).borderLeftWidth).toBe("1px")
  })

  for (const language of ["en", "zh-CN"] as const) {
    for (const theme of ["light", "dark", "pitch-black"]) {
      for (const density of ["standard", "compact"] as const) {
        it(`keeps connected readable chips in ${language}/${theme}/${density}`, async () => {
          document.documentElement.className = theme === "light" ? "light" : `dark ${theme === "pitch-black" ? "pitch-black" : ""}`
          const chips = await renderExamples(language, density)
          expect(chips.length).toBeGreaterThan(12)
          for (const chip of chips) {
            const segments = Array.from(chip.children) as HTMLElement[]
            const chipBox = chip.getBoundingClientRect()
            const toolbarBox = chip.parentElement!.getBoundingClientRect()
            expect(toolbarBox.width).toBeLessThanOrEqual(chip.closest('[data-slot="filters"]')!.getBoundingClientRect().width + 1)
            expect(chipBox.width).toBeLessThanOrEqual(toolbarBox.width + 1)
            for (const [index, segment] of segments.entries()) {
              const style = getComputedStyle(segment)
              expect(style.whiteSpace).toBe("nowrap")
              expect(segment.getBoundingClientRect().height).toBeCloseTo(chipBox.height, 1)
              if (index > 0) {
                expect(style.borderTopLeftRadius, chip.getAttribute("aria-label")!).toBe("0px")
                expect(style.borderBottomLeftRadius).toBe("0px")
                expect(style.borderLeftWidth).toBe("0px")
                expect(segment.getBoundingClientRect().left).toBeCloseTo(segments[index - 1].getBoundingClientRect().right, 1)
              }
              if (index < segments.length - 1) {
                expect(style.borderTopRightRadius).toBe("0px")
                expect(style.borderBottomRightRadius).toBe("0px")
              }
            }
            expect(parseFloat(getComputedStyle(segments[0]).borderTopLeftRadius)).toBeGreaterThan(0)
            expect(parseFloat(getComputedStyle(segments.at(-1)!).borderTopRightRadius)).toBeGreaterThan(0)
          }
        })
      }
    }
  }

  it("fits previews to their content and keeps menus clickable outside the card", async () => {
    document.documentElement.className = "light"
    await renderExamples("zh-CN", "standard")
    const plainCard = container.querySelector<HTMLElement>('[data-docs-example-card="c-filters-2"]')!
    expect(plainCard.getBoundingClientRect().height).toBeLessThan(280)

    const first = page.getByTestId("example-c-filters-1")
    const operator = first.getByRole("button", { name: "包含其中任意一项", exact: true })
    await operator.click()
    const option = page.getByRole("option", { name: "不为空", exact: true })
    await expect.element(option).toBeVisible()
    await option.click()
    await expect.element(first.getByRole("button", { name: "不为空", exact: true })).toBeVisible()

    const priority = first.getByRole("button", { name: "紧急", exact: true })
    await priority.click()
    await expect.element(page.getByRole("option", { name: /低/ }).first()).toBeVisible()
    await userEvent.keyboard("{Escape}")
    await expect.element(priority).toHaveAttribute("aria-expanded", "false")

    const plainOperator = page.getByTestId("example-c-filters-2").getByRole("button", { name: "等于", exact: true })
    await plainOperator.click()
    const notEqual = page.getByRole("option", { name: "不等于", exact: true })
    await expect.element(notEqual).toBeVisible()
    // The popup extends past this short card and must still receive a real click.
    const popupBox = notEqual.element().closest('[role="dialog"]')!.getBoundingClientRect()
    const cardBox = plainCard.getBoundingClientRect()
    expect(popupBox.bottom > cardBox.bottom || popupBox.top < cardBox.top).toBe(true)
    await notEqual.click()
    await expect.element(page.getByTestId("example-c-filters-2").getByRole("button", { name: "不等于", exact: true })).toBeVisible()
  })
})
