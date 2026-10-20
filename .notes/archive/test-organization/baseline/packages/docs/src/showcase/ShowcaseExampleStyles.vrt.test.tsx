import "./ShowcaseStyles"
import publicCss from "@exre/exui/style.css?inline"
import { Button, Input } from "@exre/exui"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { ExampleGallery, type ExampleEntry } from "./ExampleGallery"
import { LanguageContext, type ShowcaseLanguage } from "./language"
import AccordionExample from "./examples/accordion/c-accordion-1"
import ButtonExample from "./examples/button/c-button-1"
import DialogExample from "./examples/dialog/c-dialog-1"
import DataGridExample from "./examples/data-grid/c-data-grid-1"

let root: Root
let container: HTMLDivElement
let previousClasses: string
let previousFontSize: string
let previousFontPriority: string
let motion: HTMLStyleElement
const entries = [
  { id: "c-accordion-1", order: 1, layout: "half", Component: AccordionExample },
  { id: "c-button-1", order: 1, layout: "half", Component: ButtonExample },
  { id: "c-dialog-1", order: 1, layout: "half", Component: DialogExample },
  { id: "c-data-grid-1", order: 1, layout: "full", Component: DataGridExample },
] as const satisfies readonly ExampleEntry[]
const noMotion = "*,*::before,*::after{animation:none!important;transition:none!important}"

beforeEach(async () => {
  previousClasses = document.documentElement.className
  previousFontSize = document.documentElement.style.fontSize
  previousFontPriority = document.documentElement.style.getPropertyPriority("font-size")
  document.documentElement.style.fontSize = "16px"
  container = document.createElement("div")
  document.body.replaceChildren(container)
  motion = document.createElement("style")
  motion.textContent = noMotion
  document.head.append(motion)
  root = createRoot(container)
  await document.fonts.ready
})
afterEach(() => {
  root.unmount()
  motion.remove()
  document.documentElement.className = previousClasses
  document.documentElement.style.setProperty("font-size", previousFontSize, previousFontPriority)
})

function setAppearance(theme: string, density: string) {
  document.documentElement.className = [theme, theme === "pitch-black" ? "dark" : "", density === "compact" ? "density-compact" : ""].filter(Boolean).join(" ")
}

function Gallery({ language = "en" }: { language?: ShowcaseLanguage }) {
  return <LanguageContext.Provider value={{ language, setLanguage: () => {} }}><ExampleGallery examples={entries} /></LanguageContext.Provider>
}

function ExtensionDraft() {
  return <Input aria-label="Extension draft" defaultValue="Local extension" />
}

function propertyFromVariable(property: string, variable: string) {
  const probe = document.createElement("span")
  probe.style.setProperty(property, `var(${variable})`)
  document.body.append(probe)
  const value = getComputedStyle(probe).getPropertyValue(property)
  probe.remove()
  return value
}

/** Same public markup, in a document with only the built public stylesheet. */
async function publicOnlyFixture(element: HTMLElement) {
  const iframe = document.createElement("iframe")
  iframe.title = "Public stylesheet control reference"
  iframe.style.cssText = `position:fixed;left:-200vw;top:0;width:${window.innerWidth}px;height:${window.innerHeight}px;border:0`
  document.body.append(iframe)
  const reference = iframe.contentDocument!
  reference.documentElement.className = document.documentElement.className
  reference.documentElement.style.fontSize = "16px"
  const style = reference.createElement("style")
  style.textContent = publicCss + noMotion
  reference.head.append(style)
  const clone = reference.importNode(element, true)
  reference.body.append(clone)
  await reference.fonts.ready
  return { iframe, clone, style: () => iframe.contentWindow!.getComputedStyle(clone) }
}

async function expectPublicRecipe(element: HTMLElement, properties: readonly string[]) {
  const reference = await publicOnlyFixture(element)
  try {
    for (const property of properties) {
      expect(getComputedStyle(element).getPropertyValue(property), property).toBe(reference.style().getPropertyValue(property))
    }
  } finally { reference.iframe.remove() }
}

const controlProperties = ["width", "height", "padding-top", "padding-right", "padding-bottom", "padding-left", "border-width", "border-color", "border-radius", "background-color", "color", "font-size", "font-family", "line-height", "box-shadow"]

it("compiles the original Accordion layout utility absent from the public stylesheet", async () => {
  root.render(<AccordionExample />)
  await document.fonts.ready
  await expect.poll(() => container.querySelector(".max-w-lg")).not.toBeNull()
  expect(getComputedStyle(container.querySelector(".max-w-lg")!).maxWidth).toBe("512px")
})

it("keeps official coverage markers separate from extension previews and preserves their stable instances", async () => {
  const extensions = [{ id: "local-extension", order: 1, layout: "half", Component: ExtensionDraft }] as const
  root.render(<ExampleGallery examples={entries} extensions={extensions} />)
  await expect.element(page.getByRole("textbox", { name: "Extension draft" })).toBeVisible()
  expect(container.querySelectorAll("[data-example-id]")).toHaveLength(4)
  expect(container.querySelectorAll(".showcase-preview")).toHaveLength(5)
  const extension = container.querySelector('[data-example-kind="exui-extension"]')!
  expect(extension.hasAttribute("data-example-id")).toBe(false)
  const originalPreviews = Array.from(container.querySelectorAll(".showcase-preview"))
  await userEvent.fill(page.getByRole("textbox", { name: "Extension draft" }), "Retained extension draft")
  const originalInput = page.getByRole("textbox", { name: "Extension draft" }).element()
  root.render(<ExampleGallery examples={entries.map(entry => ({ ...entry }))} extensions={[...extensions]} />)
  await expect.element(page.getByRole("textbox", { name: "Extension draft" })).toHaveValue("Retained extension draft")
  expect(page.getByRole("textbox", { name: "Extension draft" }).element()).toBe(originalInput)
  expect(Array.from(container.querySelectorAll(".showcase-preview"))).toEqual(originalPreviews)
})

