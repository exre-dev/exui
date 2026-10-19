import "@exre/exui/style.css"

import { createRoot } from "react-dom/client"
import { page } from "vitest/browser"
import { expect, it } from "vitest"
import { z } from "zod"
import { Form } from "@exre/exui"

const schema = z.object({ text: z.string(), notes: z.string(), choice: z.string(), date: z.string(), search: z.array(z.string()), files: z.array(z.custom<File>()) })

it.each(["light", "dark", "pitch-black"])("keeps Input borders transparent and other form surfaces outlined in theme %s", async theme => {
  const previousClass = document.documentElement.className
  document.documentElement.classList.remove("dark", "pitch-black")
  if (theme !== "light") document.documentElement.classList.add(theme)
  const host = document.createElement("div")
  document.body.replaceChildren(host)
  const root = createRoot(host)
  try {
    root.render(<Form schema={schema} defaultValues={{ text: "", notes: "", choice: "one", date: "", search: [], files: [] }}
      fields={[
        { name: "text", label: "Text", control: "text" },
        { name: "notes", label: "Notes", control: "textarea" },
        { name: "choice", label: "Choice", control: "select", controlProps: { options: [{ value: "one", label: "One" }] } },
        { name: "date", label: "Date", control: "date" },
        { name: "search", label: "Search", control: "multi-select", controlProps: { options: [{ value: "one", label: "One" }] } },
        { name: "files", label: "Files", control: "files" },
      ]} onSubmit={() => {}} />)
    await expect.element(page.getByRole("textbox", { name: "Text", exact: true })).toBeVisible()
    const surfaces = host.querySelectorAll<HTMLElement>('[data-slot="input"], textarea, [data-slot="select-trigger"], .ex-form-date-trigger, .ex-form-multiselect, .ex-form-files > button')
    expect(surfaces).toHaveLength(6)
    const field = (label: string) => [...host.querySelectorAll<HTMLElement>('[data-slot="field"]')]
      .find(item => item.querySelector('[data-slot="field-label"]')?.textContent === label)!
    const backgrounds = [
      field("Text").querySelector('[data-slot="input"]')!,
      field("Search").querySelector('.ex-form-multiselect')!,
      field("Date").querySelector('.ex-form-date-trigger')!,
      field("Files").querySelector('.ex-form-files button')!,
    ].map(surface => getComputedStyle(surface).backgroundColor)
    expect(new Set(backgrounds).size, JSON.stringify(backgrounds)).toBe(1)
    const borders = new Set<string>()
    for (const surface of surfaces) {
      const style = getComputedStyle(surface)
      expect(style.borderTopWidth).toBe("1px")
      expect(style.borderTopStyle).toBe("solid")
      if (surface.dataset.slot === "input") {
        expect(style.borderTopColor).toBe("rgba(0, 0, 0, 0)")
        continue
      }
      expect(style.borderTopColor).not.toBe("rgba(0, 0, 0, 0)")
      expect(style.borderTopColor).not.toBe(style.backgroundColor)
      borders.add(style.borderTopColor)
    }
    expect(borders.size).toBe(1)
  } finally {
    root.unmount()
    document.documentElement.className = previousClass
  }
})
