import "../../app/styles/docs.css"
import "./ShowcaseStyles"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { ComponentExamplesHost } from "../../app/components/ComponentExamplesHost"
import { LanguageContext } from "./language"
import GettingStartedExample from "./examples/navigation-menu/c-navigation-menu-1"
import ComponentsExample from "./examples/navigation-menu/c-navigation-menu-2"
import StatusExample from "./examples/navigation-menu/c-navigation-menu-3"
import IndustriesExample from "./examples/navigation-menu/c-navigation-menu-4"

let root: Root
let container: HTMLDivElement
let previousClasses: string
let previousUrl: string

beforeEach(() => {
  previousClasses = document.documentElement.className
  previousUrl = location.href
  container = document.createElement("div")
  container.className = "docs-examples"
  container.style.width = "min(100%, 44rem)"
  document.body.replaceChildren(container)
  root = createRoot(container)
})

afterEach(() => {
  root.unmount()
  document.documentElement.className = previousClasses
  history.replaceState(null, "", previousUrl)
})

async function openMenu(triggerName: string, linkName: RegExp) {
  await document.fonts.ready
  const trigger = page.getByRole("button", { name: triggerName, exact: true })
  await trigger.click()
  await expect.element(trigger).toHaveAttribute("aria-expanded", "true")
  await expect.poll(() => container.querySelector('[data-slot="navigation-menu-viewport"]')).not.toBeNull()
  const viewport = container.querySelector('[data-slot="navigation-menu-viewport"]')!
  await expect.poll(() => viewport.getBoundingClientRect().width).toBeGreaterThan(0)
  await expect.poll(() => viewport.getBoundingClientRect().height).toBeGreaterThan(0)
  const link = page.getByRole("link", { name: linkName })
  await expect.element(link).toBeVisible()
  await expect.poll(() => {
    const popup = viewport.getBoundingClientRect()
    const links = viewport.querySelectorAll<HTMLAnchorElement>("a")
    return links.length > 0 && Array.from(links).every((anchor) => {
      const rect = anchor.getBoundingClientRect()
      return rect.left >= popup.left - 0.5 && rect.right <= popup.right + 0.5
        && rect.top >= popup.top - 0.5 && rect.bottom <= popup.bottom + 0.5
        && anchor.contains(document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2))
    })
  }).toBe(true)
  await link.click()
  await userEvent.keyboard("{Escape}")
  await expect.element(trigger).toHaveAttribute("aria-expanded", "false")
}

describe("Navigation Menu popup geometry", () => {
  for (const language of ["en", "zh-CN"] as const) for (const theme of ["light", "dark", "pitch-black"]) for (const density of ["standard", "compact"] as const) {
    it(`opens visible clickable links with docs utilities in ${language}/${theme}/${density}`, async () => {
      document.documentElement.className = [theme, theme === "pitch-black" ? "dark" : ""].filter(Boolean).join(" ")
      root.render(<LanguageContext.Provider value={{ language, setLanguage: () => {} }}><ComponentExamplesHost family="navigation-menu" density={density} /></LanguageContext.Provider>)
      await openMenu(language === "en" ? "Getting started" : "快速入门", language === "en" ? /^Introduction/ : /^简介/)
    })
  }
})

describe.skipIf(window.innerWidth < 1000)("Navigation Menu desktop examples", () => {
  it.each([
    { Component: GettingStartedExample, trigger: "Getting started", link: /^Introduction/ },
    { Component: ComponentsExample, trigger: "Components", link: /^Alert Dialog/ },
    { Component: StatusExample, trigger: "Status", link: /^Backlog/ },
    { Component: IndustriesExample, trigger: "Industries", link: /^Individuals/ },
  ])("opens and closes the $trigger example", async ({ Component, trigger, link }) => {
    document.documentElement.className = "light"
    root.render(<LanguageContext.Provider value={{ language: "en", setLanguage: () => {} }}><Component /></LanguageContext.Provider>)
    await openMenu(trigger, link)
  })
})
