import "./ShowcaseStyles"
import type { ComponentProps, CSSProperties } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { Badge } from "@exre/exui"
import publicStyles from "@exre/exui/style.css?raw"

type Variant = NonNullable<ComponentProps<typeof Badge>["variant"]>
const variants = [
  "default", "outline", "secondary", "info", "success", "warning", "destructive", "focus", "invert",
  "primary-light", "warning-light", "success-light", "info-light", "destructive-light", "invert-light", "focus-light",
  "primary-outline", "warning-outline", "success-outline", "info-outline", "destructive-outline", "invert-outline", "focus-outline",
] as const satisfies readonly Variant[]

let root: Root
let container: HTMLDivElement
let previousClasses: string

beforeEach(async () => {
  previousClasses = document.documentElement.className
  container = document.createElement("div")
  document.body.append(container)
  root = createRoot(container)
  await document.fonts.ready
})

afterEach(() => {
  root.unmount()
  container.remove()
  document.documentElement.className = previousClasses
})

function luminance(pixel: Uint8ClampedArray) {
  const channels = [...pixel].slice(0, 3).map(value => {
    const channel = value / 255
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
}

// Chromium resolves color-mix/oklab and composites translucent backgrounds.
// Checking the raw CSS strings would miss white text on a faint red fill.
function contrast(element: Element) {
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = 1
  const context = canvas.getContext("2d", { willReadFrequently: true })!
  const ancestors: Element[] = []
  for (let ancestor: Element | null = element; ancestor; ancestor = ancestor.parentElement) ancestors.unshift(ancestor)
  context.fillStyle = "#ffffff"
  context.fillRect(0, 0, 1, 1)
  for (const ancestor of ancestors) {
    context.fillStyle = getComputedStyle(ancestor).backgroundColor
    context.fillRect(0, 0, 1, 1)
  }
  const background = luminance(context.getImageData(0, 0, 1, 1).data)
  context.fillStyle = getComputedStyle(element).color
  context.fillRect(0, 0, 1, 1)
  const foreground = luminance(context.getImageData(0, 0, 1, 1).data)
  return (Math.max(background, foreground) + 0.05) / (Math.min(background, foreground) + 0.05)
}

function Icon() {
  return <svg aria-hidden="true" viewBox="0 0 16 16"><path d="m2 10 4-4 3 3 5-6" fill="none" stroke="currentColor" /></svg>
}

describe("Badge color contract", () => {
  for (const theme of ["light", "dark", "pitch-black"]) for (const density of ["standard", "compact"]) {
    it(`keeps all variant labels and icons readable on page/card surfaces in ${theme}/${density}`, async () => {
      document.documentElement.className = [theme, theme === "pitch-black" ? "dark" : "", density === "compact" ? "density-compact" : ""].filter(Boolean).join(" ")
      root.render(<div>{["background", "card"].map(surface => <section key={surface} data-surface={surface} style={{ background: `var(--${surface})`, color: "var(--foreground)", padding: 8 }}>
        {[false, true].map(glass => <div key={String(glass)}>{variants.map(variant => <Badge key={variant} variant={variant} glass={glass} data-glass={String(glass)}><Icon /><span>Badge</span></Badge>)}</div>)}
      </section>)}</div>)
      await expect.poll(() => container.querySelectorAll('[data-slot="badge"]').length).toBe(variants.length * 4)

      const failures: { surface: string; variant: string; glass: string; contrast: number }[] = []
      for (const badge of container.querySelectorAll<HTMLElement>('[data-slot="badge"]')) {
        const label = badge.querySelector("span")!
        const icon = badge.querySelector("svg")!
        expect(getComputedStyle(icon).color).toBe(getComputedStyle(label).color)
        const ratio = contrast(label)
        if (ratio < 4.5) failures.push({ surface: badge.closest("[data-surface]")!.getAttribute("data-surface")!, variant: badge.dataset.variant!, glass: badge.dataset.glass!, contrast: Number(ratio.toFixed(3)) })
      }
      expect(failures, JSON.stringify(failures)).toEqual([])
    })
  }

  it("preserves every size's geometry across color variants", async () => {
    document.documentElement.className = "light"
    const sizes = ["xs", "sm", "default", "lg", "xl"] as const
    root.render(<div>{sizes.map(size => <section key={size} data-size={size}>{variants.map(variant => <Badge key={variant} variant={variant} size={size}><Icon />Badge</Badge>)}</section>)}</div>)
    await expect.poll(() => container.querySelectorAll('[data-slot="badge"]').length).toBe(variants.length * sizes.length)
    for (const group of container.querySelectorAll("section")) {
      const badges = [...group.querySelectorAll<HTMLElement>('[data-slot="badge"]')]
      const geometry = (badge: HTMLElement) => {
        const rect = badge.getBoundingClientRect()
        const style = getComputedStyle(badge)
        return [rect.width, rect.height, style.fontSize, style.fontWeight, style.padding, style.borderRadius]
      }
      for (const badge of badges.slice(1)) expect(geometry(badge)).toEqual(geometry(badges[0]))
    }
  })

  it("preserves asChild and class/style overrides with only the public stylesheet in every theme", async () => {
    const frame = document.createElement("iframe")
    frame.hidden = true
    document.body.append(frame)
    const isolated = frame.contentDocument!
    const style = isolated.createElement("style")
    style.textContent = publicStyles
    isolated.head.append(style)
    const computed = frame.contentWindow!.getComputedStyle.bind(frame.contentWindow)
    try {
      for (const theme of ["light", "dark", "pitch-black"]) {
        isolated.documentElement.className = theme === "pitch-black" ? "dark pitch-black" : theme
        root.render(<div style={{ color: "var(--foreground)" }}>{variants.map(variant => <section key={variant}>
          <Badge variant={variant} className="text-foreground" asChild><a href="#badge">Class override</a></Badge>
          <Badge variant={variant} style={{ color: "rgb(12, 34, 56)" }}>Style override</Badge>
        </section>)}</div>)
        await expect.poll(() => container.querySelectorAll("a").length).toBe(variants.length)
        isolated.body.replaceChildren(container.querySelector("div")!.cloneNode(true))
        for (const group of isolated.querySelectorAll("section")) {
          const link = group.querySelector("a")!
          expect(link.getAttribute("href")).toBe("#badge")
          expect(computed(link).color, `${theme}/${link.dataset.variant}`).toBe(computed(group.parentElement!).color)
          expect(computed(group.querySelector("span")!).color).toBe("rgb(12, 34, 56)")
        }
      }
    } finally {
      frame.remove()
    }
  })

  it("retains the primary and focus foreground token customization contract", async () => {
    const style = document.documentElement.style
    const originalPrimary = style.getPropertyValue("--exui-control-primary-foreground")
    const originalFocus = style.getPropertyValue("--focus-foreground")
    try {
      style.setProperty("--exui-control-primary-foreground", "rgb(41, 97, 139)")
      style.setProperty("--focus-foreground", "rgb(101, 42, 121)")
      for (const theme of ["light", "dark", "pitch-black"]) {
        document.documentElement.className = theme === "pitch-black" ? "dark pitch-black" : theme
        root.render(<div><Badge>Primary</Badge><Badge variant="focus">Focus</Badge></div>)
        await expect.poll(() => container.querySelectorAll('[data-slot="badge"]').length).toBe(2)
        expect(getComputedStyle(container.querySelector('[data-variant="default"]')!).color, theme).toBe("rgb(41, 97, 139)")
        expect(getComputedStyle(container.querySelector('[data-variant="focus"]')!).color, theme).toBe("rgb(101, 42, 121)")
      }
    } finally {
      if (originalPrimary) style.setProperty("--exui-control-primary-foreground", originalPrimary)
      else style.removeProperty("--exui-control-primary-foreground")
      if (originalFocus) style.setProperty("--focus-foreground", originalFocus)
      else style.removeProperty("--focus-foreground")
    }
  })

  it("follows semantic color overrides without a rerender", async () => {
    document.documentElement.className = "light"
    root.render(<section style={{ "--success": "#16813f" } as CSSProperties}>
      <Badge variant="success-light">Custom success</Badge>
    </section>)
    await expect.poll(() => container.querySelector('[data-slot="badge"]')).not.toBeNull()
    const badge = container.querySelector<HTMLElement>('[data-slot="badge"]')!
    const original = getComputedStyle(badge).color
    container.querySelector("section")!.style.setProperty("--success", "#1267a2")
    await expect.poll(() => getComputedStyle(badge).color).not.toBe(original)
  })
})