it("renders the four original scenes, accordion behavior, disabled control and real grid pagination", async () => {
  setAppearance("light", "standard")
  root.render(<><Gallery /><Button disabled>Unavailable action</Button></>)
  await expect.element(page.getByRole("button", { name: "Default", exact: true })).toBeEnabled()
  await expect.element(page.getByRole("button", { name: "Unavailable action" })).toBeDisabled()
  expect(Array.from(container.querySelectorAll("[data-example-id]"), element => element.getAttribute("data-example-id"))).toEqual(entries.map(entry => entry.id))
  expect(container.querySelector('[data-example-id="c-data-grid-1"]')?.classList.contains("showcase-preview-wide")).toBe(true)
  await userEvent.click(page.getByRole("button", { name: "Is it styled?", exact: true }))
  await expect.element(page.getByText("Yes. It comes with default styles that matches the other components' aesthetic.", { exact: true })).toBeVisible()
  const rows = () => Array.from(container.querySelectorAll("tbody tr"), row => row.textContent)
  await expect.poll(() => rows().length).toBe(5)
  const firstPage = rows()
  await userEvent.click(page.getByRole("button", { name: "Go to next page", exact: true }))
  await expect.poll(rows).not.toEqual(firstPage)
  expect(rows()).toHaveLength(5)
  await expect.poll(() => Array.from(container.querySelectorAll<HTMLImageElement>("img"), image => image.complete && image.naturalWidth > 0).every(Boolean)).toBe(true)
  const email = container.querySelector<HTMLAnchorElement>('a[href^="mailto:"]')!
  await userEvent.hover(page.elementLocator(email))
  expect(getComputedStyle(email).color).toBe(propertyFromVariable("color", "--primary"))
})

describe("public recipe preservation with private utilities", () => {
  for (const theme of ["light", "dark", "pitch-black"]) for (const density of ["standard", "compact"]) {
    it(`preserves Button, Input and portal materials in ${theme}/${density}`, async () => {
      setAppearance(theme, density)
      root.render(<><Button>Reference action</Button><Input aria-label="Reference input" /><DialogExample /></>)
      await expect.element(page.getByRole("button", { name: "Reference action" })).toBeVisible()
      await expectPublicRecipe(page.getByRole("button", { name: "Reference action" }).element() as HTMLElement, controlProperties)
      await expectPublicRecipe(page.getByRole("textbox", { name: "Reference input" }).element() as HTMLElement, controlProperties)
      await userEvent.click(page.getByRole("button", { name: "Basic Dialog", exact: true }))
      await expect.element(page.getByRole("dialog", { name: "Edit profile" })).toBeVisible()
      const dialog = page.getByRole("dialog", { name: "Edit profile" }).element() as HTMLElement
      expect(container.contains(dialog)).toBe(false)
      expect(getComputedStyle(dialog.querySelector("form")!).display).toBe("contents")
      await expectPublicRecipe(dialog, ["width", "padding-top", "padding-right", "padding-bottom", "padding-left", "border-width", "border-color", "border-radius", "background-color", "color", "box-shadow"])
      expect(getComputedStyle(dialog).backgroundColor).toBe(propertyFromVariable("background-color", "--popover"))
      await userEvent.keyboard("{Escape}")
      await expect.poll(() => document.querySelector('[role="dialog"]')).toBeNull()
      await expect.poll(() => document.activeElement?.textContent).toBe("Basic Dialog")
    })
  }
})

it("retains gallery instances, open portal drafts and grid selection across appearance and language changes", async () => {
  setAppearance("light", "standard")
  root.render(<Gallery />)
  await userEvent.click(page.getByRole("button", { name: "Go to next page", exact: true }))
  const rows = () => Array.from(container.querySelectorAll("tbody tr"), row => row.textContent)
  const secondPage = rows()
  await userEvent.click(page.getByRole("button", { name: "Basic Dialog", exact: true }))
  await userEvent.fill(page.getByRole("textbox", { name: "Name", exact: true }), "Persistent profile draft")
  const draft = page.getByRole("textbox", { name: "Name", exact: true }).element()
  const previews = Array.from(container.querySelectorAll("[data-example-id]"))
  for (const theme of ["light", "dark", "pitch-black"]) for (const density of ["standard", "compact"]) {
    setAppearance(theme, density)
    root.render(<Gallery language="zh-CN" />)
    await expect.element(page.getByRole("dialog", { name: "编辑资料" })).toBeVisible()
    await expect.element(page.getByRole("textbox", { name: "姓名", exact: true })).toHaveValue("Persistent profile draft")
    expect(page.getByRole("textbox", { name: "姓名", exact: true }).element()).toBe(draft)
    expect(Array.from(container.querySelectorAll("[data-example-id]"))).toEqual(previews)
    expect(rows()).toEqual(secondPage)
  }
  await userEvent.click(page.getByRole("button", { name: "保存更改", exact: true }))
  await expect.poll(() => document.querySelector('[role="dialog"]')).toBeNull()
  await userEvent.click(page.getByRole("button", { name: "基础对话框", exact: true }))
  await expect.element(page.getByRole("textbox", { name: "姓名", exact: true })).toHaveValue("Persistent profile draft")
  await userEvent.keyboard("{Escape}")
  await expect.poll(() => document.activeElement?.textContent).toBe("基础对话框")
})
