import "../../src/showcase/ShowcaseStyles"
import { useState } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { ChevronLeft } from "lucide-react"
import * as ExUI from "@exre/exui"
import QuickDialogExample from "../../src/showcase/examples/dialog/exui-dialog-quick"

const { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } = ExUI
let root: Root
let container: HTMLDivElement
let originalClasses: string
let originalFontSize: string
let originalViewport: [number, number]

beforeEach(() => {
  originalClasses = document.documentElement.className
  originalFontSize = document.documentElement.style.fontSize
  originalViewport = [window.innerWidth, window.innerHeight]
  document.documentElement.style.fontSize = "16px"
  container = document.createElement("div")
  document.body.append(container)
  root = createRoot(container)
})

afterEach(async () => {
  root.unmount()
  container.remove()
  document.documentElement.className = originalClasses
  document.documentElement.style.fontSize = originalFontSize
  await page.viewport(...originalViewport)
})

describe("Dialog header actions", () => {
  it("keeps the quick example tooltip closed on opening and shows it for deliberate focus or hover", async () => {
    root.render(<QuickDialogExample />)
    await page.getByRole("button", { name: "Quick composition", exact: true }).click()
    const dialog = page.getByRole("dialog", { name: "Edit profile" })
    await expect.element(dialog).toBeVisible()
    await expect.poll(() => dialog.element().contains(document.activeElement)).toBe(true)
    await expect.element(page.getByRole("tooltip")).not.toBeInTheDocument()
    await expect.element(dialog).toHaveFocus()

    const back = page.getByRole("button", { name: "Previous step", exact: true })
    await userEvent.keyboard("{Tab}")
    await expect.element(back).toHaveFocus()
    await expect.element(page.getByRole("tooltip")).toHaveTextContent("Previous step")
    await userEvent.keyboard("{Tab}")
    await expect.element(page.getByRole("textbox", { name: "Display name" })).toHaveFocus()
    await expect.element(page.getByRole("tooltip")).not.toBeInTheDocument()
    await userEvent.hover(back)
    await expect.element(page.getByRole("tooltip")).toHaveTextContent("Previous step")
  })

  it("preserves a caller's explicit opening autofocus", async () => {
    root.render(<Dialog defaultOpen title="Custom focus" action={{ tooltip: "Back", onClick: () => {} }}
      contentProps={{ onOpenAutoFocus: event => {
        event.preventDefault()
        const input = (event.target as HTMLElement).querySelector<HTMLInputElement>("input")
        input?.focus()
      } }}><input aria-label="Custom initial focus" /></Dialog>)
    await expect.element(page.getByRole("textbox", { name: "Custom initial focus" })).toHaveFocus()
    await expect.element(page.getByRole("tooltip")).not.toBeInTheDocument()
  })

  it("calls the shorthand action with the button event without closing or submitting", async () => {
    let clicked: HTMLButtonElement | null = null
    let submits = 0
    root.render(<Dialog defaultOpen>
      <DialogContent>
        <form onSubmit={event => { event.preventDefault(); submits++ }}>
          <DialogHeader action={event => { clicked = event.currentTarget }}>
            <DialogTitle>Action editor</DialogTitle>
            <DialogDescription>Edit without closing.</DialogDescription>
          </DialogHeader>
        </form>
      </DialogContent>
    </Dialog>)
    const back = page.getByRole("button", { name: "Back", exact: true })
    await expect.element(back).toBeVisible()
    expect(back.element().querySelector(".lucide-arrow-left")).not.toBeNull()
    await back.click()
    expect(clicked).toBe(back.element())
    expect(submits).toBe(0)
    await expect.element(page.getByRole("dialog", { name: "Action editor" })).toBeVisible()
  })

  it("supports a custom icon, tooltip and an overriding accessible name", async () => {
    root.render(<Dialog defaultOpen><DialogContent closeButtonDisabled>
      <DialogHeader actionLabel="返回列表" action={{ tooltip: "上一步", onClick: () => {}, icon: ChevronLeft }}>
        <DialogTitle>Details</DialogTitle>
        <DialogDescription>Details description</DialogDescription>
      </DialogHeader>
    </DialogContent></Dialog>)
    const back = page.getByRole("button", { name: "返回列表" })
    await expect.element(back).toBeEnabled()
    expect(back.element().querySelector(".lucide-chevron-left")).not.toBeNull()
    await userEvent.hover(back)
    await expect.element(page.getByRole("tooltip")).toHaveTextContent("上一步")
  })

  it("uses the tooltip as the accessible name and falls back for empty labels", async () => {
    for (const tooltip of ["Previous", "", "   "]) {
      root.render(<Dialog defaultOpen title="Accessible action" actionLabel=""
        action={{ tooltip, onClick: () => {} }}>Content</Dialog>)
      await expect.element(page.getByRole("button", { name: tooltip.trim() || "Back", exact: true })).toBeVisible()
      if (!tooltip.trim()) await expect.element(page.getByRole("tooltip")).not.toBeInTheDocument()
    }
  })
})

