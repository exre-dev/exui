import "@exre/exui/style.css"
import type { ReactElement } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { userEvent } from "vitest/browser"
import {
  Button, Checkbox, CodeBlock, ColorPickerSwatch, DateSelector, Field, FieldContent,
  FileType, IconStack, NavigationMenu, NavigationMenuItem, NavigationMenuList,
  NavigationMenuTrigger, NumberField, NumberFieldInput, NumberFieldScrubArea,
  PhoneInput, Questionnaire, QuestionnaireChoice, QuestionnaireChoices,
  QuestionnaireItem, ScrollArea,
} from "@exre/exui"

const rootSizes = [16, 21.328, 32]
let container: HTMLDivElement
let root: Root
let originalFontSize: string
let originalFontPriority: string

beforeEach(() => {
  originalFontSize = document.documentElement.style.getPropertyValue("font-size")
  originalFontPriority = document.documentElement.style.getPropertyPriority("font-size")
  container = document.createElement("div")
  container.style.width = "100rem"
  document.body.append(container)
  root = createRoot(container)
})

afterEach(() => {
  document.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }))
  root.unmount()
  container.remove()
  if (originalFontSize) document.documentElement.style.setProperty("font-size", originalFontSize, originalFontPriority)
  else document.documentElement.style.removeProperty("font-size")
})

function element(selector: string): Element {
  const result = container.querySelector(selector)
  expect(result, selector).not.toBeNull()
  return result!
}

function style(selector: string) { return getComputedStyle(element(selector)) }

function scaled(actual: string, baseline: number, rootSize: number, label: string) {
  expect(Math.abs(parseFloat(actual) - baseline * rootSize / 16), label).toBeLessThanOrEqual(0.1)
}

async function mount(content: ReactElement, selector: string) {
  root.render(content)
  await expect.poll(() => container.querySelector(selector)).not.toBeNull()
}

