import "@exre/exui/style.css"
import { flushSync } from "react-dom"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { EventCalendar, EventCalendarContent, Gantt, GanttView, type EventCalendarApi } from "@exre/exui"
import { userEvent } from "vitest/browser"

let container: HTMLDivElement
let root: Root
let previousFont: string

beforeEach(() => {
  previousFont = document.documentElement.style.fontSize
  document.documentElement.style.fontSize = "16px"
  container = document.createElement("div")
  container.style.width = "100rem"
  document.body.append(container)
  root = createRoot(container)
})
afterEach(() => {
  flushSync(() => root.unmount())
  container.remove()
  document.documentElement.style.fontSize = previousFont
})

function element(slot: string): HTMLElement {
  const found = container.querySelector<HTMLElement>(`[data-slot="${slot}"]`)
  if (!found) throw new Error(`Missing Gantt slot ${slot}`)
  return found
}

function nameHeader(): HTMLElement {
  const found = element("gantt-tree-header").querySelector<HTMLElement>(":scope > div > div > div")
  if (!found) throw new Error("Missing Gantt name column")
  return found
}

async function renderGantt(explicit = false) {
  flushSync(() => root.render(
    <Gantt defaultDate={new Date("2026-10-16T12:00:00Z")} defaultScale="month" timeZone="UTC"
      resources={[{ id: "task", title: "Task" }]}
      columns={[{ id: "status", title: "Status", render: () => "Ready" }]}
      treePanel={explicit ? { width: 400, nameColumnWidth: 180 } : undefined}
      style={{ height: "24rem" }}>
      <GanttView />
    </Gantt>
  ))
  await expect.poll(() => container.querySelector('[data-slot="gantt-splitter"]')).toBeTruthy()
}

describe("Gantt relative defaults", () => {
  for (const immediate of [false, true]) {
    it(`cancels a valid resource reorder after a root change with ${immediate ? "immediate release" : "observer notification"}`, async () => {
      const reordered = vi.fn()
      const rejected = vi.fn()
      flushSync(() => root.render(
        <Gantt defaultDate={new Date("2026-10-16T12:00:00Z")} defaultScale="month" timeZone="UTC"
          resources={[{ id: "a", title: "First" }, { id: "b", title: "Second" }, { id: "c", title: "Third" }]}
          onResourceReorder={reordered} onResourceReorderReject={rejected} style={{ height: "24rem" }}><GanttView /></Gantt>
      ))
      await expect.poll(() => container.querySelectorAll('[data-slot="gantt-row-grip"]').length).toBe(3)
      const send = (target: EventTarget, type: string, x: number, y: number) => flushSync(() => {
        target.dispatchEvent(new PointerEvent(type, { bubbles: true, pointerId: 84, pointerType: "mouse", button: 0, clientX: x, clientY: y }))
      })
      const begin = () => {
        const grip = element("gantt-row-grip")
        const source = grip.getBoundingClientRect()
        const rows = container.querySelectorAll('[data-slot="gantt-row-group"]')
        const target = rows[2].getBoundingClientRect()
        send(grip, "pointerdown", source.left + 2, source.top + 2)
        send(window, "pointermove", source.left + 2, target.bottom - 1)
        expect(document.querySelector('[data-slot="gantt-drag-overlay"]')).not.toBeNull()
        expect(element("gantt-reorder-indicator").hasAttribute("data-invalid")).toBe(false)
      }
      const assertClean = () => {
        expect(document.querySelector('[data-slot="gantt-drag-overlay"]')).toBeNull()
        expect(container.querySelector('[data-slot="gantt-reorder-indicator"]')).toBeNull()
        expect(document.body.style.cursor).toBe("")
        expect(document.body.style.userSelect).toBe("")
      }
      begin()
      document.documentElement.style.fontSize = "32px"
      if (immediate) {
        send(window, "pointerup", 0, 0)
        expect(reordered).not.toHaveBeenCalled()
      } else {
        await expect.poll(() => document.querySelector('[data-slot="gantt-drag-overlay"]')).toBeNull()
        send(window, "pointerup", 0, 0)
      }
      assertClean()
      expect(reordered).not.toHaveBeenCalled()
      expect(rejected).not.toHaveBeenCalled()
      begin()
      send(window, "pointerup", 0, 0)
      expect(reordered).toHaveBeenCalledTimes(1)
      expect(reordered.mock.calls[0][0]).toMatchObject({ resourceId: "a", parentId: null, index: 2 })
      expect(reordered.mock.calls[0][0].resources.map((resource: { id: string }) => resource.id)).toEqual(["b", "c", "a"])
      assertClean()
      begin()
      flushSync(() => root.render(null))
      send(window, "pointerup", 0, 0)
      expect(reordered).toHaveBeenCalledTimes(1)
      assertClean()
      expect(document.querySelector("[data-exui-rem-probe]")).toBeNull()
    })
  }

  it("updates default sidebar and columns when the root changes without replacing the instance", async () => {
    await renderGantt()
    for (const rootPixels of [16, 21.328, 32]) {
      document.documentElement.style.fontSize = `${rootPixels}px`
      await expect.poll(() => element("gantt-splitter").getAttribute("aria-valuenow")).toBe(String(Math.round(18 * rootPixels)))
      await expect.poll(() => parseFloat(getComputedStyle(element("gantt-column-header")).width)).toBeCloseTo(6 * rootPixels, 0)
      await expect.poll(() => parseFloat(getComputedStyle(nameHeader()).width)).toBeCloseTo(13 * rootPixels, 0)
    }
  })

  it("preserves explicit pixel sizes and scales the default keyboard resize step", async () => {
    document.documentElement.style.fontSize = "32px"
    await renderGantt(true)
    await expect.poll(() => element("gantt-splitter").getAttribute("aria-valuenow")).toBe("400")
    await expect.poll(() => parseFloat(getComputedStyle(nameHeader()).width)).toBeCloseTo(180, 0)
    element("gantt-splitter").focus()
    await userEvent.keyboard("{ArrowRight}")
    await expect.poll(() => element("gantt-splitter").getAttribute("aria-valuenow")).toBe("432")
  })
})

