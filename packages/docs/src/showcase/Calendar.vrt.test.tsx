import "@exre/exui/style.css"

import { useState, type CSSProperties } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { Calendar } from "@exre/exui"

let root: Root
let previousClassName: string
let previousFontSize: string

beforeEach(() => {
  previousClassName = document.documentElement.className
  previousFontSize = document.documentElement.style.fontSize
  document.documentElement.className = "light"
  const host = document.createElement("div")
  document.body.replaceChildren(host)
  root = createRoot(host)
})

afterEach(() => {
  root.unmount()
  document.documentElement.className = previousClassName
  document.documentElement.style.fontSize = previousFontSize
})

function SelectionCalendar({ mode, showWeekNumber }: {
  mode: "single" | "multiple"
  showWeekNumber: boolean
}) {
  const [date, setDate] = useState<Date>()
  const [dates, setDates] = useState<Date[]>()
  const shared = { defaultMonth: new Date(2026, 1, 1), weekStartsOn: 1 as const, showWeekNumber }
  return mode === "single"
    ? <Calendar {...shared} mode="single" selected={date} onSelect={setDate} />
    : <Calendar {...shared} mode="multiple" selected={dates} onSelect={setDates} />
}

function expectCircle(button: Element) {
  const style = getComputedStyle(button)
  const radii = [style.borderTopLeftRadius, style.borderTopRightRadius,
    style.borderBottomRightRadius, style.borderBottomLeftRadius].map(Number.parseFloat)
  const bounds = button.getBoundingClientRect()
  // Unequal corner values are scaled together by CSS and can flatten one side.
  expect(new Set(radii).size, `corner radii: ${radii.join(", ")}`).toBe(1)
  expect(radii[0]).toBeGreaterThanOrEqual(bounds.width / 2)
  expect(bounds.width).toBeCloseTo(bounds.height, 1)
}

describe("Calendar selection shape", () => {
  for (const mode of ["single", "multiple"] as const) {
    for (const showWeekNumber of [false, true]) {
      it(`keeps ${mode} selections circular across the week with week numbers ${showWeekNumber}`, async () => {
        root.render(<SelectionCalendar mode={mode} showWeekNumber={showWeekNumber} />)
        for (const [fontSize, density] of [["16px", ""], ["32px", "density-compact"]]) {
          document.documentElement.style.fontSize = fontSize
          document.documentElement.className = `light ${density}`
          for (const name of [/Monday, February 9/, /Thursday, February 12/, /Sunday, February 15/]) {
            const day = page.getByRole("button", { name })
            await expect.element(day).toBeVisible()
            // Multiple selections survive size changes; leave an already selected date selected.
            if (day.element().getAttribute("data-selected-single") !== "true") await day.click()
            await expect.element(day).toHaveAttribute("data-selected-single", "true")
            await expect.poll(() => {
              expectCircle(day.element())
              return true
            }).toBe(true)
          }
        }
      })
    }
  }

  it("keeps enlarged date selections circular at both week edges", async () => {
    root.render(<Calendar mode="multiple" weekStartsOn={1} style={{ "--cell-size": "4rem" } as CSSProperties}
      defaultMonth={new Date(2026, 1, 1)} selected={[new Date(2026, 1, 9), new Date(2026, 1, 15)]} />)
    for (const name of [/Monday, February 9/, /Sunday, February 15/]) {
      const day = page.getByRole("button", { name })
      await expect.element(day).toBeVisible()
      expect(day.element().getBoundingClientRect().width).toBeGreaterThanOrEqual(64)
      expectCircle(day.element())
    }
  })

  it("keeps range endpoints round and the connecting days square", async () => {
    root.render(<Calendar mode="range" weekStartsOn={1} defaultMonth={new Date(2026, 1, 1)}
      selected={{ from: new Date(2026, 1, 9), to: new Date(2026, 1, 20) }} />)
    const start = page.getByRole("button", { name: /Monday, February 9/ })
    const end = page.getByRole("button", { name: /Friday, February 20/ })
    const middle = page.getByRole("button", { name: /Thursday, February 12/ })
    await expect.element(start).toHaveAttribute("data-range-start", "true")
    await expect.element(end).toHaveAttribute("data-range-end", "true")
    expectCircle(start.element())
    expectCircle(end.element())
    expect(getComputedStyle(middle.element()).borderRadius).toBe("0px")
    const weekEnd = getComputedStyle(page.getByRole("button", { name: /Sunday, February 15/ }).element())
    expect(weekEnd.borderTopLeftRadius).toBe("0px")
    expect(Number.parseFloat(weekEnd.borderTopRightRadius)).toBeGreaterThan(0)
    const weekStart = getComputedStyle(page.getByRole("button", { name: /Monday, February 16/ }).element())
    expect(weekStart.borderTopRightRadius).toBe("0px")
    expect(Number.parseFloat(weekStart.borderTopLeftRadius)).toBeGreaterThan(0)
  })
})
