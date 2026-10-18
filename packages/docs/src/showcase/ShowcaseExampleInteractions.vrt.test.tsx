import "@exre/exui/style.css"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { toast, TooltipProvider } from "@exre/exui"
import Showcase from "./Showcase"
import { ShowcaseLanguageProvider } from "./ShowcaseLanguageProvider"
import SidebarExample from "./examples/sidebar/c-sidebar-1"

const keys = ["exui-showcase-language", "exui-showcase-theme", "exui-showcase-density"] as const
type ActiveToast = Exclude<ReturnType<typeof toast.getToasts>[number], { dismiss: boolean }>
function activeToasts(): ActiveToast[] {
  return toast.getToasts().filter((item): item is ActiveToast => !("dismiss" in item))
}
let root: Root
let container: HTMLDivElement
let saved: { hash: string; classes: string; lang: string; title: string; scrollX: number; scrollY: number; storage: (string | null)[]; sidebarCookie: string | null }

beforeEach(async () => {
  saved = { hash: location.hash, classes: document.documentElement.className,
    lang: document.documentElement.lang, title: document.title, scrollX, scrollY, storage: keys.map(key => localStorage.getItem(key)),
    sidebarCookie: document.cookie.split("; ").find(part => part.startsWith("sidebar_state=")) ?? null }
  keys.forEach((key, index) => localStorage.setItem(key, ["en", "light", "standard"][index]))
  history.replaceState(null, "", "#/components/button")
  container = document.createElement("div")
  document.body.replaceChildren(container)
  root = createRoot(container)
  if (window.innerWidth >= 1000) {
    root.render(<Showcase />)
    await document.fonts.ready
    await expect.poll(() => container.querySelector("[data-page-loaded]")?.getAttribute("data-page-loaded")).toBe("button")
  }
})

describe.skipIf(window.innerWidth >= 1000)("mobile Sidebar example fixture", () => {
  it("bounds the real Sheet overlay to its preview and restores focus after Escape", async () => {
    root.render(<ShowcaseLanguageProvider><TooltipProvider>
      <div className="showcase-preview" data-example-id="c-sidebar-1" style={{ position: "relative", width: 320, minHeight: 720, overflow: "hidden", margin: "auto" }}>
        <SidebarExample />
      </div>
    </TooltipProvider></ShowcaseLanguageProvider>)
    await document.fonts.ready
    await expect.poll(() => container.querySelector('[data-example-id="c-sidebar-1"]')).not.toBeNull()
    const preview = container.querySelector<HTMLElement>('[data-example-id="c-sidebar-1"]')!
    const host = preview.querySelector<HTMLElement>('[data-example-sidebar-scope]')
    expect(host, "the scoped SidebarProvider remains inside its preview").not.toBeNull()
    expect(preview.contains(host)).toBe(true)
    const trigger = within(preview, '[data-slot="sidebar-trigger"]')
    await trigger.click()
    await expect.poll(() => document.querySelector('[data-slot="sidebar"][data-mobile="true"]')).not.toBeNull()
    const content = document.querySelector<HTMLElement>('[data-slot="sidebar"][data-mobile="true"]')!
    const marker = content.querySelector<HTMLElement>('[data-example-sidebar-marker]')
    expect(marker, "mobile Sheet content contains its owner marker").not.toBeNull()
    const owner = marker!.getAttribute("data-example-sidebar-marker")!
    const overlaySelector = `[data-slot="sheet-overlay"][data-example-sidebar-overlay="${CSS.escape(owner)}"]`
    await expect.poll(() => document.querySelector(overlaySelector)).not.toBeNull()
    const overlay = document.querySelector<HTMLElement>(overlaySelector)!
    await expect.poll(() => {
      const rect = overlay!.getBoundingClientRect()
      const bounds = host!.getBoundingClientRect()
      return Math.max(...(["left", "top", "right", "bottom"] as const).map(edge => Math.abs(rect[edge] - bounds[edge])))
    }).toBeLessThanOrEqual(2)
    const previewBounds = preview.getBoundingClientRect()
    const overlayBounds = overlay.getBoundingClientRect()
    const contentBounds = content.getBoundingClientRect()
    for (const bounds of [overlayBounds, contentBounds]) {
      expect(bounds.left).toBeGreaterThanOrEqual(previewBounds.left - 2)
      expect(bounds.top).toBeGreaterThanOrEqual(previewBounds.top - 2)
      expect(bounds.right).toBeLessThanOrEqual(previewBounds.right + 2)
      expect(bounds.bottom).toBeLessThanOrEqual(previewBounds.bottom + 2)
    }
    preview.style.width = "300px"
    window.dispatchEvent(new Event("resize"))
    await expect.poll(() => Math.abs(overlay.getBoundingClientRect().width - host!.getBoundingClientRect().width)).toBeLessThanOrEqual(2)
    await userEvent.tab()
    expect(content.contains(document.activeElement)).toBe(true)
    await userEvent.keyboard("{Escape}")
    await expect.poll(() => document.querySelector('[data-slot="sidebar"][data-mobile="true"]')).toBeNull()
    expect(document.activeElement).toBe(trigger.element())
    root.render(<div />)
    await expect.poll(() => preview.isConnected).toBe(false)
    window.dispatchEvent(new Event("resize"))
    expect(document.querySelector('[data-slot="sheet-overlay"]')).toBeNull()
  })
})
afterEach(() => {
  root.unmount()
  document.documentElement.className = saved.classes
  document.documentElement.lang = saved.lang
  document.title = saved.title
  history.replaceState(null, "", saved.hash || location.pathname + location.search)
  keys.forEach((key, index) => saved.storage[index] === null ? localStorage.removeItem(key) : localStorage.setItem(key, saved.storage[index]!))
  scrollTo(saved.scrollX, saved.scrollY)
  document.cookie = saved.sidebarCookie ? `${saved.sidebarCookie}; path=/` : "sidebar_state=; path=/; max-age=0"
  toast.dismiss()
  vi.restoreAllMocks()
})

async function openPage(group: "components" | "exui", family: string) {
  location.hash = `#/${group}/${family}`
  await expect.poll(() => container.querySelector("[data-page-loaded]")?.getAttribute("data-page-loaded"), { timeout: 20000 }).toBe(family)
  return container.querySelector<HTMLElement>(`[data-page-loaded="${family}"]`)!
}
async function scene(family: string, id: string) {
  await openPage("components", family)
  await expect.poll(() => container.querySelector(`[data-example-id="${id}"]`), { timeout: 20000 }).not.toBeNull()
  const node = container.querySelector<HTMLElement>(`[data-example-id="${id}"]`)!
  node.scrollIntoView({ block: "center" })
  return node
}
function within(node: Element, selector: string) {
  const target = node.querySelector<HTMLElement>(selector)
  expect(target, selector).not.toBeNull()
  return page.elementLocator(target!)
}
async function setting(label: string, value: string) {
  await page.getByRole("combobox", { name: label, exact: true }).selectOptions(value)
}
async function tabIntoSceneTrigger(trigger: HTMLElement) {
  // A local focus entry avoids opening another page example's Tooltip first.
  const entry = trigger.parentElement!
  const previousTabIndex = entry.getAttribute("tabindex")
  entry.setAttribute("tabindex", "0")
  try {
    entry.focus({ preventScroll: true })
    await userEvent.keyboard("{Tab}")
    expect(document.activeElement).toBe(trigger)
  } finally {
    if (previousTabIndex === null) entry.removeAttribute("tabindex")
    else entry.setAttribute("tabindex", previousTabIndex)
  }
}
function setSettingBehindModal(label: string, value: string) {
  // An open modal makes the header inert; this changes only Showcase's preference.
  const select = container.querySelector<HTMLSelectElement>(`.showcase-topbar select[aria-label="${label}"]`)
  expect(select, `header setting ${label}`).not.toBeNull()
  select!.value = value
  select!.dispatchEvent(new Event("change", { bubbles: true }))
}