describe("Dialog convenience composition", () => {
  it("restores focus after an internal close even when an earlier outside close was rejected", async () => {
    function Fixture() {
      const [open, setOpen] = useState(false)
      return <><Button onClick={() => setOpen(true)}>Open guarded editor</Button><input aria-label="Guarded outside" />
        <Dialog modal={false} open={open} onOpenChange={() => {}} title="Guarded editor"
          footer={<Button onClick={() => setOpen(false)}>Finish guarded editor</Button>}><input aria-label="Guarded inside" /></Dialog>
      </>
    }
    root.render(<Fixture />)
    await page.getByRole("button", { name: "Open guarded editor" }).click()
    await expect.element(page.getByRole("dialog", { name: "Guarded editor" })).toBeVisible()
    await page.getByRole("textbox", { name: "Guarded outside" }).click()
    await expect.element(page.getByRole("dialog", { name: "Guarded editor" })).toBeVisible()
    await page.getByRole("button", { name: "Finish guarded editor" }).click()
    await expect.element(page.getByRole("dialog", { name: "Guarded editor" })).not.toBeInTheDocument()
    await expect.element(page.getByRole("button", { name: "Open guarded editor" })).toHaveFocus()
  })

  it("retains outside focus after a non-modal dismissal and restores it after Escape", async () => {
    function Fixture() {
      const [open, setOpen] = useState(false)
      return <><Button onClick={() => setOpen(true)}>Open non-modal</Button>
        <input aria-label="Outside input" />
        <Dialog modal={false} open={open} onOpenChange={setOpen} title="Non-modal editor"><input aria-label="Inside input" /></Dialog>
      </>
    }
    root.render(<Fixture />)
    await page.getByRole("button", { name: "Open non-modal" }).click()
    await expect.element(page.getByRole("dialog", { name: "Non-modal editor" })).toBeVisible()
    await page.getByRole("textbox", { name: "Outside input" }).click()
    await expect.element(page.getByRole("dialog", { name: "Non-modal editor" })).not.toBeInTheDocument()
    await expect.element(page.getByRole("textbox", { name: "Outside input" })).toHaveFocus()
    await page.getByRole("button", { name: "Open non-modal" }).click()
    await expect.element(page.getByRole("dialog", { name: "Non-modal editor" })).toBeVisible()
    await userEvent.keyboard("{Escape}")
    await expect.element(page.getByRole("button", { name: "Open non-modal" })).toHaveFocus()
  })

  it("renders ReactNode slots and supports caller-controlled closing", async () => {
    function Fixture() {
      const [open, setOpen] = useState(false)
      return <><Button onClick={() => setOpen(true)}>Open quick editor</Button>
        <Dialog open={open} onOpenChange={setOpen} title={<span>Quick editor</span>}
          description={<span>Quick description</span>} action={() => {}}
          footer={<Button onClick={() => setOpen(false)}>Save draft</Button>}
          contentProps={{ glass: true, closeLabel: "关闭" }}>
          <input aria-label="Draft" defaultValue="saved" />
        </Dialog>
      </>
    }
    root.render(<Fixture />)
    await page.getByRole("button", { name: "Open quick editor" }).click()
    const dialog = page.getByRole("dialog", { name: "Quick editor" })
    await expect.element(dialog).toBeVisible()
    expect(dialog.element().classList.contains("ex-glass")).toBe(true)
    expect(dialog.element().querySelector('[data-slot="dialog-body"]')).not.toBeNull()
    await expect.element(page.getByRole("button", { name: "关闭" })).toBeVisible()
    await page.getByRole("button", { name: "Save draft" }).click()
    await expect.element(dialog).not.toBeInTheDocument()
    await expect.element(page.getByRole("button", { name: "Open quick editor" })).toHaveFocus()
  })

  it("preserves the original trigger/content composition", async () => {
    root.render(<Dialog><DialogTrigger asChild><Button>Open composed editor</Button></DialogTrigger>
      <DialogContent><DialogHeader><DialogTitle>Composed editor</DialogTitle>
        <DialogDescription>Original composition</DialogDescription></DialogHeader></DialogContent>
    </Dialog>)
    await page.getByRole("button", { name: "Open composed editor" }).click()
    await expect.element(page.getByRole("dialog", { name: "Composed editor" })).toBeVisible()
    await userEvent.keyboard("{Escape}")
    await expect.element(page.getByRole("button", { name: "Open composed editor" })).toHaveFocus()
  })
})