describe("static component rem geometry through the public package", () => {
  it("scales swatch radii and checker tiles on the same mounted instance", async () => {
    await mount(<><ColorPickerSwatch data-testid="empty" /><ColorPickerSwatch data-testid="alpha" color="#ff000080" /></>, '[data-testid="alpha"]')
    for (const size of rootSizes) {
      document.documentElement.style.fontSize = `${size}px`
      scaled(style('[data-testid="empty"]').borderRadius, 5, size, "swatch radius")
      const tiles = style('[data-testid="alpha"]').backgroundSize.split(",").at(-1)!.trim().split(" ")
      scaled(tiles[0], 8, size, "checker width")
      scaled(tiles[1], 8, size, "checker height")
    }
  })

  it("scales flag and checkbox-choice radii while retaining hairline borders", async () => {
    await mount(<><PhoneInput defaultCountry="US" /><Questionnaire items={[{ name: "tools", choices: [{ value: "editor" }] }]} defaultItem="tools"><QuestionnaireItem name="tools" multiple><QuestionnaireChoices><QuestionnaireChoice value="editor">Editor</QuestionnaireChoice></QuestionnaireChoices></QuestionnaireItem></Questionnaire></>, '[data-slot="questionnaire-choice-indicator"]')
    for (const size of rootSizes) {
      document.documentElement.style.fontSize = `${size}px`
      scaled(style('[data-slot="combobox-trigger"] svg').borderRadius, 5, size, "flag radius")
      const indicator = style('[data-slot="questionnaire-choice-indicator"]')
      scaled(indicator.borderRadius, 5, size, "questionnaire radius")
      expect(indicator.borderTopWidth).toBe("1px")
    }
  })

  it("scales DateSelector list height and its desktop width", async () => {
    await mount(<DateSelector defaultPeriodType="year" className="date-size-fixture" minYear={2020} maxYear={2030} />, '[data-slot="scroll-area"]')
    for (const size of rootSizes) {
      document.documentElement.style.fontSize = `${size}px`
      scaled(style('[data-slot="scroll-area"]').height, 200, size, "date list height")
      if (matchMedia("(min-width: 40rem)").matches) scaled(style(".date-size-fixture").width, 470, size, "date width")
    }
  })

  it("keeps the FileType mini treatment relative to its root and preserves SVG coordinates", async () => {
    await mount(<><FileType data-testid="file" size="mini" type="pdf" /><FileType data-testid="solid" size="mini" type="js" variant="solid" /><FileType data-testid="glyph" size="mini" type="pdf" glyph /></>, '[data-slot="file-type-label"]')
    for (const size of rootSizes) {
      document.documentElement.style.fontSize = `${size}px`
      scaled(style('[data-slot="file-type-label"]').fontSize, 5.8, size, "mini label cap")
      scaled(style('[data-testid="solid"] [data-slot="file-type-label"]').fontSize, 5.8, size, "solid mini label cap")
      expect(style('[data-slot="file-type-label"]').fontWeight).toBe("600")
      expect(style('[data-slot="file-type-glyph"]').scale).toBe("1")
      expect(style('[data-slot="file-type-glyph"]').transformOrigin).toBe("12px 15px")
      expect(element('[data-testid="glyph"] svg').getAttribute("viewBox")).toBe("0 0 24 24")
    }
  })

  it("scales visible scrollbar padding while retaining its border", async () => {
    await mount(<ScrollArea type="always" style={{ height: "5rem", width: "5rem" }}><div style={{ height: "20rem" }}>Scrollable</div></ScrollArea>, '[data-slot="scroll-area-scrollbar"]')
    for (const size of rootSizes) {
      document.documentElement.style.fontSize = `${size}px`
      scaled(style('[data-slot="scroll-area-scrollbar"]').paddingTop, 1, size, "scrollbar padding")
      expect(style('[data-slot="scroll-area-scrollbar"]').borderLeftWidth).toBe("1px")
    }
  })

  it("scales Field and NavigationMenu alignment offsets", async () => {
    await mount(<><Field orientation="horizontal"><Checkbox /><FieldContent>Choice</FieldContent></Field><NavigationMenu><NavigationMenuList><NavigationMenuItem><NavigationMenuTrigger>Menu</NavigationMenuTrigger></NavigationMenuItem></NavigationMenuList></NavigationMenu></>, '[data-slot="navigation-menu-trigger"]')
    for (const size of rootSizes) {
      document.documentElement.style.fontSize = `${size}px`
      scaled(style('[role="checkbox"]').marginTop, 1, size, "field alignment")
      scaled(style('[data-slot="navigation-menu-trigger"] svg').top, 1, size, "navigation chevron offset")
    }
  })

  it("scales code token padding, fold radii, blur and icon-stack blur", async () => {
    await mount(<><CodeBlock lines={[{ number: 1, text: "function test() {", tokens: [{ content: "function test() {" }], state: { focused: true } }, { number: 2, text: "  return 1", tokens: [{ content: "  return 1", word: true }] }, { number: 3, text: "}", tokens: [{ content: "}" }] }]} foldable streaming /><IconStack /><span data-blur-pointer-parking aria-hidden style={{ position: "fixed", right: 0, bottom: 0, width: 4, height: 4, zIndex: 2147483647 }} /></>, '[data-slot="code-block-token"][data-word]')
    // Hover intentionally removes CodeBlock blur. Park the real pointer on a
    // fixed sibling so earlier interaction cases cannot change this fixture.
    await userEvent.hover(element('[data-blur-pointer-parking]'))
    for (const size of rootSizes) {
      document.documentElement.style.fontSize = `${size}px`
      scaled(style('[data-slot="code-block-token"][data-word]').paddingTop, 1, size, "token padding")
      scaled(style('[data-slot="code-block-fold-toggle"]').borderRadius, 4, size, "fold radius")
      scaled(style('[data-slot="code-block-caret"]').borderRadius, 1, size, "caret radius")
      // This line intentionally transitions its filter; wait for the new root
      // size to finish that existing transition before comparing geometry.
      await expect.poll(() => Math.abs(parseFloat(style('[data-slot="code-block-line"][data-blurred]').filter.match(/blur\(([^)]+)\)/)![1]) - 1.5 * size / 16)).toBeLessThanOrEqual(0.1)
      scaled(style('[data-slot="icon-stack"] ellipse').filter.match(/blur\(([^)]+)\)/)![1], 4, size, "icon blur")
    }
  })

  it("scales NumberField's outer cursor while preserving its internal viewBox", async () => {
    await mount(<NumberField defaultValue={1}><NumberFieldScrubArea label="Amount" /><NumberFieldInput /></NumberField>, '[data-slot="number-field-input"]')
    for (const size of rootSizes) {
      document.documentElement.style.fontSize = `${size}px`
      element('[data-slot="number-field-scrub-area"]').dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerType: "mouse", button: 0 }))
      // Base UI flushes the scrub cursor before requesting pointer lock. Read its
      // actual layout in that same event turn, then release the scrub immediately.
      const cursor = document.body.querySelector('svg[viewBox="0 0 24 14"]')!
      expect(cursor).not.toBeNull()
      const { width, height } = getComputedStyle(cursor)
      document.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }))
      scaled(width, 26, size, "cursor width")
      scaled(height, 14, size, "cursor height")
    }
  })

  it("retains Button's one-pixel border while its press offset scales", async () => {
    await mount(<Button>Press</Button>, '[data-slot="button"]')
    const button = element('[data-slot="button"]') as HTMLButtonElement
    for (const size of rootSizes) {
      document.documentElement.style.fontSize = `${size}px`
      expect(getComputedStyle(button).borderTopWidth).toBe("1px")
      // Keyboard activation produces the same native :active feedback as pointer activation.
      button.focus()
      await userEvent.keyboard("{Space>}")
      try {
        await expect.poll(() => parseFloat(getComputedStyle(button).translate.split(" ")[1])).toBeCloseTo(size / 16, 1)
      } finally {
        await userEvent.keyboard("{/Space}")
      }
    }
  })
})
