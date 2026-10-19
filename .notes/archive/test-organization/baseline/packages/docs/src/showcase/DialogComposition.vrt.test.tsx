import "@exre/exui/style.css"
import { createRoot } from "react-dom/client"
import { expect, it } from "vitest"
import { page } from "vitest/browser"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@exre/exui"

it("preserves a legacy flex layout when consuming only the public stylesheet", async () => {
  const container = document.createElement("div")
  document.body.append(container)
  const root = createRoot(container)
  try {
    root.render(<Dialog defaultOpen><DialogContent className="flex flex-col" style={{ height: "min(500px, 80dvh)" }}>
      <DialogHeader><DialogTitle>Legacy layout</DialogTitle><DialogDescription>Custom scrolling body</DialogDescription></DialogHeader>
      <div data-testid="legacy-body" style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto" }}><div style={{ height: 1800 }}>Long content</div></div>
      <DialogFooter>Footer stays visible</DialogFooter>
    </DialogContent></Dialog>)
    const dialog = page.getByRole("dialog", { name: "Legacy layout" })
    await expect.element(dialog).toBeVisible()
    const surface = dialog.element() as HTMLElement
    expect(getComputedStyle(surface).display).toBe("flex")
    const body = surface.querySelector<HTMLElement>('[data-testid="legacy-body"]')!
    const footer = surface.querySelector<HTMLElement>('[data-slot="dialog-footer"]')!
    const top = footer.getBoundingClientRect().top
    body.scrollTop = 1000
    expect(body.scrollTop).toBeGreaterThan(0)
    expect(footer.getBoundingClientRect().top).toBe(top)
    expect(footer.getBoundingClientRect().bottom).toBeLessThanOrEqual(surface.getBoundingClientRect().bottom)
  } finally {
    root.unmount()
    container.remove()
  }
})
