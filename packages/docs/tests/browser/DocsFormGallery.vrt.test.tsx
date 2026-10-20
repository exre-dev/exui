import { createRoot, type Root } from "react-dom/client"
import { page } from "vitest/browser"
import { afterEach, beforeEach, expect, it } from "vitest"
import { ComponentExamplesHost } from "../../app/components/ComponentExamplesHost"
import { LanguageContext } from "../../src/showcase/language"
import "../../src/showcase/ShowcaseStyles"
let root: Root
let container: HTMLDivElement
beforeEach(() => { container = document.createElement("div"); document.body.append(container); root = createRoot(container) })
afterEach(() => { root.unmount(); container.remove() })
it("canonical Form host mounts project, configured steps and independent model comparison", async () => {
 root.render(<LanguageContext.Provider value={{language:"en",setLanguage:()=>{}}}><ComponentExamplesHost family="form" density="standard" /></LanguageContext.Provider>)
 await expect.poll(() => container.querySelectorAll("[data-docs-example-card]").length, {timeout:10000}).toBe(3)
 expect(container.querySelectorAll("form")).toHaveLength(4)
 expect([...container.querySelectorAll("[data-docs-example-card]")].map(node => node.getAttribute("data-docs-example-card"))).toEqual(["exui-form-1", "exui-form-models", "exui-form-configured"])
 const composed = page.getByRole("textbox", {name:"Composed name", exact:true})
 const configured = page.getByRole("textbox", {name:"Configured name", exact:true})
 await composed.fill("Independent")
 await expect.element(configured).toHaveValue("Aurora")
 await page.getByRole("button", {name:"Save composed", exact:true}).click()
 await expect.element(page.getByText("Composed: Independent", {exact:true})).toBeVisible()
 await expect.element(configured).toHaveValue("Aurora")
})
it("canonical Field host renders extensions with explicit labels and descriptions", async () => {
 root.render(<LanguageContext.Provider value={{language:"en",setLanguage:()=>{}}}><ComponentExamplesHost family="field" density="compact" /></LanguageContext.Provider>)
 await expect.poll(() => container.querySelectorAll("[data-docs-example-card]").length, {timeout:10000}).toBe(14)
 const input = page.getByRole("textbox", {name:"Display name", exact:true})
 await expect.element(input).toHaveAccessibleDescription("Visible to everyone in your workspace.")
 const toggle = page.getByRole("switch", {name:"Weekly summary", exact:true})
 await toggle.click()
 await expect.element(toggle).not.toBeChecked()
 const email = page.getByRole("textbox", {name:"Email address", exact:true})
 await email.fill("invalid")
 await expect.element(email).toHaveAttribute("aria-invalid", "true")
 await expect.element(email).toHaveAccessibleDescription("Used for account notifications. Enter a valid email")
})
it("actual standalone layout caps and aligns wide controls, then fills a narrow container", async () => {
 root.render(<LanguageContext.Provider value={{language:"en",setLanguage:()=>{}}}><ComponentExamplesHost family="field" density="standard" /></LanguageContext.Provider>)
 const code = page.getByRole("textbox", {name:"Project code", exact:true})
 await expect.element(code).toBeVisible()
 const card = container.querySelector<HTMLElement>('[data-docs-example-card="exui-field-layout"]')!
 card.style.width = "760px"
 const field = code.element().closest<HTMLElement>('[data-slot="field"]')!
 const label = field.querySelector<HTMLElement>('[data-slot="field-label"]')!
 await expect.poll(() => code.element().getBoundingClientRect().width).toBeCloseTo(256, 0)
 expect(Math.abs(label.getBoundingClientRect().top - code.element().getBoundingClientRect().top)).toBeLessThan(8)
 const right = code.element().getBoundingClientRect().left
 await page.elementLocator(card).getByRole("button", {name:"Align left", exact:true}).click()
 await expect.poll(() => code.element().getBoundingClientRect().left).toBeLessThan(right - 20)
 await code.fill("Preserved standalone draft")
 card.style.width = "320px"
 await expect.poll(() => code.element().getBoundingClientRect().width).toBeCloseTo(field.getBoundingClientRect().width, 0)
 expect(code.element().getBoundingClientRect().top).toBeGreaterThanOrEqual(label.getBoundingClientRect().bottom)
 expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth)
 await expect.element(code).toHaveValue("Preserved standalone draft")
})
it("all wide Form cards span the real host grid", async () => {
 container.style.width = "872px"
 root.render(<LanguageContext.Provider value={{language:"en",setLanguage:()=>{}}}><ComponentExamplesHost family="form" density="standard" /></LanguageContext.Provider>)
 await expect.poll(() => container.querySelectorAll("[data-docs-example-card]").length, {timeout:10000}).toBe(3)
 const host = container.querySelector<HTMLElement>('[data-page-loaded="form"]')!
 for (const card of host.querySelectorAll<HTMLElement>("[data-docs-example-card]")) {
  expect(card.getBoundingClientRect().width, card.dataset.docsExampleCard).toBeCloseTo(host.getBoundingClientRect().width, 0)
 }
})
it("settings responsive fields use their public query container at wide and narrow widths", async () => {
 root.render(<LanguageContext.Provider value={{language:"en",setLanguage:()=>{}}}><ComponentExamplesHost family="field" density="standard" /></LanguageContext.Provider>)
 const email = page.getByRole("textbox", {name:"Email address", exact:true})
 await expect.element(email).toBeVisible()
 const card = container.querySelector<HTMLElement>('[data-docs-example-card="exui-field-settings"]')!
 card.style.width = "872px"
 const field = email.element().closest<HTMLElement>('[data-slot="field"]')!
 const label = field.querySelector<HTMLElement>('[data-slot="field-label"]')!
 await expect.poll(() => getComputedStyle(field).flexDirection).toBe("row")
 expect(Math.abs(label.getBoundingClientRect().top - email.element().getBoundingClientRect().top)).toBeLessThan(8)
 expect(email.element().getBoundingClientRect().left).toBeGreaterThanOrEqual(label.getBoundingClientRect().right)
 await email.fill("invalid")
 card.style.width = "320px"
 await expect.poll(() => getComputedStyle(field).flexDirection).toBe("column")
 expect(email.element().getBoundingClientRect().top).toBeGreaterThanOrEqual(label.getBoundingClientRect().bottom)
 expect(email.element().getBoundingClientRect().width).toBeCloseTo(field.getBoundingClientRect().width, 0)
 expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth)
 await expect.element(email).toHaveValue("invalid")
 await expect.element(email).toHaveAccessibleDescription("Used for account notifications. Enter a valid email")
})
