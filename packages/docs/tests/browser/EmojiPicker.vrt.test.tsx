import "../../app/styles/docs.css"
import {
  EmojiPicker, EmojiPickerCategories, EmojiPickerHeader, EmojiPickerList,
  EmojiPickerPanel, EmojiPickerSearch, type EmojiPickerData, type EmojiPickerProps,
} from "@exre/exui"
import { useState } from "react"
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
  it("removes the selected emoji, closes a controlled popup and returns focus", async () => {
    const events: string[] = []
    function ControlledPicker() {
      const [value, setValue] = useState<string | null>("😀")
      const [open, setOpen] = useState(false)
      return <EmojiPicker {...defaults} value={value} open={open}
        onValueChange={(next) => { events.push(`value:${next}`); setValue(next) }}
        onOpenChange={(next) => { events.push(`open:${next}`); setOpen(next) }}
        onRemove={() => events.push("remove")} />
    }
    root.render(<ControlledPicker />)
    await page.getByRole("button", { name: /^Add emoji:/ }).click()
    events.length = 0
    await page.getByRole("button", { name: "Remove emoji", exact: true }).click()
    await expect.poll(() => document.querySelector('[data-slot="popover-content"]')).toBeNull()
    await expect.element(page.getByRole("button", { name: "Add emoji", exact: true })).toHaveFocus()
    expect(events).toEqual(["value:null", "open:false", "remove"])
    await page.getByRole("button", { name: "Add emoji", exact: true }).click()
    await expect.element(page.getByRole("option", { name: "Grinning face", exact: true })).toHaveAttribute("aria-selected", "false")
    await expect.element(page.getByRole("button", { name: "Remove emoji", exact: true })).not.toBeInTheDocument()
  })

  it.each([false, true])("keeps removal available without search in default and composed panels (composed=%s)", async (composed) => {
    const removed = vi.fn()
    root.render(<EmojiPicker {...defaults} hideSearch defaultValue="😀" onRemove={removed}>
      <EmojiPickerPanel>{composed ? <><EmojiPickerHeader><EmojiPickerSearch /></EmojiPickerHeader><EmojiPickerCategories /><EmojiPickerList /></> : undefined}</EmojiPickerPanel>
    </EmojiPicker>)
    await expect.element(page.getByRole("combobox", { name: "Search emoji" })).not.toBeInTheDocument()
    const remove = page.getByRole("button", { name: "Remove emoji", exact: true })
    await expect.element(remove).toBeVisible()
    expect(remove.element().closest('[data-slot="emoji-picker-categories"]')).not.toBeNull()
    expect(container.querySelector('[data-slot="emoji-picker-header"]')?.getBoundingClientRect().height ?? 0).toBe(0)
    await remove.click()
    expect(removed).toHaveBeenCalledTimes(1)
    await expect.element(remove).not.toBeInTheDocument()
    await expect.element(page.getByRole("listbox", { name: "Emoji", exact: true })).toHaveFocus()
    await expect.element(page.getByRole("option", { name: "Grinning face", exact: true })).toHaveAttribute("aria-selected", "false")
  })

  it("offers removal only for a selected single value with an onRemove callback", async () => {
    const render = (props: EmojiPickerProps) => root.render(<EmojiPicker {...defaults} {...props}>
      <EmojiPickerPanel />
    </EmojiPicker>)
    render({ onRemove: () => {} })
    await expect.element(page.getByRole("listbox", { name: "Emoji", exact: true })).toBeVisible()
    await expect.element(page.getByRole("button", { name: "Remove emoji", exact: true })).not.toBeInTheDocument()
    render({ value: "😀" })
    await expect.element(page.getByRole("button", { name: "Remove emoji", exact: true })).not.toBeInTheDocument()
    // @ts-expect-error Removal is limited to single selection; JavaScript consumers also get the runtime guard.
    render({ multiple: true, value: ["😀"], onRemove: () => {} })
    await expect.element(page.getByRole("button", { name: "Remove emoji", exact: true })).not.toBeInTheDocument()
  })

  it("keeps search at 2rem and removal beside the category tabs across root fonts and densities", async () => {
    const previousFontSize = document.documentElement.style.fontSize
    try {
      for (const rem of [16, 20]) {
        document.documentElement.style.fontSize = `${rem}px`
        for (const density of ["standard", "compact"]) {
          root.render(<div data-density={density}><EmojiPicker {...defaults} defaultValue="😀" onRemove={() => {}}><EmojiPickerPanel /></EmojiPicker></div>)
          await expect.element(page.getByRole("button", { name: "Remove emoji", exact: true })).toBeVisible()
          const search = container.querySelector<HTMLElement>('[data-slot="emoji-picker-search"]')!
          const input = search.querySelector("input")!
          const remove = page.getByRole("button", { name: "Remove emoji", exact: true }).element()
          const categories = container.querySelector<HTMLElement>('[data-slot="emoji-picker-categories"]')!
          const tabs = categories.querySelector<HTMLElement>('[data-slot="tabs"]')!
          await expect.poll(() => search.getBoundingClientRect().height).toBeCloseTo(rem * 2, 1)
          await expect.poll(() => remove.getBoundingClientRect().height).toBeCloseTo(rem * 2, 1)
          expect(remove.getBoundingClientRect().width).toBeCloseTo(rem * 2, 1)
          expect(input.getBoundingClientRect().height).toBeLessThanOrEqual(search.getBoundingClientRect().height)
          expect(categories.contains(remove)).toBe(true)
          expect(remove.closest('[role="tablist"]')).toBeNull()
          expect(remove.getBoundingClientRect().left).toBeGreaterThanOrEqual(tabs.getBoundingClientRect().right)
          expect(remove.getBoundingClientRect().top).toBeGreaterThanOrEqual(search.getBoundingClientRect().bottom)
          expect(Math.abs((remove.getBoundingClientRect().top + remove.getBoundingClientRect().bottom) / 2 - (tabs.getBoundingClientRect().top + tabs.getBoundingClientRect().bottom) / 2)).toBeLessThan(1)
          expect(parseFloat(getComputedStyle(remove).borderRadius)).toBeGreaterThanOrEqual(rem)
        }
      }
    } finally {
      document.documentElement.style.fontSize = previousFontSize
    }
  })

  it("keeps all categories reachable in a narrow row alongside removal", async () => {
    const categories = ["smileys", "people", "nature", "food", "travel", "activities", "objects", "symbols", "flags", "team"]
    const manyCategories: EmojiPickerData = { locale: "en", categories: {}, emojis: categories.map((category, index) => ({ ...data.emojis[0], id: `test-${index}`, category })) }
    container.style.width = "12rem"
    root.render(<EmojiPicker {...defaults} data={manyCategories} hideSearch defaultValue="😀" onRemove={() => {}}
      defaultRecent={[{ id: "test-0", count: 1 }]} customCategories={[{ id: "team", label: "Team" }]}>
      <EmojiPickerPanel />
    </EmojiPicker>)
    const remove = page.getByRole("button", { name: "Remove emoji", exact: true })
    await expect.element(remove).toBeVisible()
    const row = container.querySelector<HTMLElement>('[data-slot="emoji-picker-categories"]')!
    expect(row.contains(remove.element())).toBe(true)
    await expect.poll(() => row.querySelectorAll('[role="tab"]').length).toBe(11)
    await page.getByRole("tab", { name: "Frequently used", exact: true }).click()
    await userEvent.keyboard("{End}")
    const flags = page.getByRole("tab", { name: "Flags", exact: true })
    await expect.element(flags).toHaveFocus()
    const scrollArea = row.querySelector<HTMLElement>('[data-slot="tabs"]')!
    await expect.poll(() => scrollArea.scrollLeft).toBeGreaterThan(0)
    expect(flags.element().getBoundingClientRect().right).toBeLessThanOrEqual(remove.element().getBoundingClientRect().left)
    expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth + 1)
    await expect.element(remove).toBeVisible()
  })

  it("keeps removal outside category keyboard navigation and available during search", async () => {
    const removed = vi.fn()
    root.render(<EmojiPicker {...defaults} defaultValue="😀" onRemove={removed}><EmojiPickerPanel /></EmojiPicker>)
    const search = page.getByRole("combobox", { name: "Search emoji" })
    await search.fill("no-matching-emoji")
    const remove = page.getByRole("button", { name: "Remove emoji", exact: true })
    await expect.element(remove).toBeVisible()
    await page.getByRole("tab", { name: "Smileys & emotion", exact: true }).click()
    await userEvent.keyboard("{ArrowRight}")
    await expect.element(page.getByRole("tab", { name: "People & body", exact: true })).toHaveFocus()
    expect(removed).not.toHaveBeenCalled()
    await userEvent.keyboard("{Tab}")
    await expect.element(remove).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    expect(removed).toHaveBeenCalledTimes(1)
    await expect.element(page.getByRole("listbox", { name: "Emoji", exact: true })).toHaveFocus()
  })

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
    await example.getByRole("button", { name: "Remove emoji", exact: true }).click()
    await expect.element(emoji).toHaveAttribute("aria-selected", "false")
    await expect.element(example.getByText("Emoji removed", { exact: true })).toBeVisible()
    await expect.element(example.getByRole("button", { name: "Remove emoji", exact: true })).not.toBeInTheDocument()
  })

  it("removes the Page Icon showcase value through the category row action", async () => {
    root.render(<LanguageContext.Provider value={{ language: "en", setLanguage: () => {} }}>
      <ComponentExamplesHost family="emoji-picker" density="standard" />
    </LanguageContext.Provider>)
    const example = page.getByTestId("example-c-emoji-picker-4")
    await example.getByRole("button", { name: /^Page icon:/ }).click()
    await page.getByRole("button", { name: "Remove emoji", exact: true }).click()
    await expect.poll(() => document.querySelector('[data-slot="popover-content"]')).toBeNull()
    await expect.element(example.getByRole("button", { name: "Add icon", exact: true })).toHaveFocus()
    await expect.element(example.getByText("Page icon removed", { exact: true })).toBeVisible()
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