describe.skipIf(window.innerWidth < 1000)("adapted source example interactions", () => {
  it("keeps typed input and a selected option through theme, density and language changes", async () => {
    const input = await scene("input", "c-input-1")
    const textbox = within(input, 'input[placeholder="Basic Input"]')
    await textbox.fill("Persistent example draft")
    const originalInput = textbox.element() as HTMLInputElement
    await setting("Theme", "dark")
    await setting("Density", "compact")
    await setting("Language", "zh-CN")
    await expect.poll(() => originalInput.value).toBe("Persistent example draft")
    expect(input.querySelector('input[data-slot="input"]')).toBe(originalInput)
    const select = await scene("select", "c-select-1")
    const trigger = within(select, "[role=combobox]")
    const originalTrigger = trigger.element()
    await trigger.click()
    await page.getByRole("option", { name: "香蕉", exact: true }).click()
    const verifySelectedOption = async (label: string) => {
      await page.elementLocator(originalTrigger).click()
      await expect.element(page.getByRole("option", { name: label, exact: true })).toHaveAttribute("data-state", "checked")
      await userEvent.keyboard("{Escape}")
    }
    await expect.poll(() => originalTrigger.textContent).toContain("香蕉")
    await verifySelectedOption("香蕉")
    for (const [theme, density, language, labels] of [
      ["pitch-black", "standard", "en", ["主题", "密度", "语言"]],
      ["light", "compact", "zh-CN", ["Theme", "Density", "Language"]],
    ] as const) {
      await setting(labels[0], theme)
      await setting(labels[1], density)
      await setting(labels[2], language)
      await expect.poll(() => document.documentElement.lang).toBe(language)
      expect(select.querySelector('[role="combobox"]')).toBe(originalTrigger)
      await expect.poll(() => originalTrigger.textContent).toContain(language === "en" ? "Banana" : "香蕉")
      await verifySelectedOption(language === "en" ? "Banana" : "香蕉")
    }
    await scene("input", "c-input-1")
    // Navigation remounts a page; the input's value is intentionally reset.
    expect(input.isConnected).toBe(false)
  })

  it("opens a menu and exposes a disabled action", async () => {
    const menu = await scene("dropdown-menu", "c-dropdown-menu-1")
    await within(menu, "button").click()
    await expect.element(page.getByRole("menuitem", { name: "Profile" })).toBeVisible()
    await expect.element(page.getByRole("menuitem", { name: "API" })).toBeDisabled()
    await userEvent.keyboard("{Escape}")
    await expect.poll(() => document.querySelector('[role="menu"]')).toBeNull()

    const accountMenu = await scene("dropdown-menu", "c-dropdown-menu-15")
    const accountTrigger = accountMenu.querySelector<HTMLButtonElement>('button[aria-label="Open account menu"]')
    expect(accountTrigger).not.toBeNull()
    accountTrigger!.focus()
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}")
    await userEvent.keyboard("{Tab}")
    expect(document.activeElement).toBe(accountTrigger)
    await userEvent.keyboard("{Enter}")
    await expect.element(page.getByRole("menuitem", { name: "Billing" })).toBeVisible()
    await expect.element(page.getByRole("menuitem", { name: "Sign out" })).toBeVisible()
    await userEvent.keyboard("{Escape}")
    await expect.poll(() => document.querySelector('[role="menu"]')).toBeNull()
    expect(document.activeElement).toBe(accountTrigger)
    await userEvent.keyboard("{Space}")
    await expect.element(page.getByRole("menuitem", { name: "Profile" })).toBeVisible()
    await userEvent.keyboard("{Escape}")
    await expect.poll(() => document.querySelector('[role="menu"]')).toBeNull()
  })

  it("edits and submits a portal Dialog with real clicks and Escape focus return", async () => {
    const dialogScene = await scene("dialog", "c-dialog-1")
    const trigger = within(dialogScene, "button")
    await trigger.click()
    await expect.element(page.getByRole("dialog", { name: "Edit profile" })).toBeVisible()
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Acceptance profile")
    await page.getByRole("button", { name: "Save changes", exact: true }).click()
    await expect.poll(() => document.querySelector('[role="dialog"]')).toBeNull()
    await trigger.click()
    await expect.element(page.getByRole("textbox", { name: "Name", exact: true })).toHaveValue("Acceptance profile")
    await userEvent.keyboard("{Escape}")
    await expect.poll(() => document.querySelector('[role="dialog"]')).toBeNull()
    expect(document.activeElement).toBe(trigger.element())
  })

  it("keeps an open Dialog and its draft while translated labels update", async () => {
    const dialogScene = await scene("dialog", "c-dialog-1")
    await within(dialogScene, "button").click()
    const name = page.getByRole("textbox", { name: "Name", exact: true })
    await name.fill("Unsubmitted business value")
    const original = name.element()
    setSettingBehindModal("Language", "zh-CN")
    await expect.poll(() => document.documentElement.lang).toBe("zh-CN")
    const translated = page.getByRole("textbox", { name: "姓名", exact: true })
    await expect.element(translated).toHaveValue("Unsubmitted business value")
    expect(translated.element()).toBe(original)
    await expect.element(page.getByRole("dialog", { name: "编辑资料" })).toBeVisible()
    await userEvent.keyboard("{Escape}")
    await expect.poll(() => document.querySelector('[role="dialog"]')).toBeNull()
  })

  it("copies source code through the actual copy control", async () => {
    const code = await scene("code-block", "c-code-block-1")
    const written: string[] = []
    vi.spyOn(navigator.clipboard, "writeText").mockImplementation(async value => { written.push(value) })
    await within(code, "button").click()
    await expect.poll(() => written.length).toBe(1)
    expect(written[0]).toContain("useTotals")
  })

  it("pages Data Grid and retains its page through settings", async () => {
    const grid = await scene("data-grid", "c-data-grid-1")
    const rows = () => Array.from(grid.querySelectorAll<HTMLElement>("tbody tr[data-row-id]"), row => row.dataset.rowId)
    await expect.poll(() => rows().length).toBe(5)
    const first = rows()
    const nextPage = Array.from(grid.querySelectorAll<HTMLButtonElement>("button"))
      .find(button => button.textContent?.trim() === "Go to next page")
    expect(nextPage, "c-data-grid-1 next page control").toBeDefined()
    await page.elementLocator(nextPage!).click()
    await expect.poll(rows).not.toEqual(first)
    const second = rows()
    await setting("Theme", "dark")
    await setting("Density", "compact")
    await setting("Language", "zh-CN")
    expect(rows()).toEqual(second)
    expect(grid.isConnected).toBe(true)
  })

  it("sorts and selects real Data Grid rows", async () => {
    const sorted = await scene("data-grid", "c-data-grid-11")
    const header = sorted.querySelector<HTMLElement>('th[data-col-id="name"]')
    expect(header).not.toBeNull()
    const direction = header!.getAttribute("aria-sort")
    await within(header!, "button").click()
    await expect.poll(() => header!.getAttribute("aria-sort")).not.toBe(direction)
    const selected = await scene("data-grid", "c-data-grid-7")
    const firstRow = selected.querySelector<HTMLElement>("tbody tr[data-row-id]")
    expect(firstRow).not.toBeNull()
    await within(firstRow!, '[role="checkbox"]').click()
    await expect.poll(() => firstRow!.getAttribute("data-state")).toBe("selected")
    await setting("Theme", "dark")
    await setting("Density", "compact")
    expect(firstRow!.isConnected).toBe(true)
    expect(firstRow!.getAttribute("data-state")).toBe("selected")
  })

  it("translates basic Data Grid headers without replacing the preview", async () => {
    const basic = await scene("data-grid", "c-data-grid-1")
    const headers = () => Array.from(basic.querySelectorAll("thead th"), item => item.textContent?.trim())
    expect(headers()).toEqual(["Name", "Email", "Location", "Balance ($)"])
    await setting("Language", "zh-CN")
    await expect.poll(headers).toEqual(["姓名", "邮箱", "所在地", "余额（美元）"])
    expect(basic.isConnected).toBe(true)
  })

  it("translates a sortable Data Grid header without replacing its column", async () => {
    const sortable = await scene("data-grid", "c-data-grid-11")
    const staff = sortable.querySelector<HTMLElement>('th[data-col-id="name"]')!
    expect(staff.textContent).toContain("Staff")
    await setting("Language", "zh-CN")
    await expect.poll(() => staff.textContent).not.toContain("Staff")
    expect(staff.isConnected).toBe(true)
  })

  it("translates Data Grid empty state while retaining the search input and query", async () => {
    const filterable = await scene("data-grid", "c-data-grid-22")
    const search = within(filterable, 'input[placeholder="Search..."]')
    await search.fill("no-record-can-match-this-query")
    await expect.poll(() => filterable.querySelector('[data-slot="data-grid-table-empty"]')?.textContent).toContain("No data available")
    const originalInput = search.element()
    await setting("Language", "zh-CN")
    await expect.element(page.elementLocator(originalInput)).toHaveValue("no-record-can-match-this-query")
    await expect.poll(() => filterable.querySelector('[data-slot="data-grid-table-empty"]')?.textContent).toContain("暂无数据")
  })

  it("keeps every chart Shape gradient unique and painted across settings", async () => {
    const first = await scene("chart", "c-chart-7")
    const second = container.querySelector<HTMLElement>('[data-example-id="c-chart-10"]')
    expect(second).not.toBeNull()
    const scenes = [first, second!]
    const inspect = (host: HTMLElement) => {
      const shapes = Array.from(host.querySelectorAll<SVGRectElement>('svg rect[fill^="url("]'))
      expect(shapes.length, `${host.dataset.exampleId}: gradient shapes`).toBeGreaterThan(1)
      const ids = shapes.map(shape => /url\(\s*["']?#([^"')]+)["']?\s*\)/.exec(shape.getAttribute("fill") ?? "")?.[1])
      expect(ids.every(Boolean), `${host.dataset.exampleId}: local paint refs`).toBe(true)
      expect(new Set(ids).size, `${host.dataset.exampleId}: per Shape refs`).toBe(ids.length)
      for (const id of ids) {
        const definition = document.getElementById(id!)
        expect(definition?.localName, `${host.dataset.exampleId}: #${id}`).toBe("linearGradient")
        expect(host.contains(definition), `${host.dataset.exampleId}: same example #${id}`).toBe(true)
        expect(getComputedStyle(shapes[ids.indexOf(id)]).fill, `${host.dataset.exampleId}: computed paint`).toContain(id)
      }
      return ids
    }
    await expect.poll(() => first.querySelectorAll('svg rect[fill^="url("]').length).toBeGreaterThan(1)
    await expect.poll(() => second!.querySelectorAll('svg rect[fill^="url("]').length).toBeGreaterThan(1)
    const original = scenes.map(inspect)
    expect(new Set(original.flat()).size, "chart examples do not share gradient IDs").toBe(original.flat().length)
    await setting("Theme", "dark")
    await setting("Density", "compact")
    await setting("Language", "zh-CN")
    expect(scenes.every(host => host.isConnected)).toBe(true)
    const current = scenes.map(inspect)
    expect(current.map(ids => ids.length)).toEqual(original.map(ids => ids.length))
    expect(new Set(current.flat()).size, "chart examples still have distinct paint servers").toBe(current.flat().length)
  })

  it("translates a selected option label while preserving its business value", async () => {
    const select = await scene("select", "c-select-1")
    const trigger = within(select, "[role=combobox]")
    await trigger.click()
    await page.getByRole("option", { name: "Banana", exact: true }).click()
    const original = trigger.element()
    await trigger.click()
    const english = page.getByRole("option", { name: "Banana", exact: true })
    await expect.element(english).toHaveAttribute("data-state", "checked")
    await userEvent.keyboard("{Escape}")
    await setting("Language", "zh-CN")
    expect(select.querySelector('[role="combobox"]')).toBe(original)
    await expect.poll(() => original.textContent).toContain("香蕉")
    await page.elementLocator(original).click()
    const chinese = page.getByRole("option", { name: "香蕉", exact: true })
    await expect.element(chinese).toHaveAttribute("data-state", "checked")
  })

  it("keeps the Arabic Input Group extension RTL and preserves its draft across preferences", async () => {
    await openPage("components", "input-group")
    const extension = container.querySelector<HTMLElement>('[data-example-kind="exui-extension"]')
    expect(extension).not.toBeNull()
    expect(extension?.hasAttribute("data-example-id")).toBe(false)
    const search = within(extension!, 'input[aria-label="البحث عن مشروع"]')
    const notes = within(extension!, 'textarea[aria-label="ملاحظات الفريق"]')
    await search.fill("مشروع النجم")
    await notes.fill("قيمة عمل ثابتة")
    const searchElement = search.element()
    const notesElement = notes.element()
    for (const [theme, density, language, labels] of [
      ["dark", "compact", "zh-CN", ["Theme", "Density", "Language"]],
      ["pitch-black", "standard", "en", ["主题", "密度", "语言"]],
    ] as const) {
      await setting(labels[0], theme)
      await setting(labels[1], density)
      await setting(labels[2], language)
      expect(search.element()).toBe(searchElement)
      expect(notes.element()).toBe(notesElement)
      await expect.element(search).toHaveValue("مشروع النجم")
      await expect.element(notes).toHaveValue("قيمة عمل ثابتة")
      expect(getComputedStyle(searchElement).direction).toBe("rtl")
      expect(getComputedStyle(notesElement).direction).toBe("rtl")
    }
  })

  it("translates Time Picker status and keeps the separate editable example's value", async () => {
    const time = await scene("time-picker", "c-time-picker-1")
    const status = time.querySelector<HTMLElement>('[role="status"]')
    expect(status).not.toBeNull()
    await expect.poll(() => status!.textContent?.trim()).toBe("Meeting at 14:30")
    await setting("Language", "zh-CN")
    expect(time.querySelector('[role="status"]')).toBe(status)
    await expect.poll(() => status!.textContent?.trim()).toBe("会议时间：14:30")
    await setting("语言", "en")
    const editable = await scene("time-picker", "c-time-picker-3")
    const input = editable.querySelector<HTMLInputElement>('[data-slot="time-picker-input"] input')
    const editableStatus = editable.querySelector<HTMLElement>('[role="status"]')
    expect(input, "c-time-picker-3 editable input").not.toBeNull()
    expect(editableStatus).not.toBeNull()
    await page.elementLocator(input!).fill("14:30")
    await userEvent.keyboard("{Tab}")
    await expect.poll(() => input!.value).toBe("14:30")
    await expect.poll(() => editableStatus!.textContent?.trim()).toBe("Pickup at 14:30")
    await setting("Language", "zh-CN")
    expect(editable.querySelector('[data-slot="time-picker-input"] input')).toBe(input)
    await expect.poll(() => input!.value).toBe("14:30")
    await expect.poll(() => editableStatus!.textContent?.trim()).toBe("取货时间：14:30")
  })

  it("translates the File Type queue count and retry action while keeping file names", async () => {
    const queue = await scene("file-type", "c-file-type-8")
    await setting("Language", "zh-CN")
    const status = queue.querySelector<HTMLElement>('[role="status"]')
    expect(status).not.toBeNull()
    await expect.poll(() => status!.textContent?.trim()).toBe("已上传 1/4 个文件，1 个失败")
    const retry = page.elementLocator(queue).getByRole("button", { name: "重试上传 brand-assets.zip", exact: true })
    await expect.element(retry).toBeVisible()
    await retry.click()
    await expect.poll(() => status!.textContent?.trim()).toBe("已上传 2/4 个文件")
    expect(queue.textContent).toContain("brand-assets.zip")
    await expect.element(page.elementLocator(queue).getByRole("button", { name: "移除 brand-assets.zip", exact: true })).toBeVisible()
    await expect.element(page.elementLocator(queue).getByRole("progressbar", { name: "正在上传 q4-forecast.xlsx", exact: true })).toBeVisible()
  })

  it("translates Carousel image alt text without changing the image", async () => {
    const carousel = await scene("carousel", "c-carousel-1")
    const image = carousel.querySelector<HTMLImageElement>('img[alt="Slide 1"]')
    expect(image).not.toBeNull()
    const src = image!.src
    await setting("Language", "zh-CN")
    await expect.poll(() => image!.alt).toBe("幻灯片 1")
    expect(carousel.querySelector("img")).toBe(image)
    expect(image!.src).toBe(src)
  })

  it("keeps a scheduled Time Picker choice while its date summary changes language", async () => {
    const schedule = await scene("time-picker", "c-time-picker-13")
    const status = schedule.querySelector<HTMLElement>('[data-slot="card-footer"] [role="status"]')
    const picker = schedule.querySelector<HTMLElement>('[data-slot="time-picker-panel"]')
    const calendar = schedule.querySelector<HTMLElement>('.group\\/calendar')
    expect(status).not.toBeNull()
    expect(picker).not.toBeNull()
    expect(calendar).not.toBeNull()
    const selectedDay = () => schedule.querySelector<HTMLElement>('[data-slot="calendar"] [data-selected="true"] button')?.textContent?.trim()
    expect(selectedDay()).toBe("14")
    expect(calendar!.getAttribute("lang")).toBe("en-US")
    await expect.poll(() => status!.textContent?.trim()).toBe("Wed, Oct 14 at 09:00")
    await page.elementLocator(schedule).getByRole("button", { name: "Schedule", exact: true }).click()
    await expect.poll(() => status!.textContent).toContain("Scheduled for")
    await expect.poll(() => status!.textContent).toContain("Wed, Oct 14 at 09:00")
    await setting("Language", "zh-CN")
    expect(schedule.querySelector('[data-slot="card-footer"] [role="status"]')).toBe(status)
    expect(schedule.querySelector('[data-slot="time-picker-panel"]')).toBe(picker)
    expect(schedule.querySelector('[data-slot="calendar"]')?.getAttribute("lang")).toBe("zh-CN")
    expect(selectedDay()).toBe("14")
    await expect.poll(() => status!.textContent).toContain("计划时间")
    await expect.poll(() => status!.textContent).toContain("10月14日（周三）09:00")
    await setting("语言", "en")
    expect(selectedDay()).toBe("14")
    await expect.poll(() => status!.textContent).toContain("Scheduled for")
    await expect.poll(() => status!.textContent).toContain("Wed, Oct 14 at 09:00")
  })

  it("translates Attachment counts after real attach and remove without losing the draft", async () => {
    const composer = await scene("attachment", "c-attachment-2")
    const textarea = composer.querySelector<HTMLTextAreaElement>('textarea[data-slot="input-group-control"]')
    const live = composer.querySelector<HTMLElement>('[aria-live="polite"]')
    const visible = composer.querySelector<HTMLElement>('[data-slot="input-group-addon"][data-align="block-end"] span.text-muted-foreground')
    expect(textarea).not.toBeNull()
    expect(live).not.toBeNull()
    expect(visible).not.toBeNull()
    await page.elementLocator(textarea!).fill("Keep the billing incident draft")
    expect(visible!.textContent?.trim()).toBe("3 of 6 attached")
    expect(live!.textContent?.trim()).toBe("3 of 6 attached")
    await page.elementLocator(composer).getByRole("button", { name: "Attach a file" }).click()
    await expect.poll(() => visible!.textContent?.trim()).toBe("4 of 6 attached")
    expect(live!.textContent?.trim()).toBe("4 of 6 attached")
    expect(composer.textContent).toContain("rate-limits.md")
    await setting("Language", "zh-CN")
    expect(composer.querySelector('textarea[data-slot="input-group-control"]')).toBe(textarea)
    expect(textarea!.value).toBe("Keep the billing incident draft")
    await expect.poll(() => visible!.textContent?.trim()).toBe("已附加 4/6 个文件")
    expect(live!.textContent?.trim()).toBe("已附加 4/6 个文件")
    await page.elementLocator(composer).getByRole("button", { name: "移除 rate-limits.md" }).click()
    await expect.poll(() => visible!.textContent?.trim()).toBe("已附加 3/6 个文件")
    expect(live!.textContent?.trim()).toBe("已附加 3/6 个文件")
    expect(composer.textContent).not.toContain("rate-limits.md")
    expect(textarea!.value).toBe("Keep the billing incident draft")
    await setting("语言", "en")
    await expect.poll(() => visible!.textContent?.trim()).toBe("3 of 6 attached")
    expect(live!.textContent?.trim()).toBe("3 of 6 attached")
  })

  it("keeps an Autocomplete search query while its no-result status translates", async () => {
    const autocomplete = await scene("autocomplete", "c-autocomplete-9")
    const input = autocomplete.querySelector<HTMLInputElement>('[data-slot="autocomplete-input"]')
    expect(input).not.toBeNull()
    const query = "no-dev-matches-this-query-731"
    await page.elementLocator(input!).fill(query)
    const status = () => Array.from(document.querySelectorAll<HTMLElement>('[data-slot="autocomplete-status"]'))
      .find(element => element.textContent?.includes(query))
    await expect.poll(() => status()?.textContent).toContain(`No developers found for "${query}"`)
    setSettingBehindModal("Language", "zh-CN")
    expect(autocomplete.querySelector('[data-slot="autocomplete-input"]')).toBe(input)
    expect(input!.value).toBe(query)
    await page.elementLocator(input!).click()
    await expect.poll(() => status()?.textContent).toContain(`未找到与“${query}”匹配的开发者`)
    setSettingBehindModal("语言", "en")
    await page.elementLocator(input!).click()
    await expect.poll(() => status()?.textContent).toContain(`No developers found for "${query}"`)
    expect(input!.value).toBe(query)
  }, 10000)

  it("keeps a completed Questionnaire's source value and translated result", async () => {
    const questionnaire = await scene("questionnaire", "c-questionnaire-4")
    for (const choice of ["A warehouse table", "Under 1M rows", "The on-call rota", "Me"]) {
      await page.elementLocator(questionnaire).getByRole("radio", { name: choice, exact: true }).click()
      if (choice !== "Me") await within(questionnaire, '[data-slot="questionnaire-next"]').click()
    }
    await within(questionnaire, '[data-slot="questionnaire-submit"]').click()
    await expect.poll(() => questionnaire.textContent).toContain("Pipeline queued")
    await expect.poll(() => questionnaire.textContent).toContain("A warehouse table")
    await setting("Language", "zh-CN")
    expect(questionnaire.isConnected).toBe(true)
    await expect.poll(() => questionnaire.textContent).toContain("流水线已排队")
    await expect.poll(() => questionnaire.textContent).toContain("数据仓库中的表")
    expect(questionnaire.querySelector('[data-slot="questionnaire-next"]')).toBeNull()
    await setting("语言", "en")
    await expect.poll(() => questionnaire.textContent).toContain("Pipeline queued")
    await expect.poll(() => questionnaire.textContent).toContain("A warehouse table")
  })

  it("opens the Avatar tooltip by keyboard and localizes the Add user accessible name", async () => {
    const avatar = await scene("avatar", "c-avatar-24")
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    const trigger = avatar.querySelector<HTMLElement>('[role="img"][tabindex="0"][aria-label="David Kim"]')
    expect(trigger).not.toBeNull()
    await tabIntoSceneTrigger(trigger!)
    await expect.element(page.getByRole("tooltip")).toHaveTextContent("David Kim")
    const addScene = await scene("avatar", "c-avatar-29")
    const add = addScene.querySelector<HTMLButtonElement>('button[aria-label="Add user"]')
    expect(add).not.toBeNull()
    await expect.element(page.elementLocator(add!)).toBeVisible()
    await setting("Language", "zh-CN")
    expect(addScene.querySelector("button")).toBe(add)
    await expect.poll(() => add!.getAttribute("aria-label")).toBe("添加用户")
    await expect.element(page.elementLocator(add!)).toBeVisible()
  })

  it("opens Hover Card 3 from a keyboard-focused trigger and exposes its profile", async () => {
    const hoverCard = await scene("hover-card", "c-hover-card-3")
    const trigger = hoverCard.querySelector<HTMLElement>('[data-slot="hover-card-trigger"]')
    expect(trigger).not.toBeNull()
    trigger!.focus()
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}")
    await userEvent.keyboard("{Tab}")
    expect(document.activeElement).toBe(trigger)
    await expect.poll(() => document.querySelector('[data-slot="hover-card-content"]')).not.toBeNull()
    const content = document.querySelector<HTMLElement>('[data-slot="hover-card-content"]')!
    await expect.element(page.elementLocator(content)).toBeVisible()
    expect(content.textContent).toContain("Elena Soroka")
    expect(content.textContent).toContain("Lead Product Designer at Vibe.")
    expect(content.textContent).toContain("Joined December 2023")
  })

  it("opens Tooltip 12 by keyboard while its nested Delete Project button stays disabled", async () => {
    const tooltipScene = await scene("tooltip", "c-tooltip-12")
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    const trigger = tooltipScene.querySelector<HTMLElement>('[data-slot="tooltip-trigger"]')
    expect(trigger).not.toBeNull()
    const action = trigger!.querySelector<HTMLButtonElement>("button")
    expect(action).not.toBeNull()
    expect(action!.disabled).toBe(true)
    expect(trigger!.getAttribute("aria-disabled")).toBe("true")

    await tabIntoSceneTrigger(trigger!)
    await expect.element(page.getByRole("tooltip")).toHaveTextContent("You need admin access to delete projects")

    let actionClicks = 0
    const onActionClick = () => { actionClicks += 1 }
    action!.addEventListener("click", onActionClick)
    try {
      await userEvent.keyboard("{Enter}")
      await userEvent.keyboard("{Space}")
      expect(actionClicks).toBe(0)
      expect(action!.disabled).toBe(true)
    } finally {
      action!.removeEventListener("click", onActionClick)
    }
  })

  it("toggles Collapsible 10 by Enter and Space while retaining the selected file", async () => {
    const explorer = await scene("collapsible", "c-collapsible-10")
    const folder = explorer.querySelector<HTMLElement>('[data-slot="collapsible-trigger"]')
    expect(folder).not.toBeNull()
    expect(folder!.textContent).toContain("components")
    folder!.focus()
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}")
    await userEvent.keyboard("{Tab}")
    expect(document.activeElement).toBe(folder)
    await userEvent.keyboard("{Enter}")
    await expect.poll(() => folder!.getAttribute("aria-expanded")).toBe("true")
    const panel = document.getElementById(folder!.getAttribute("aria-controls")!)
    expect(panel, "folder controls its real content").not.toBeNull()
    await expect.element(page.elementLocator(panel!)).toBeVisible()
    const file = Array.from(panel!.querySelectorAll<HTMLButtonElement>("button"))
      .find(button => button.textContent?.trim() === "login-form.tsx")
    expect(file).toBeDefined()
    file!.focus()
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}")
    await userEvent.keyboard("{Tab}")
    expect(document.activeElement).toBe(file)
    await userEvent.keyboard("{Enter}")
    await expect.poll(() => file!.closest('[data-slot="item"]')?.getAttribute("data-active")).toBe("true")
    folder!.focus()
    await userEvent.keyboard("{Space}")
    await expect.poll(() => folder!.getAttribute("aria-expanded")).toBe("false")
    await userEvent.keyboard("{Space}")
    await expect.poll(() => folder!.getAttribute("aria-expanded")).toBe("true")
    const restoredPanel = document.getElementById(folder!.getAttribute("aria-controls")!)
    expect(restoredPanel).not.toBeNull()
    const restoredFile = Array.from(restoredPanel!.querySelectorAll<HTMLButtonElement>("button"))
      .find(button => button.textContent?.trim() === "login-form.tsx")
    expect(restoredFile?.closest('[data-slot="item"]')?.getAttribute("data-active")).toBe("true")
  })

  it("retains a newly added toned Emoji reaction while its label and live announcement translate", async () => {
    const previousTone = localStorage.getItem("reui-emoji-picker-skin-tone")
    try {
      const reactions = await scene("emoji-picker", "c-emoji-picker-3")
      const status = reactions.querySelector<HTMLElement>('[role="status"]')
      const trigger = reactions.querySelector<HTMLElement>('[data-slot="emoji-picker-trigger"]')
      expect(status).not.toBeNull()
      expect(trigger).not.toBeNull()
      expect(Array.from(reactions.querySelectorAll<HTMLButtonElement>('button[aria-pressed]'))
        .some(button => button.textContent?.includes("🙏"))).toBe(false)
      await page.elementLocator(trigger!).click()
      const pickerDialog = page.getByRole("dialog", { name: "Add reaction" })
      await pickerDialog.getByRole("button", { name: /Skin tone:/ }).click()
      await page.getByRole("menuitemradio", { name: "Medium-light" }).click()
      const quick = pickerDialog.getByRole("group", { name: "Quick reactions" })
      const foldedHands = quick.getByRole("button", { name: /folded hands, Medium-light skin tone/ })
      await expect.element(foldedHands).toBeEnabled()
      await foldedHands.click()
      const pill = () => Array.from(reactions.querySelectorAll<HTMLButtonElement>('button[aria-pressed]'))
        .find(button => button.textContent?.includes("🙏🏼"))
      await expect.poll(pill).toBeDefined()
      const added = pill()!
      expect(added.getAttribute("aria-pressed")).toBe("true")
      expect(added.getAttribute("aria-label")).toContain("folded hands")
      expect(added.getAttribute("aria-label")).toContain("Medium-light skin tone")
      await expect.poll(() => status!.textContent).toContain("You reacted with folded hands")
      await setting("Language", "zh-CN")
      expect(pill()).toBe(added)
      expect(added.getAttribute("aria-pressed")).toBe("true")
      expect(added.textContent).toContain("🙏🏼")
      await expect.poll(() => added.getAttribute("aria-label")).toContain("双手合十")
      await expect.poll(() => added.getAttribute("aria-label")).toContain("较浅")
      await expect.poll(() => status!.textContent).toContain("你用双手合十")
      await expect.poll(() => status!.textContent).toContain("较浅")
      await setting("语言", "en")
      expect(pill()).toBe(added)
      await expect.poll(() => added.getAttribute("aria-label")).toContain("folded hands")
      await expect.poll(() => status!.textContent).toContain("You reacted with folded hands")
    } finally {
      if (previousTone === null) localStorage.removeItem("reui-emoji-picker-skin-tone")
      else localStorage.setItem("reui-emoji-picker-skin-tone", previousTone)
    }
  }, 15000)

  it("expands a tree branch, retains a permission checkbox, and changes Stepper content", async () => {
    const tree = await scene("tree", "c-tree-1")
    const branch = tree.querySelector<HTMLElement>('[data-slot="tree-item"][aria-expanded]')
    expect(branch).not.toBeNull()
    const before = branch!.getAttribute("aria-expanded")
    await page.elementLocator(branch!).click()
    await expect.poll(() => branch!.getAttribute("aria-expanded")).not.toBe(before)
    const leaf = tree.querySelector<HTMLElement>('[data-slot="tree-item"]:not([data-folder="true"])')
    expect(leaf).not.toBeNull()
    await page.elementLocator(leaf!).click()
    await expect.poll(() => document.activeElement).toBe(leaf)
    const permissions = await scene("tree", "c-tree-7")
    const usersView = Array.from(permissions.querySelectorAll<HTMLElement>('[data-slot="tree-item"]'))
      .find(item => item.textContent?.includes("View users"))
    expect(usersView, "c-tree-7 View users permission").toBeDefined()
    const checkbox = usersView!.querySelector<HTMLElement>('[role="checkbox"]')
    expect(checkbox, "permission checkbox").not.toBeNull()
    await expect.poll(() => checkbox!.getAttribute("data-state")).toBe("checked")
    await page.elementLocator(checkbox!).click()
    await expect.poll(() => checkbox!.getAttribute("data-state")).toBe("unchecked")
    await setting("Theme", "dark")
    await setting("Density", "compact")
    await setting("Language", "zh-CN")
    expect(permissions.querySelector('[role="checkbox"]')?.isConnected).toBe(true)
    expect(checkbox!.isConnected).toBe(true)
    expect(checkbox!.getAttribute("data-state")).toBe("unchecked")
    await page.elementLocator(checkbox!).click()
    await expect.poll(() => checkbox!.getAttribute("data-state")).toBe("checked")
    const stepper = await scene("stepper", "c-stepper-1")
    const tabs = stepper.querySelectorAll<HTMLElement>('[data-slot="stepper-trigger"]')
    expect(tabs).toHaveLength(4)
    await page.elementLocator(tabs[3]).click()
    await expect.poll(() => tabs[3].getAttribute("aria-selected")).toBe("true")
    const activePanel = page.elementLocator(stepper).getByRole("tabpanel", { name: "4", exact: true })
    await expect.element(activePanel).toBeVisible()
    const panel = activePanel.element()
    expect(panel.id).toBe(tabs[3].getAttribute("aria-controls"))
    expect(panel.getAttribute("aria-labelledby")).toBe(tabs[3].id)
    expect(panel.textContent).toMatch(/4/)
    expect(panel.textContent?.trim().length).toBeGreaterThan(1)
  })

  it("reorders a Sortable item with a browser drag", async () => {
    const sortable = await scene("sortable", "c-sortable-1")
    const titles = () => Array.from(sortable.querySelectorAll("h4"), item => item.textContent)
    await expect.poll(() => titles().length).toBe(5)
    const before = titles()
    const handles = sortable.querySelectorAll<HTMLElement>('[data-slot="sortable-item-handle"]')
    expect(handles.length).toBeGreaterThanOrEqual(3)
    const items = sortable.querySelectorAll<HTMLElement>('[data-slot="sortable-item"]')
    await userEvent.dragAndDrop(page.elementLocator(handles[0]), page.elementLocator(items[2]), { steps: 20 })
    await expect.poll(titles).not.toEqual(before)
  })

  it("keeps Signature Pad 7 signed, locked, and inked while its date follows language", async () => {
    const agreement = await scene("signature-pad", "c-signature-pad-7")
    const pad = agreement.querySelector<HTMLElement>('[data-slot="signature-pad"]')
    const area = agreement.querySelector<HTMLElement>('[data-slot="signature-pad-area"]')
    const guide = agreement.querySelector<HTMLElement>('[data-slot="signature-pad-guide"]')
    const checkbox = agreement.querySelector<HTMLButtonElement>('[role="checkbox"]')
    expect(pad).not.toBeNull()
    expect(area).not.toBeNull()
    expect(guide).not.toBeNull()
    expect(checkbox).not.toBeNull()
    const dated = Array.from(pad!.querySelectorAll("span"))
      .find(node => node.textContent?.trim() === "Dated on signing")
    expect(dated).toBeDefined()

    area!.setAttribute("data-testid", "signature-pad-source")
    guide!.setAttribute("data-testid", "signature-guide-target")
    await userEvent.dragAndDrop(
      page.getByTestId("signature-pad-source"),
      page.getByTestId("signature-guide-target"),
      { steps: 12 },
    )
    await expect.poll(() => area!.querySelectorAll('svg[data-slot="signature-pad-canvas"] path[d]').length).toBeGreaterThan(0)
    await page.elementLocator(checkbox!).click()
    await expect.poll(() => checkbox!.getAttribute("aria-checked")).toBe("true")
    await page.getByRole("button", { name: "Sign agreement", exact: true }).click()
    await expect.poll(() => pad!.getAttribute("data-readonly")).toBe("true")
    expect(area!.getAttribute("data-readonly")).toBe("true")
    expect(checkbox!.disabled).toBe(true)
    const ink = Array.from(area!.querySelectorAll<SVGPathElement>('svg[data-slot="signature-pad-canvas"] path[d]'))
      .map(path => path.getAttribute("d"))
    expect(ink.length).toBeGreaterThan(0)
    const englishDate = dated!.textContent?.trim()
    expect(englishDate).toBeTruthy()
    expect(englishDate).not.toBe("Dated on signing")
    const status = agreement.querySelector<HTMLElement>('[role="status"]')
    expect(status?.textContent).toContain("Agreement signed")

    await setting("Language", "zh-CN")
    expect(agreement.querySelector('[data-slot="signature-pad"]')).toBe(pad)
    expect(agreement.querySelector('[data-slot="signature-pad-area"]')).toBe(area)
    expect(agreement.querySelector('[role="checkbox"]')).toBe(checkbox)
    expect(dated!.isConnected).toBe(true)
    await expect.poll(() => dated!.textContent?.trim()).not.toBe(englishDate)
    expect(dated!.textContent).toMatch(/年.*月.*日/)
    expect(pad!.getAttribute("data-readonly")).toBe("true")
    expect(area!.getAttribute("data-readonly")).toBe("true")
    expect(checkbox!.disabled).toBe(true)
    expect(checkbox!.getAttribute("aria-checked")).toBe("true")
    expect(Array.from(area!.querySelectorAll<SVGPathElement>('svg[data-slot="signature-pad-canvas"] path[d]'))
      .map(path => path.getAttribute("d"))).toEqual(ink)
    expect(agreement.textContent).toContain("Maya Chen")
    await expect.poll(() => status?.textContent).not.toContain("Agreement signed")
  })

  it("edits the date selector and unmounts an open overlay without an orphan", async () => {
    const date = await scene("date-selector", "c-date-selector-1")
    const input = date.querySelector<HTMLInputElement>("input")
    expect(input).not.toBeNull()
    await page.elementLocator(input!).fill("2025")
    await userEvent.keyboard("{Enter}")
    await expect.poll(() => date.textContent).not.toContain("No value selected")
    const tabs = Array.from(date.querySelectorAll<HTMLElement>('[data-slot="tabs-trigger"][role="tab"]'))
    const between = tabs.find(tab => tab.getAttribute("aria-label") === "between")
    const month = tabs.find(tab => tab.getAttribute("aria-label") === "Month")
    const year = tabs.find(tab => tab.getAttribute("aria-label") === "Year")
    const day = tabs.find(tab => tab.getAttribute("aria-label") === "Day")
    expect(between, "real range filter tab").toBeDefined()
    expect(month, "real month period tab").toBeDefined()
    expect(year, "real year period tab").toBeDefined()
    expect(day, "real day period tab").toBeDefined()
    await page.elementLocator(between!).click()
    await page.elementLocator(month!).click()
    const verifyPanel = async (name: RegExp) => {
      const accessiblePanel = page.elementLocator(date).getByRole("tabpanel", { name })
      await expect.element(accessiblePanel).toBeVisible()
      const panel = accessiblePanel.element()
      const selected = Array.from(date.querySelectorAll<HTMLElement>('[data-slot="tabs-trigger"][role="tab"][aria-selected="true"]'))
      expect(selected).toHaveLength(2)
      expect(panel.getAttribute("aria-labelledby")?.split(/\s+/)).toEqual(selected.map(tab => tab.id))
      for (const tab of selected) expect(tab.getAttribute("aria-controls")).toBe(panel.id)
      expect(panel.querySelector('button, [role="grid"], [data-slot="scroll-area"]')).not.toBeNull()
    }
    await verifyPanel(/between.*Month/)
    await page.elementLocator(year!).click()
    await verifyPanel(/between.*Year/)
    await page.elementLocator(day!).click()
    await verifyPanel(/between.*Day/)
    await setting("Language", "zh-CN")
    await verifyPanel(/介于.*日/)
    await scene("button", "c-button-1")
    expect(document.querySelector('[role="dialog"], [role="menu"], [role="listbox"]')).toBeNull()
  })

  it("validates and saves the ExUI form with localized messages and an unchanged business draft", async () => {
    const form = await openPage("exui", "form")
    const name = page.getByRole("textbox", { name: "Project name", exact: true })
    await name.fill("")
    const original = name.element()
    await page.getByRole("button", { name: "Save project", exact: true }).click()
    await expect.element(page.getByText("Enter at least 2 characters", { exact: true }).first()).toBeVisible()
    await setting("Language", "zh-CN")
    const translated = page.getByRole("textbox", { name: "项目名称", exact: true })
    expect(translated.element()).toBe(original)
    await expect.element(page.getByText("请输入至少 2 个字符", { exact: true }).first()).toBeVisible()
    await translated.fill("海星计划")
    await page.getByRole("button", { name: "保存项目", exact: true }).click()
    await expect.element(page.getByRole("status")).toHaveTextContent("海星计划")
    expect(form.querySelector('input[name="name"]')).toBe(original)
  })

  it("submits the migrated c-number-field-6 through the public Form adapter", async () => {
    const migrated = await scene("number-field", "c-number-field-6")
    const form = migrated.querySelector("form")
    expect(form).not.toBeNull()
    const amount = within(migrated, '[data-slot="number-field-input"]')
    await within(form!, 'button[type="submit"]').click()
    await expect.element(page.getByText("Amount must be at least 10.", { exact: true })).toBeVisible()
    expect(migrated.querySelector('[data-invalid="true"]')).not.toBeNull()
    await amount.click()
    await userEvent.keyboard("{Control>}a{/Control}12")
    await userEvent.keyboard("{Tab}")
    expect((amount.element() as HTMLInputElement).value).toBe("12")
    await within(form!, 'button[type="submit"]').click()
    await expect.element(page.getByText("Form submitted", { exact: true })).toBeVisible()
    const successToast = page.getByText("Form submitted", { exact: true }).element().closest('[data-sonner-toast]')
    expect(successToast, "public toast holds the migrated form submission").not.toBeNull()
    expect(successToast?.textContent).toContain("successfully submitted with amount: 12")
  })

  it("cleans a page-owned loading toast on navigation and preserves another notification", async () => {
    await openPage("exui", "ex-message")
    await page.getByRole("button", { name: "Start sync", exact: true }).click()
    await expect.element(page.getByText("Syncing files…", { exact: true })).toBeVisible()
    toast.success("External workflow")
    await expect.element(page.getByText("External workflow", { exact: true })).toBeVisible()
    await openPage("components", "button")
    await expect.element(page.getByText("Syncing files…", { exact: true })).not.toBeInTheDocument()
    await expect.element(page.getByText("External workflow", { exact: true })).toBeVisible()
  })

  it("completes two concurrent Sonner upload intervals independently", async () => {
    const upload = await scene("sonner", "c-sonner-10")
    const existing = new Set(activeToasts().map(item => item.id))
    const createdIntervals: number[] = []
    const nativeSetInterval = window.setInterval.bind(window)
    const setIntervalSpy = vi.spyOn(window as Window, "setInterval").mockImplementation((handler, timeout, ...args) => {
      const id = nativeSetInterval(handler, timeout, ...args)
      if (timeout === 500) createdIntervals.push(id)
      return id
    })
    const clearIntervalSpy = vi.spyOn(window, "clearInterval")
    try {
      const trigger = within(upload, "button")
      await trigger.click()
      await expect.poll(() => activeToasts().filter(item => !existing.has(item.id)).length).toBe(1)
      const firstId = activeToasts().find(item => !existing.has(item.id))!.id
      await trigger.click()
      await expect.poll(() => activeToasts().filter(item => !existing.has(item.id)).length).toBe(2)
      const ids = activeToasts().filter(item => !existing.has(item.id)).map(item => item.id)
      expect(new Set(ids).size).toBe(2)
      expect(ids).toContain(firstId)
      await expect.poll(() => createdIntervals.length).toBe(2)
      expect(new Set(createdIntervals).size).toBe(2)
      await setting("Language", "zh-CN")
      await expect.poll(() => Array.from(document.querySelectorAll<HTMLElement>("[data-sonner-toast]"))
        .some(element => /正在上传.*\d+%/.test(element.textContent ?? ""))).toBe(true)
      expect(Array.from(document.querySelectorAll<HTMLElement>("[data-sonner-toast]"))
        .filter(element => element.textContent?.includes("report-q4-2025.pdf")).length).toBe(2)
      await expect.poll(() => ids.every(id => activeToasts().find(item => item.id === id)?.duration === 3000), { timeout: 15000 }).toBe(true)
      await expect.poll(() => Array.from(document.querySelectorAll<HTMLElement>("[data-sonner-toast]"))
        .filter(element => element.textContent?.includes("report-q4-2025.pdf") && element.textContent?.includes("完成")).length).toBe(2)
      for (const id of ids) {
        expect(activeToasts().find(item => item.id === id)?.duration).toBe(3000)
      }
      await expect.poll(() => createdIntervals.every(id => clearIntervalSpy.mock.calls.some(call => call[0] === id))).toBe(true)
    } finally {
      setIntervalSpy.mockRestore()
      clearIntervalSpy.mockRestore()
    }
  }, 25000)

  it("updates two concurrent Sonner upload flows without touching another toast", async () => {
    const upload = await scene("sonner", "c-sonner-21")
    const existing = new Set(activeToasts().map(item => item.id))
    const externalId = toast.info("Unrelated notification", { duration: Infinity })
    await expect.poll(() => activeToasts().find(item => item.id === externalId)?.duration).toBe(Infinity)
    const trigger = within(upload, "button")
    await trigger.click()
    await expect.poll(() => activeToasts().filter(item => !existing.has(item.id) && item.id !== externalId).length).toBe(1)
    const firstId = activeToasts().find(item => !existing.has(item.id) && item.id !== externalId)!.id
    await trigger.click()
    await expect.poll(() => activeToasts().filter(item => !existing.has(item.id) && item.id !== externalId).length).toBe(2)
    const ids = activeToasts().filter(item => !existing.has(item.id) && item.id !== externalId).map(item => item.id)
    expect(new Set(ids).size).toBe(2)
    expect(ids).toContain(firstId)
    expect(ids.every(id => activeToasts().find(item => item.id === id)?.duration === Infinity)).toBe(true)
    await expect.poll(() => ids.every(id => activeToasts().find(item => item.id === id)?.duration === 4000), { timeout: 7000 }).toBe(true)
    expect(activeToasts().find(item => item.id === externalId)?.duration).toBe(Infinity)
    for (const id of ids) {
      const item = activeToasts().find(toastItem => toastItem.id === id)
      expect(item?.duration).toBe(4000)
    }
    await expect.poll(() => Array.from(document.querySelectorAll<HTMLElement>("[data-sonner-toast]"))
      .filter(element => element.textContent?.includes("Upload complete!")).length).toBe(2)
    await openPage("components", "button")
    await expect.poll(() => ids.every(id => !activeToasts().some(item => item.id === id))).toBe(true)
    expect(activeToasts().find(item => item.id === externalId)?.duration).toBe(Infinity)
  }, 15000)

  it("scopes Sidebar trigger and shortcut to the active example lifecycle", async () => {
    const sidebar = await scene("sidebar", "c-sidebar-1")
    const panel = sidebar.querySelector<HTMLElement>('[data-slot="sidebar"]')
    const otherPanel = container.querySelector<HTMLElement>('[data-example-id="c-sidebar-2"] [data-slot="sidebar"]')
    expect(panel).not.toBeNull()
    expect(otherPanel).not.toBeNull()
    const original = panel!.getAttribute("data-state")
    const otherOriginal = otherPanel!.getAttribute("data-state")
    await within(sidebar, '[data-slot="sidebar-trigger"]').click()
    await expect.poll(() => panel!.getAttribute("data-state")).not.toBe(original)
    expect(otherPanel!.getAttribute("data-state")).toBe(otherOriginal)
    await userEvent.keyboard("{Control>}b{/Control}")
    await expect.poll(() => panel!.getAttribute("data-state")).toBe(original)
    expect(otherPanel!.getAttribute("data-state")).toBe(otherOriginal)
    await openPage("components", "button")
    expect(panel!.isConnected).toBe(false)
    await userEvent.keyboard("{Control>}b{/Control}")
    expect(container.querySelector('[data-slot="sidebar"]')).toBeNull()
    expect(location.hash).toBe("#/components/button")
  })
})
