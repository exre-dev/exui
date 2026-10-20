import "../../src/showcase/ShowcaseStyles"
import * as React from "react"
import { createRoot, type Root } from "react-dom/client"
import { TooltipProvider, wasRecentDrag } from "@exre/exui"
import { page } from "vitest/browser"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { LanguageContext, type ShowcaseLanguage } from "../../src/showcase/language"
import CalendarExample from "../../src/showcase/examples/event-calendar/c-event-calendar-3"

let root: Root
let container: HTMLDivElement
let changeLanguage: (language: ShowcaseLanguage) => void

function CalendarCopyFixture() {
  const [language, setLanguage] = React.useState<ShowcaseLanguage>("zh-CN")
  React.useEffect(() => { changeLanguage = setLanguage }, [])
  return <LanguageContext.Provider value={{ language, setLanguage }}><TooltipProvider>
    <button onClick={() => setLanguage("en")}>English</button>
    <button onClick={() => setLanguage("zh-CN")}>中文</button>
    <div style={{ width: "1100px" }}><CalendarExample /></div>
  </TooltipProvider></LanguageContext.Provider>
}

beforeEach(async () => {
  container = document.createElement("div")
  document.body.append(container)
  root = createRoot(container)
  root.render(<CalendarCopyFixture />)
  await document.fonts.ready
})

afterEach(() => {
  root.unmount()
  container.remove()
})

async function openPresetEditor(visibleTitle: string) {
  await expect.element(page.getByText(visibleTitle, { exact: true })).toBeVisible()
  const event = Array.from(container.querySelectorAll<HTMLButtonElement>('button[data-slot="event-calendar-event"]'))
    .find(button => button.textContent?.includes(visibleTitle))
  expect(event, `calendar event ${visibleTitle}`).toBeDefined()
  await expect.element(page.elementLocator(event!)).toBeVisible()
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  // The public calendar suppresses chip clicks briefly after a drag (and at realm startup).
  await expect.poll(() => wasRecentDrag()).toBe(false)
  await page.elementLocator(event!).click()
  await expect.element(page.getByRole("dialog")).toBeVisible()
}

describe.skipIf(window.innerWidth < 1000)("official Event Calendar CRUD title ownership", () => {
  it("keeps an untouched preset translatable after Save changes", async () => {
    await openPresetEditor("设计评审")
    await expect.element(page.getByRole("textbox", { name: "标题", exact: true })).toHaveValue("设计评审")
    await page.getByRole("button", { name: /Save changes|保存更改/ }).click()

    await page.getByRole("button", { name: "English", exact: true }).click()
    await expect.element(page.getByText("Design review", { exact: true })).toBeVisible()
    await page.getByRole("button", { name: "中文", exact: true }).click()
    await expect.element(page.getByText("设计评审", { exact: true })).toBeVisible()
  })

  it("keeps an explicitly entered Chinese title raw even when it equals the translated preset", async () => {
    await openPresetEditor("设计评审")
    const title = page.getByRole("textbox", { name: "标题", exact: true })
    await title.fill("")
    await title.fill("设计评审")
    await page.getByRole("button", { name: /Save changes|保存更改/ }).click()

    await page.getByRole("button", { name: "English", exact: true }).click()
    await expect.element(page.getByText("设计评审", { exact: true })).toBeVisible()
    await openPresetEditor("设计评审")
    await expect.element(page.getByRole("textbox", { name: "Title", exact: true })).toHaveValue("设计评审")
  })

  it("keeps a new English title raw and retains the same open draft Input through a language change", async () => {
    await page.getByRole("button", { name: "English", exact: true }).click()
    await page.getByRole("button", { name: "Add event", exact: true }).click()
    const title = page.getByRole("textbox", { name: "Title", exact: true })
    await title.fill("Design review")
    const input = title.element()
    await expect.poll(() => document.activeElement).toBe(input)

    // The modal makes its siblings inert, so drive the same live language context.
    changeLanguage("zh-CN")
    const translated = page.getByRole("textbox", { name: "标题", exact: true })
    await expect.element(translated).toHaveValue("Design review")
    expect(translated.element()).toBe(input)
    expect(document.activeElement).toBe(input)
    await page.getByRole("button", { name: /Create event|创建事件/ }).click()

    await expect.element(page.getByText("Design review", { exact: true })).toBeVisible()
    await page.getByText("Design review", { exact: true }).click()
    await expect.element(page.getByRole("textbox", { name: "标题", exact: true })).toHaveValue("Design review")
  })
})
