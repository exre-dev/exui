import { createRoot, type Root } from "react-dom/client"
import { createMemoryRouter, RouterProvider, useLocation } from "react-router"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { Settings } from "../../app/components/Settings"
import { PreferencesProvider } from "../../app/lib/preferences"
import { preferenceKeys } from "../../lib/site-contract.mjs"
import "../../src/showcase/ShowcaseStyles"

let root: Root
let container: HTMLDivElement
let router: ReturnType<typeof createMemoryRouter>
let originalClasses: string
let originalColorScheme: string
let savedPreferences: Map<string, string | null>

function SettingsPage() {
  const { pathname, search, hash } = useLocation()
  return <PreferencesProvider>
    <Settings className="settings-layout-slot" />
    <output data-testid="settings-location">{pathname + search + hash}</output>
    <input aria-label="Retained draft" defaultValue="Draft" />
  </PreferencesProvider>
}

function render(path = "/en/docs/components/input/") {
  router = createMemoryRouter([{
    id: "routes/docs",
    path: "/:locale/docs/*",
    loader: () => ({ examples: ["c-input-1"], alternateAnchors: ["#examples"] }),
    Component: SettingsPage,
  }], { initialEntries: [path] })
  root.render(<RouterProvider router={router} />)
}

async function choose(label: string, option: string) {
  await page.getByRole("combobox", { name: label, exact: true }).click()
  await page.getByRole("option", { name: option, exact: true }).click()
}

beforeEach(() => {
  originalClasses = document.documentElement.className
  originalColorScheme = document.documentElement.style.colorScheme
  const keys = [...Object.values(preferenceKeys), "exui-showcase-theme", "exui-showcase-density"]
  savedPreferences = new Map(keys.map(key => [key, localStorage.getItem(key)]))
  keys.forEach(key => localStorage.removeItem(key))
  container = document.createElement("div")
  container.className = "docs-app"
  document.body.append(container)
  root = createRoot(container)
})

afterEach(() => {
  root.unmount()
  router?.dispose()
  container.remove()
  document.documentElement.className = originalClasses
  document.documentElement.style.colorScheme = originalColorScheme
  savedPreferences.forEach((value, key) => value === null ? localStorage.removeItem(key) : localStorage.setItem(key, value))
})

describe("Docs settings", () => {
  it("uses small transparent Select triggers with keyboard dismissal and persistent preferences", async () => {
    render()
    const theme = page.getByRole("combobox", { name: "Theme", exact: true })
    await expect.element(theme).toBeVisible()
    const themeElement = theme.element()
    const triggers = [...container.querySelectorAll<HTMLElement>('[role="combobox"]')]
    expect(triggers).toHaveLength(3)
    for (const trigger of triggers) {
      expect(trigger.tagName).toBe("BUTTON")
      expect(trigger.dataset.size).toBe("sm")
      expect(getComputedStyle(trigger).backgroundColor).toBe("rgba(0, 0, 0, 0)")
      expect(trigger.getBoundingClientRect().height).toBe(2 * parseFloat(getComputedStyle(document.documentElement).fontSize))
    }
    expect(container.querySelector(".docs-settings")?.classList.contains("settings-layout-slot")).toBe(true)
    await theme.click()
    await expect.element(page.getByRole("listbox")).toBeVisible()
    expect(getComputedStyle(themeElement).backgroundColor).toBe("rgba(0, 0, 0, 0)")
    await userEvent.keyboard("{Escape}")
    await expect.element(theme).toHaveFocus()
    for (const [value, label] of [["dark", "Dark"], ["pitch-black", "Pitch black"], ["light", "Light"]]) {
      await choose("Theme", label)
      await expect.poll(() => localStorage.getItem(preferenceKeys.theme)).toBe(value)
      expect(document.documentElement.classList.contains(value)).toBe(true)
      expect(getComputedStyle(themeElement).backgroundColor).toBe("rgba(0, 0, 0, 0)")
    }
    await choose("Preview density", "Compact")
    await expect.poll(() => localStorage.getItem(preferenceKeys.density)).toBe("compact")
    expect(container.querySelector(".density-compact")).toBeNull()
  })

  it("restores theme, density and the persisted locale after a real provider remount", async () => {
    render()
    await expect.element(page.getByRole("combobox", { name: "Theme", exact: true })).toBeVisible()
    await choose("Theme", "Pitch black")
    await choose("Preview density", "Compact")
    await choose("Language", "简体中文")
    await expect.poll(() => localStorage.getItem(preferenceKeys.language)).toBe("zh-CN")
    root.unmount()
    router.dispose()
    root = createRoot(container)
    render(`/${localStorage.getItem(preferenceKeys.language)}/docs/components/input/`)
    await expect.element(page.getByRole("combobox", { name: "主题", exact: true })).toHaveTextContent("纯黑")
    await expect.element(page.getByRole("combobox", { name: "预览密度", exact: true })).toHaveTextContent("紧凑")
    await expect.element(page.getByRole("combobox", { name: "语言", exact: true })).toHaveTextContent("简体中文")
    expect(document.documentElement.classList.contains("pitch-black")).toBe(true)
    expect(document.documentElement.classList.contains("dark")).toBe(true)
    expect(router.state.location.pathname).toBe("/zh-CN/docs/components/input/")
  })

  it.each([
    ["?example=c-input-1&keep=yes#examples", "?example=c-input-1&keep=yes#examples"],
    ["?example=missing&keep=yes#missing", "?keep=yes"],
  ])("preserves the page and draft when switching language from %s", async (suffix, expectedSuffix) => {
    render(`/zh-CN/docs/components/input/${suffix}`)
    const language = page.getByRole("combobox", { name: "语言", exact: true })
    await expect.element(language).toBeVisible()
    const draft = container.querySelector<HTMLInputElement>("input[aria-label='Retained draft']")!
    await page.elementLocator(draft).fill("Keep this draft")
    await choose("语言", "English")
    await expect.element(page.getByTestId("settings-location")).toHaveTextContent(`/en/docs/components/input/${expectedSuffix}`)
    await expect.element(page.getByRole("combobox", { name: "Language", exact: true })).toHaveTextContent("English")
    expect(localStorage.getItem(preferenceKeys.language)).toBe("en")
    expect(container.querySelector("input[aria-label='Retained draft']")).toBe(draft)
    expect(draft.value).toBe("Keep this draft")
  })
})