describe("Dialog responsive body layout", () => {
  it("keeps content and footer reachable when large text exceeds a short mobile viewport", async () => {
    await page.viewport(640, 320)
    document.documentElement.style.fontSize = "32px"
    root.render(<Dialog defaultOpen title="A long mobile editor title wrapping across several lines"
      description="A detailed explanation that needs multiple lines when text is enlarged in a short landscape viewport."
      responsiveFullscreen footer={<Button>Finish short editor</Button>}>
      <input aria-label="Short viewport draft" />
      {Array.from({ length: 12 }, (_, i) => <p key={i}>Scrollable body paragraph {i}</p>)}
    </Dialog>)
    const dialog = page.getByRole("dialog")
    await expect.element(dialog).toBeVisible()
    const surface = dialog.element() as HTMLElement
    await expect.poll(() => surface.getBoundingClientRect().height).toBe(320)
    expect(surface.scrollHeight).toBeGreaterThan(surface.clientHeight)
    expect(getComputedStyle(surface).overflowY).toBe("auto")
    const body = surface.querySelector<HTMLElement>('[data-slot="dialog-body"]')!
    expect(body.clientHeight).toBeGreaterThan(0)
    surface.scrollTop = surface.scrollHeight
    const footer = page.getByRole("button", { name: "Finish short editor" }).element()
    expect(footer.getBoundingClientRect().bottom).toBeLessThanOrEqual(320)
    expect(footer.getBoundingClientRect().top).toBeGreaterThanOrEqual(0)
  })

  for (const theme of ["light", "dark", "pitch-black"]) {
    for (const density of ["standard", "compact"]) {
      it(`fills mobile viewports and retains drafts while switching size in ${theme}/${density}`, async () => {
        document.documentElement.className = `${theme === "light" ? "" : "dark"} ${theme === "pitch-black" ? "pitch-black" : ""} ${density === "compact" ? "density-compact" : ""}`
        root.render(<Dialog defaultOpen><DialogContent responsiveFullscreen className="sm:max-w-lg">
          <DialogHeader action={() => {}}>
            <DialogTitle>A long title that wraps onto multiple lines on a narrow phone</DialogTitle>
            <DialogDescription>A description beneath the title, in the same text column.</DialogDescription>
          </DialogHeader>
          <ExUI.DialogBody>
            <input aria-label="Responsive draft" defaultValue="kept draft" />
            {Array.from({ length: 30 }, (_, i) => <p key={i}>Scrollable paragraph {i}. This is deliberately long body content.</p>)}
          </ExUI.DialogBody>
          <DialogFooter><Button>Save responsive draft</Button></DialogFooter>
        </DialogContent></Dialog>)
        const dialog = page.getByRole("dialog")
        await expect.element(dialog).toBeVisible()
        const surface = dialog.element() as HTMLElement
        const draft = page.getByRole("textbox", { name: "Responsive draft" }).element()
        await userEvent.fill(draft, "edited draft")
        for (const fontSize of [16, 21.328, 32]) {
          document.documentElement.style.fontSize = `${fontSize}px`
          await page.viewport(Math.ceil(48 * fontSize), 900)
          await expect.poll(() => surface.hasAttribute("data-exui-fullscreen")).toBe(false)
          expect(surface.getBoundingClientRect().width).toBeLessThan(window.innerWidth)
          const belowBreakpoint = Math.ceil(48 * fontSize) - 1
          await page.viewport(belowBreakpoint, 844)
          await expect.poll(() => surface.getBoundingClientRect().width).toBe(belowBreakpoint)
          await page.viewport(390, 844)
          await expect.poll(() => {
            const rect = surface.getBoundingClientRect()
            return [Math.round(rect.x), Math.round(rect.y), Math.round(rect.width), Math.round(rect.height)]
          }).toEqual([0, 0, 390, 844])
          const style = getComputedStyle(surface)
          expect(parseFloat(style.borderTopLeftRadius)).toBe(0)
          expect(parseFloat(style.borderTopWidth)).toBe(0)
          const body = surface.querySelector<HTMLElement>('[data-slot="dialog-body"]')!
          const header = surface.querySelector<HTMLElement>('[data-slot="dialog-header"]')!
          const footer = surface.querySelector<HTMLElement>('[data-slot="dialog-footer"]')!
          const headerTop = header.getBoundingClientRect().top
          const footerTop = footer.getBoundingClientRect().top
          expect(body.scrollHeight).toBeGreaterThan(body.clientHeight)
          body.scrollTop = body.scrollHeight
          await expect.poll(() => body.scrollTop).toBeGreaterThan(0)
          expect(header.getBoundingClientRect().top).toBeCloseTo(headerTop, 1)
          expect(footer.getBoundingClientRect().top).toBeCloseTo(footerTop, 1)
          if (surface.scrollHeight > surface.clientHeight) {
            expect(getComputedStyle(surface).overflowY).toBe("auto")
            surface.scrollTop = surface.scrollHeight
            expect(footer.getBoundingClientRect().bottom).toBeLessThanOrEqual(844)
            surface.scrollTop = 0
          } else {
            expect(footer.getBoundingClientRect().bottom).toBeLessThanOrEqual(844)
          }
          const title = surface.querySelector<HTMLElement>('[data-slot="dialog-title"]')!
          const action = surface.querySelector<HTMLElement>('[data-slot="dialog-action"]')!
          const titleRect = title.getBoundingClientRect()
          const actionRect = action.getBoundingClientRect()
          expect(actionRect.right).toBeLessThanOrEqual(titleRect.left)
          // Button transitions interpolate its rem-based height after a root
          // size change; inspect settled first-line alignment.
          await expect.poll(() => {
            const buttonRect = action.getBoundingClientRect()
            return Math.abs(buttonRect.top + buttonRect.height / 2 - title.getBoundingClientRect().top - parseFloat(getComputedStyle(title).lineHeight) / 2)
          }).toBeLessThan(1)
          expect(draft).toBe(page.getByRole("textbox", { name: "Responsive draft" }).element())
          expect((draft as HTMLInputElement).value).toBe("edited draft")
        }
      })
    }
  }

  it("keeps fullscreen opt-in and supports a quick dialog without optional slots", async () => {
    await page.viewport(390, 844)
    root.render(<Dialog defaultOpen title="Optional slots"><input aria-label="Optional draft" /></Dialog>)
    const dialog = page.getByRole("dialog", { name: "Optional slots" })
    await expect.element(dialog).toBeVisible()
    expect(dialog.element().hasAttribute("data-exui-fullscreen")).toBe(false)
    expect(dialog.element().getBoundingClientRect().width).toBeLessThan(390)
    expect(dialog.element().querySelector('[data-slot="dialog-footer"]')).toBeNull()
    expect(dialog.element().getAttribute("aria-describedby")).toBeNull()
    root.render(<Dialog defaultOpen title="Optional slots" responsiveFullscreen><input aria-label="Optional draft" /></Dialog>)
    await expect.poll(() => dialog.element().getBoundingClientRect().height).toBe(844)
    await userEvent.keyboard("{Escape}")
    await expect.element(dialog).not.toBeInTheDocument()
  })
})
