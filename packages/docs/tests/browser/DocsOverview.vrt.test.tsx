import { createRoot, type Root } from "react-dom/client"
import { createMemoryRouter, Link, RouterProvider, useLocation } from "react-router"
import { page } from "vitest/browser"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import ComponentsOverview from "../../src/showcase/ComponentsOverview"
import { LanguageContext } from "../../src/showcase/language"
import { Settings } from "../../app/components/Settings"
import { PreferencesProvider, usePreferences } from "../../app/lib/preferences"
import { preferenceKeys } from "../../lib/site-contract.mjs"
import { Toaster, GlassSeed, TooltipProvider } from "@exre/exui"
import "../../src/showcase/ShowcaseStyles"

let root: Root
let container: HTMLDivElement
let router: ReturnType<typeof createMemoryRouter>
let classes: string
let colorScheme: string
let preferences: Map<string, string | null>
let previousScroll: { x: number; y: number }
function OverviewRoute() {
  const { pathname } = useLocation()
  const language = pathname.startsWith("/en/") ? "en" : "zh-CN"
  const { density } = usePreferences()
  return <LanguageContext.Provider value={{ language, setLanguage: () => {} }}>
    <Settings />
    <TooltipProvider><GlassSeed /><Toaster position="top-right" duration={3000} visibleToasts={3} />
    <ComponentsOverview exampleCounts={{ button: 61 }} density={density} renderLink={(entry, children) =>
      <Link className="overview-card-link" to={`/${language}/docs/${entry.group}/${entry.id}/`}>{children}</Link>
    } /></TooltipProvider>
  </LanguageContext.Provider>
}
function render() {
  router = createMemoryRouter([
    { id: "routes/docs", path: "/:locale/docs/", loader: () => ({ examples: [], alternateAnchors: [] }), Component: OverviewRoute },
    { path: "/en/docs/components/button/", element: <h1>Button detail</h1> },
  ], { initialEntries: ["/en/docs/"] })
  root.render(<PreferencesProvider><RouterProvider router={router} /></PreferencesProvider>)
}
beforeEach(() => {
  classes = document.documentElement.className
  colorScheme = document.documentElement.style.colorScheme
  previousScroll = { x: scrollX, y: scrollY }
  scrollTo(0, 0)
  const defaults = { [preferenceKeys.theme]: "light", [preferenceKeys.density]: "standard", [preferenceKeys.language]: "en" }
  preferences = new Map(Object.keys(defaults).map(key => [key, localStorage.getItem(key)]))
  Object.entries(defaults).forEach(([key, value]) => localStorage.setItem(key, value))
  container = document.createElement("div")
  document.body.append(container)
  root = createRoot(container)
})
afterEach(() => {
  root.unmount()
  router?.dispose()
  container.remove()
  document.documentElement.className = classes
  document.documentElement.style.colorScheme = colorScheme
  scrollTo(previousScroll.x, previousScroll.y)
  preferences.forEach((value, key) => value === null ? localStorage.removeItem(key) : localStorage.setItem(key, value))
  vi.restoreAllMocks()
})
async function choose(label: string, value: string) {
  const trigger = page.getByRole("combobox", { name: label, exact: true })
  trigger.element().scrollIntoView({ block: "center", behavior: "instant" })
  await trigger.click()
  await page.getByRole("option", { name: value, exact: true }).click()
}
describe("Docs component overview", () => {
  it("renders all ordered families with counts and real router links", async () => {
    render()
    await expect.element(page.getByTestId("components-overview")).toBeVisible()
    expect(container.querySelectorAll('[data-overview-group="components"] [data-overview-card]')).toHaveLength(87)
    expect(container.querySelectorAll('[data-overview-group="exui"] [data-overview-card]')).toHaveLength(1)
    expect(container.querySelector('input[type="search"]')).toBeNull()
    for (const group of container.querySelectorAll("[data-overview-group]")) {
      const names = Array.from(group.querySelectorAll("a > span:first-child"), link => link.textContent ?? "")
      expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, "en")))
    }
    const card = container.querySelector<HTMLElement>('[data-overview-card="button"]')!
    expect(card.querySelector(".overview-card-count")?.textContent).toBe("61 examples")
    expect(card.querySelectorAll("a")).toHaveLength(1)
    expect(card.querySelector("a")?.getAttribute("href")).toBe("/en/docs/components/button/")
    expect(card.querySelector("[inert][aria-hidden=true]")).not.toBeNull()
    await page.elementLocator(card).getByRole("link").click()
    await expect.element(page.getByRole("heading", { name: "Button detail" })).toBeVisible()
    await router.navigate(-1)
    await expect.element(page.getByTestId("components-overview")).toBeVisible()
  })
  it("updates real preview appearance and language while retaining its DOM and inert boundary", async () => {
    render()
    await expect.element(page.getByTestId("components-overview")).toBeVisible()
    const card = container.querySelector<HTMLElement>('[data-overview-card="button"]')!
    card.scrollIntoView({ block: "center" })
    await expect.poll(() => card.querySelector("button")?.textContent).toBe("Default")
    const button = card.querySelector("button")!
    const height = button.getBoundingClientRect().height
    const background = getComputedStyle(card).backgroundColor
    await choose("Theme", "Dark")
    await choose("Preview density", "Compact")
    await choose("Language", "简体中文")
    await expect.poll(() => button.textContent).toBe("默认")
    expect(card.querySelector("button")).toBe(button)
    expect(getComputedStyle(card).backgroundColor).not.toBe(background)
    expect(button.getBoundingClientRect().height).toBeLessThan(height)
    expect(button.closest("[inert][aria-hidden=true]")).not.toBeNull()
    expect(button.closest("a")).toBeNull()
    expect(card.querySelectorAll("a")).toHaveLength(1)
    expect(card.querySelector("a")?.getAttribute("href")).toBe("/zh-CN/docs/components/button/")
    expect(router.state.location.pathname).toBe("/zh-CN/docs/")
  })
  it("loads all 88 real thumbnails with unique IDs, decoded images and one inert navigation target each", async () => {
    const errors: unknown[] = []
    vi.spyOn(console, "error").mockImplementation((...args) => { errors.push(args) })
    render()
    await expect.element(page.getByTestId("components-overview")).toBeVisible()
    const cards = Array.from(container.querySelectorAll<HTMLElement>("[data-overview-card]"))
    expect(cards).toHaveLength(88)
    for (const card of cards) {
      card.scrollIntoView({ block: "center" })
      await expect.poll(() => card.querySelector("[data-overview-loaded]")?.childElementCount ?? 0, { message: `${card.dataset.overviewCard}: ${JSON.stringify(errors)}` }).toBeGreaterThan(0)
      expect(card.querySelector("[data-overview-error]"), card.dataset.overviewCard).toBeNull()
      expect(card.querySelectorAll(":scope > a")).toHaveLength(1)
      expect([...card.querySelectorAll(".overview-card-preview a")].every(link => link.closest("[inert][aria-hidden=true]"))).toBe(true)
      expect(card.querySelector("[inert][aria-hidden=true]")).not.toBeNull()
      for (const image of card.querySelectorAll("img")) await expect.poll(() => image.complete && image.naturalWidth > 0).toBe(true)
    }
    const ids = Array.from(container.querySelectorAll("[id]"), element => element.id)
    expect(ids.length).toBe(new Set(ids).size)
    expect(errors).toEqual([])
  }, 120000)
})
