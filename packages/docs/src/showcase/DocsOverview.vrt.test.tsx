import { createRoot, type Root } from "react-dom/client"
import { Link, MemoryRouter, Route, Routes } from "react-router"
import { page } from "vitest/browser"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import ComponentsOverview from "./ComponentsOverview"
import { LanguageContext } from "./language"
import "./ShowcaseStyles"

let root: Root
let container: HTMLDivElement

beforeEach(() => {
  container = document.createElement("div")
  document.body.append(container)
  root = createRoot(container)
})
afterEach(() => {
  root.unmount()
  container.remove()
})

describe("Docs component overview", () => {
  it("renders all families with example counts and navigates through the router without a search field", async () => {
    root.render(<MemoryRouter><Routes>
      <Route path="/" element={<LanguageContext.Provider value={{ language: "en", setLanguage: () => {} }}>
        <ComponentsOverview exampleCounts={{ button: 61 }} density="compact" renderLink={(entry, children) =>
          <Link className="overview-card-link" to={`/en/docs/${entry.group}/${entry.id}/`}>{children}</Link>
        } />
      </LanguageContext.Provider>} />
      <Route path="/en/docs/components/button/" element={<h1>Button detail</h1>} />
    </Routes></MemoryRouter>)
    await expect.element(page.getByTestId("components-overview")).toBeVisible()
    expect(container.querySelectorAll('[data-overview-group="components"] [data-overview-card]')).toHaveLength(86)
    expect(container.querySelectorAll('[data-overview-group="exui"] [data-overview-card]')).toHaveLength(5)
    expect(container.querySelector('input[type="search"]')).toBeNull()
    const card = container.querySelector<HTMLElement>('[data-overview-card="button"]')!
    expect(card.querySelector(".overview-card-count")?.textContent).toBe("61 examples")
    expect(card.querySelector(".overview-card-preview")?.classList.contains("density-compact")).toBe(true)
    expect(card.querySelectorAll("a")).toHaveLength(1)
    expect(card.querySelector("[inert][aria-hidden=true]")).not.toBeNull()
    await page.elementLocator(card).getByRole("link").click()
    await expect.element(page.getByRole("heading", { name: "Button detail" })).toBeVisible()
  })
})
