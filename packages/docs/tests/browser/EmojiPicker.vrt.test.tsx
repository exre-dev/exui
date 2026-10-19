import "../../app/styles/docs.css"
import {
  EmojiPicker, EmojiPickerCategories, EmojiPickerHeader, EmojiPickerList,
  EmojiPickerPanel, EmojiPickerSearch, type EmojiPickerData,
} from "@exre/exui"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { ComponentExamplesHost } from "../../app/components/ComponentExamplesHost"
import { LanguageContext } from "../../src/showcase/language"

const data: EmojiPickerData = {
  locale: "en",
  categories: { smileys: "Smileys & emotion", people: "People & body" },
  emojis: [
    { id: "1F600", emoji: "😀", label: "grinning face", tags: ["happy"], shortcodes: ["grinning"], category: "smileys", version: 1 },
    { id: "1F44D", emoji: "👍", label: "thumbs up", tags: ["yes"], shortcodes: ["thumbsup"], category: "people", version: 1,
      skins: ["👍🏻", "👍🏼", "👍🏽", "👍🏾", "👍🏿"], skinVersion: 1 },
  ],
}
const defaults = { data, emojiVersion: 17, recentStorageKey: null, skinToneStorageKey: null } as const
let container: HTMLDivElement
let root: Root

beforeEach(() => {
  container = document.createElement("div")
  container.style.width = "min(calc(100vw - 2rem), 30rem)"
  document.body.append(container)
  root = createRoot(container)
})

afterEach(() => {
  root.unmount()
  container.remove()
})

describe("EmojiPicker search visibility", () => {
  it("returns focus to the trigger when closing a popup with focused search", async () => {
    root.render(<EmojiPicker {...defaults} />)
    const trigger = page.getByRole("button", { name: "Add emoji", exact: true })
    await trigger.click()
    const search = page.getByRole("combobox", { name: "Search emoji" })
    await expect.element(search).toHaveFocus()
    await userEvent.keyboard("{Escape}")
    await expect.poll(() => document.querySelector('[data-slot="popover-content"]')).toBeNull()
    await expect.element(trigger).toHaveFocus()
  })

  it.each([false, true])("moves focus from a newly hidden search to the grid (popup=%s)", async (popup) => {
    const render = (hideSearch: boolean) => root.render(<EmojiPicker {...defaults} defaultOpen={popup} hideSearch={hideSearch}>
      {popup ? undefined : <EmojiPickerPanel />}
    </EmojiPicker>)
    render(false)
    const search = page.getByRole("combobox", { name: "Search emoji" })
    await search.click()
    await expect.element(search).toHaveFocus()
    render(true)
    await expect.element(page.getByRole("listbox", { name: "Emoji", exact: true })).toHaveFocus()
  })

  it("toggles search in the real documentation example without losing its selection", async () => {
    root.render(<LanguageContext.Provider value={{ language: "en", setLanguage: () => {} }}>
      <ComponentExamplesHost family="emoji-picker" density="standard" />
    </LanguageContext.Provider>)
    const example = page.getByTestId("example-exui-emoji-picker-search")
    const toggle = example.getByRole("switch", { name: "Hide search", exact: true })
    await expect.element(toggle).toBeChecked()
    await expect.element(example.getByRole("combobox", { name: "Search emoji" })).not.toBeInTheDocument()
    const emoji = example.getByRole("option", { name: "Grinning face", exact: true })
    await emoji.click()
    await expect.element(emoji).toHaveAttribute("aria-selected", "true")
    await toggle.click()
    await expect.element(example.getByRole("combobox", { name: "Search emoji" })).toBeVisible()
    await expect.element(emoji).toHaveAttribute("aria-selected", "true")
    await toggle.click()
    await expect.element(example.getByRole("combobox", { name: "Search emoji" })).not.toBeInTheDocument()
    await expect.element(emoji).toHaveAttribute("aria-selected", "true")
  })

  it("omits the information footer and skin-tone selector from the default panel", async () => {
    root.render(<EmojiPicker {...defaults}><EmojiPickerPanel /></EmojiPicker>)
    await expect.element(page.getByRole("listbox", { name: "Emoji", exact: true })).toBeVisible()
    expect(container.querySelector('[data-slot="emoji-picker-footer"]')).toBeNull()
    expect(container.querySelector('[data-slot="emoji-picker-preview"]')).toBeNull()
    expect(container.querySelector('[data-slot="emoji-picker-skin-tone"]')).toBeNull()
  })

  it("shows search by default and filters emoji", async () => {
    root.render(<EmojiPicker {...defaults}><EmojiPickerPanel /></EmojiPicker>)
    const search = page.getByRole("combobox", { name: "Search emoji" })
    await expect.element(search).toBeVisible()
    await search.fill("thumbsup")
    await expect.element(page.getByRole("option", { name: "Thumbs up", exact: true })).toBeVisible()
    await expect.element(page.getByRole("option", { name: "Grinning face", exact: true })).not.toBeInTheDocument()
  })

  it("hides the inline search and keeps keyboard selection working", async () => {
    const selected = vi.fn()
    root.render(<EmojiPicker {...defaults} hideSearch onEmojiSelect={selected}><EmojiPickerPanel /></EmojiPicker>)
    const list = page.getByRole("listbox", { name: "Emoji", exact: true })
    await expect.element(list).toBeVisible()
    expect(container.querySelector('[data-slot="emoji-picker-search"]')).toBeNull()
    expect(container.querySelector('[data-slot="emoji-picker-header"]')).toBeNull()
    await list.click()
    await userEvent.keyboard("{Home}{Enter}")
    expect(selected).toHaveBeenCalledWith(expect.objectContaining({ value: "😀" }))
  })

  it("focuses the grid in a popup without search and returns focus on Escape", async () => {
    root.render(<EmojiPicker {...defaults} hideSearch />)
    const trigger = page.getByRole("button", { name: "Add emoji", exact: true })
    await trigger.click()
    const list = page.getByRole("listbox", { name: "Emoji", exact: true })
    await expect.element(list).toHaveFocus()
    await expect.element(page.getByRole("combobox", { name: "Search emoji" })).not.toBeInTheDocument()
    await userEvent.keyboard("{Escape}")
    await expect.poll(() => document.querySelector('[data-slot="popover-content"]')).toBeNull()
    await expect.element(trigger).toHaveFocus()
  })

  it("applies hideSearch to composed search and restores its query when shown", async () => {
    const render = (hideSearch: boolean) => root.render(<EmojiPicker {...defaults} hideSearch={hideSearch} query="thumbsup">
      <EmojiPickerPanel><EmojiPickerHeader><EmojiPickerSearch /></EmojiPickerHeader><EmojiPickerCategories /><EmojiPickerList /></EmojiPickerPanel>
    </EmojiPicker>)
    render(true)
    await expect.element(page.getByRole("option", { name: "Thumbs up", exact: true })).toBeVisible()
    expect(container.querySelector('[data-slot="emoji-picker-search"]')).toBeNull()
    render(false)
    await expect.poll(() => container.querySelector('[data-slot="emoji-picker-search"]')).not.toBeNull()
    await expect.element(page.getByRole("combobox", { name: "Search emoji" })).toHaveValue("thumbsup")
  })
})