describe("Calendar gesture defaults", () => {
  it("scrolls to the current slot geometry after a root change", async () => {
    const apiRef: { current: EventCalendarApi | null } = { current: null }
    flushSync(() => root.render(
      <EventCalendar apiRef={apiRef} defaultDate={new Date("2026-10-16T12:00:00Z")} defaultView="day" timeZone="UTC"
        dayStartHour={0} dayEndHour={24} interval={60} style={{ height: "24rem" }}>
        <EventCalendarContent />
      </EventCalendar>
    ))
    await expect.poll(() => apiRef.current).toBeTruthy()
    const viewport = container.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]')!
    const slot = container.querySelector<HTMLElement>('[data-slot="event-calendar-time-gutter"] > div')!
    for (const rootPixels of [16, 21.328, 32]) {
      document.documentElement.style.fontSize = `${rootPixels}px`
      apiRef.current!.scrollToTime(600)
      await expect.poll(() => viewport.scrollTop).toBeCloseTo(10 * slot.getBoundingClientRect().height - 0.75 * rootPixels, 0)
    }
  })

  it("cancels a live drag when its measured root geometry changes", async () => {
    let updates = 0
    flushSync(() => root.render(
      <EventCalendar defaultDate={new Date("2026-10-16T12:00:00Z")} defaultView="day" timeZone="UTC"
        defaultEvents={[{ id: "movable", title: "Movable event", start: new Date("2026-10-16T10:00:00Z"), end: new Date("2026-10-16T11:00:00Z") }]}
        onEventUpdate={() => { updates++ }} style={{ height: "40rem" }}>
        <EventCalendarContent />
      </EventCalendar>
    ))
    await expect.poll(() => container.querySelector('[data-slot="event-calendar-event"]')).toBeTruthy()
    const chip = container.querySelector<HTMLElement>('[data-slot="event-calendar-event"]')!
    const rect = chip.getBoundingClientRect()
    const clientX = rect.left + rect.width / 2
    const clientY = rect.top + rect.height / 2
    chip.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerId: 72, pointerType: "mouse", button: 0, clientX, clientY }))
    window.dispatchEvent(new PointerEvent("pointermove", { pointerId: 72, pointerType: "mouse", clientX, clientY: clientY + rect.height }))
    await expect.poll(() => document.body.classList.contains("ec-dragging")).toBe(true)
    document.documentElement.style.fontSize = "32px"
    await expect.poll(() => document.body.classList.contains("ec-dragging")).toBe(false)
    window.dispatchEvent(new PointerEvent("pointerup", { pointerId: 72, pointerType: "mouse" }))
    expect(updates).toBe(0)
  })

  it("scales a blocked drag threshold while preserving an explicit pixel override", async () => {
    let blocked = 0
    const renderCalendar = (explicit = false) => flushSync(() => root.render(
      <EventCalendar defaultDate={new Date("2026-10-16T12:00:00Z")} defaultView="day" timeZone="UTC"
        defaultEvents={[{ id: "locked", title: "Locked event", start: new Date("2026-10-16T10:00:00Z"), end: new Date("2026-10-16T11:00:00Z"), readOnly: true }]}
        activation={explicit ? { moveDistancePx: 5 } : undefined}
        onDragBlocked={() => { blocked++ }} style={{ height: "40rem" }}>
        <EventCalendarContent />
      </EventCalendar>
    ))
    renderCalendar()
    const gesture = async (distance: number) => {
      await expect.poll(() => container.querySelector('[data-slot="event-calendar-event"]')).toBeTruthy()
      const chip = container.querySelector<HTMLElement>('[data-slot="event-calendar-event"]')!
      chip.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerId: 71, pointerType: "mouse", button: 0, clientX: 100, clientY: 100 }))
      window.dispatchEvent(new PointerEvent("pointermove", { pointerId: 71, pointerType: "mouse", clientX: 100 + distance, clientY: 100 }))
      window.dispatchEvent(new PointerEvent("pointerup", { pointerId: 71, pointerType: "mouse" }))
    }
    for (const rootPixels of [16, 21.328, 32]) {
      document.documentElement.style.fontSize = `${rootPixels}px`
      const previous = blocked
      await gesture(rootPixels * 0.25)
      expect(blocked).toBe(previous)
      await gesture(rootPixels * 0.375)
      expect(blocked).toBe(previous + 1)
    }
    renderCalendar(true)
    const previous = blocked
    await gesture(6)
    expect(blocked).toBe(previous + 1)
    expect(document.body.classList.contains("ec-drag-blocked")).toBe(false)
  })
})
