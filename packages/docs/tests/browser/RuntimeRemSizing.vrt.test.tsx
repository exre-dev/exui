import "@exre/exui/style.css"
import { flushSync } from "react-dom"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@exre/exui"

let container: HTMLDivElement
let root: Root
let previousFont: string

beforeEach(() => {
  previousFont = document.documentElement.style.fontSize
  document.documentElement.style.fontSize = "16px"
  container = document.createElement("div")
  document.body.append(container)
  root = createRoot(container)
})

afterEach(async () => {
  flushSync(() => root.unmount())
  container.remove()
  document.documentElement.style.fontSize = previousFont
})

async function renderMenu(offset?: number, glass = false) {
  flushSync(() => root.render(
    <DropdownMenu open>
      <DropdownMenuTrigger data-testid="rem-trigger" style={{ position: "fixed", top: 32, left: 16 }}>Menu</DropdownMenuTrigger>
      <DropdownMenuContent data-testid="rem-menu" side="bottom" align="start" avoidCollisions={false} sideOffset={offset} glass={glass}>
        <DropdownMenuItem>One</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ))
  await expect.poll(() => document.querySelector('[data-testid="rem-menu"]')).toBeTruthy()
}

function gap() {
  const trigger = document.querySelector('[data-testid="rem-trigger"]')!.getBoundingClientRect()
  const content = document.querySelector('[data-testid="rem-menu"]')!.getBoundingClientRect()
  return content.top - trigger.bottom
}

describe("root-rem runtime boundaries", () => {
  it("updates a default popup gap with the root while keeping an explicit numeric offset in pixels", async () => {
    await renderMenu()
    await expect.poll(gap).toBeCloseTo(4, 0)
    document.documentElement.style.fontSize = "21.328px"
    await expect.poll(gap).toBeCloseTo(5.332, 0)
    document.documentElement.style.fontSize = "32px"
    await expect.poll(gap).toBeCloseTo(8, 0)
    await renderMenu(12)
    await expect.poll(gap).toBeCloseTo(12, 0)
  })

  it("scales glass blur and releases its document observer after the final consumer unmounts", async () => {
    await renderMenu(undefined, true)
    const menu = () => document.querySelector('[data-testid="rem-menu"]')!
    await expect.poll(() => getComputedStyle(menu()).backdropFilter).toContain("blur(4px)")
    document.documentElement.style.fontSize = "32px"
    await expect.poll(() => getComputedStyle(menu()).backdropFilter).toContain("blur(8px)")
    expect(document.querySelectorAll("[data-exui-rem-probe]").length).toBe(1)
    flushSync(() => root.render(null))
    await expect.poll(() => document.querySelectorAll("[data-exui-rem-probe]").length).toBe(0)
  })
})
