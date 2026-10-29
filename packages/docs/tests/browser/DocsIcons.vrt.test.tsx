import "../../app/styles/docs.css"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import cameraAsset from "@exre/exui/icons/glass-icons/camera.svg"
import { IconsGallery } from "../../app/components/icons/IconsGallery"
import { iconCatalog } from "../../app/components/icons/catalog"

let root: Root
let container: HTMLDivElement
beforeEach(() => {
  container = document.createElement("div")
  container.className = "docs-app"
  document.body.append(container)
  root = createRoot(container)
})
afterEach(() => { root.unmount(); container.remove(); vi.restoreAllMocks() })
function render(locale: "zh-CN" | "en" = "en") { root.render(<IconsGallery locale={locale} />) }

describe("Icons gallery", () => {
  it("lists all icons and searches component names and asset names", async () => {
    render()
    await expect.poll(() => container.querySelectorAll("[data-icon-card]").length).toBe(50)
    const search = page.getByRole("textbox", { name: "Search icons" })
    await search.fill("Arrow02Icon")
    await expect.poll(() => container.querySelectorAll("[data-icon-card]").length).toBe(1)
    await expect.element(page.getByRole("button", { name: "Copy Arrow02Icon", exact: true })).toBeVisible()
    expect(container.querySelector("[data-icon-card]")?.textContent).not.toContain(".svg")
    await search.fill("arrow-02.svg")
    await expect.poll(() => container.querySelectorAll("[data-icon-card]").length).toBe(1)
    await search.fill("nothing matches this")
    await expect.element(page.getByText("No icons found")).toBeVisible()
    await page.getByRole("button", { name: "Clear search", exact: true }).last().click()
    await expect.poll(() => container.querySelectorAll("[data-icon-card]").length).toBe(50)
  })
  it("opens with Enter, restores focus on Escape and links the canonical SVG", async () => {
    render()
    const card = page.getByRole("button", { name: "Preview CameraIcon" })
    await expect.element(card).toBeVisible()
    const cardElement = card.element()
    await card.click()
    await expect.element(page.getByRole("dialog")).toBeVisible()
    const link = page.getByRole("link", { name: "Download SVG" })
    const href = link.element().getAttribute("href")!
    expect(href).toBe(cameraAsset)
    expect(href).not.toMatch(/^(blob:|data:)/)
    expect(link.element().getAttribute("download")).toBe("camera.svg")
    const response = await fetch(href)
    expect(response.ok).toBe(true)
    expect(await response.text()).toContain("<svg")
    await userEvent.keyboard("{Escape}")
    await expect.poll(() => document.activeElement).toBe(cardElement)
    await userEvent.keyboard("{Enter}")
    await expect.element(page.getByRole("dialog")).toBeVisible()
    await page.getByRole("button", { name: "Close details" }).click()
    await expect.poll(() => document.activeElement).toBe(cardElement)
  })
  it("switches backgrounds and reports successful and failed copies", async () => {
    render()
    await page.getByRole("button", { name: "Dark background" }).click()
    await expect.element(page.getByRole("button", { name: "Dark background" })).toHaveAttribute("aria-pressed", "true")
    expect(container.querySelector("[data-icon-card] .ip-card-art")?.classList.contains("ip-backdrop-night")).toBe(true)
    await page.getByRole("button", { name: "Checkerboard background" }).click()
    expect(container.querySelector("[data-icon-card] .ip-card-art")?.classList.contains("ip-backdrop-checker")).toBe(true)
    await page.getByRole("button", { name: "Preview CameraIcon" }).click()
    const write = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error("denied"))
    await page.getByRole("button", { name: "Copy usage" }).click()
    await expect.element(page.getByText("Copied", { exact: true })).toBeVisible()
    expect(write.mock.calls[0][0]).toContain("CameraIcon")
    await page.getByRole("button", { name: "Copy import" }).click()
    await expect.element(page.getByText("Copy failed", { exact: true })).toBeVisible()
    expect(write.mock.calls[1][0]).toContain("camera.svg")
    await expect.poll(() => page.getByRole("button", { name: "Copy import" }).element().textContent, { timeout: 3000 }).toBe("Copy import")
  })
  it("localizes accessible controls", async () => {
    render("zh-CN")
    await expect.element(page.getByRole("textbox", { name: "搜索图标" })).toBeVisible()
    await expect.element(page.getByRole("button", { name: "浅色背景" })).toBeVisible()
  })
  it("recolors one preview, copies its color prop and keeps SVG downloads in their original colors", async () => {
    render()
    await page.getByRole("button", { name: "Preview CameraIcon" }).click()
    const stage = () => document.querySelector(".ip-stage svg")!
    const original = stage().innerHTML
    await expect.element(page.getByRole("group", { name: "Icon color" })).toBeVisible()
    const blue = page.getByRole("button", { name: "Blue", exact: true })
    await blue.click()
    await expect.element(blue).toHaveAttribute("aria-pressed", "true")
    await expect.poll(() => stage().innerHTML).toContain('stop-color="#39AFFD"')
    expect(document.querySelector('[data-icon-card] svg')?.innerHTML).not.toContain('stop-color="#39AFFD"')
    const write = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined)
    await page.getByRole("button", { name: "Copy usage" }).click()
    expect(write.mock.calls[0][0]).toContain('<CameraIcon color="blue" />')
    expect(page.getByRole("link", { name: "Download SVG" }).element().getAttribute("href")).toBe(cameraAsset)
    await page.getByRole("button", { name: "Green", exact: true }).click()
    await expect.poll(() => stage().innerHTML).toContain('stop-color="#9BF763"')
    await expect.element(blue).toHaveAttribute("aria-pressed", "false")
    await page.getByRole("button", { name: "Original", exact: true }).click()
    await expect.poll(() => stage().innerHTML).toBe(original)
  })
  it.each(["success", "error"] as const)("ignores an outdated copy's %s after the preview color changes", async result => {
    render()
    await page.getByRole("button", { name: "Preview CameraIcon" }).click()
    await page.getByRole("button", { name: "Blue", exact: true }).click()
    let finish!: () => void
    let fail!: (error: Error) => void
    const pending = new Promise<void>((resolve, reject) => { finish = resolve; fail = reject })
    const write = vi.spyOn(navigator.clipboard, "writeText").mockReturnValue(pending)
    const copy = page.getByRole("button", { name: "Copy usage" })
    await copy.click()
    expect(write.mock.calls[0][0]).toContain('<CameraIcon color="blue" />')
    await page.getByRole("button", { name: "Green", exact: true }).click()
    if (result === "success") finish()
    else fail(new Error("denied"))
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
    expect(document.querySelector(".ip-code")?.textContent).toContain('<CameraIcon color="green" />')
    expect(copy.element().textContent).toBe("Copy usage")
  })
  it("clears completed copy feedback on color changes and copies the current usage", async () => {
    render()
    await page.getByRole("button", { name: "Preview CameraIcon" }).click()
    await page.getByRole("button", { name: "Blue", exact: true }).click()
    const write = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined)
    const copy = page.getByRole("button", { name: "Copy usage" })
    await copy.click()
    await expect.poll(() => copy.element().textContent).toBe("Copied")
    await page.getByRole("button", { name: "Green", exact: true }).click()
    await expect.poll(() => copy.element().textContent).toBe("Copy usage")
    await copy.click()
    expect(write.mock.lastCall?.[0]).toContain('<CameraIcon color="green" />')
    await expect.poll(() => copy.element().textContent).toBe("Copied")
    await page.getByRole("button", { name: "Blue", exact: true }).click()
    await expect.poll(() => copy.element().textContent).toBe("Copy usage")
  })
  it("copies icon names from card and detail titles while artwork still opens the preview", async () => {
    render()
    const write = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error("denied")).mockResolvedValue(undefined)
    const title = page.getByRole("button", { name: "Copy CameraIcon", exact: true })
    await title.click()
    expect(write.mock.calls[0][0]).toBe("CameraIcon")
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    await expect.element(title).toHaveAttribute("title", "Copied")
    await title.click()
    await expect.element(title).toHaveAttribute("title", "Copy failed")
    await page.getByRole("button", { name: "Preview CameraIcon" }).click()
    await expect.element(page.getByRole("dialog")).toBeVisible()
    await page.getByRole("dialog").getByRole("button", { name: "Copy CameraIcon", exact: true }).first().click()
    expect(write.mock.calls[2][0]).toBe("CameraIcon")
    await expect.element(page.getByRole("dialog")).toBeVisible()
  })
  it("uses the configured primary color for gallery controls and portaled actions", async () => {
    const style = document.documentElement.style
    const previous = style.getPropertyValue("--exui-control-primary")
    try {
      style.setProperty("--exui-control-primary", "#1479d8")
      render()
      await expect.poll(() => container.querySelectorAll("[data-icon-card]").length).toBe(50)
      expect(getComputedStyle(container.querySelector(".ip-collection-tag > span")!).backgroundColor).toBe("rgb(20, 121, 216)")
      expect(getComputedStyle(page.getByRole("button", { name: "Light background" }).element()).outlineColor).toBe("rgb(20, 121, 216)")
      await page.getByRole("button", { name: "Preview CameraIcon" }).click()
      expect(getComputedStyle(page.getByRole("button", { name: "Copy usage" }).element()).backgroundColor).toBe("rgb(20, 121, 216)")
      expect(getComputedStyle(page.getByRole("link", { name: "Download SVG" }).element()).backgroundColor).toBe("rgb(20, 121, 216)")
      await page.getByRole("button", { name: "Green", exact: true }).click()
      expect(getComputedStyle(page.getByRole("button", { name: "Green", exact: true }).element()).outlineColor).toBe("rgb(20, 121, 216)")
      style.setProperty("--exui-control-primary", "#2a90e0")
      await expect.poll(() => getComputedStyle(page.getByRole("button", { name: "Copy usage" }).element()).backgroundColor).toBe("rgb(42, 144, 224)")
    } finally {
      if (previous) style.setProperty("--exui-control-primary", previous)
      else style.removeProperty("--exui-control-primary")
    }
  })
  it("renders all recolored icons with the same transparent glass silhouettes", async () => {
    root.render(<div>{iconCatalog.map(entry => <div key={entry.name} data-palette-check><entry.Component /><entry.Component color="blue" /></div>)}</div>)
    await expect.poll(() => container.querySelectorAll("[data-palette-check]").length).toBe(50)
    async function pixels(svg: SVGSVGElement) {
      const copy = svg.cloneNode(true) as SVGSVGElement
      copy.setAttribute("width", "128")
      copy.setAttribute("height", "128")
      const image = new Image()
      image.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(copy))
      await image.decode()
      const canvas = document.createElement("canvas")
      canvas.width = canvas.height = 128
      const context = canvas.getContext("2d")!
      context.drawImage(image, 0, 0)
      return context.getImageData(0, 0, 128, 128).data
    }
    let changedIcons = 0
    for (const row of container.querySelectorAll("[data-palette-check]")) {
      const [originalSvg, changedSvg] = row.querySelectorAll("svg")
      const [original, changed] = await Promise.all([pixels(originalSvg), pixels(changedSvg)])
      let alphaError = 0, colorError = 0
      for (let index = 0; index < original.length; index += 4) {
        alphaError += Math.abs(original[index + 3] - changed[index + 3])
        for (let channel = 0; channel < 3; channel++) colorError += Math.abs(original[index + channel] - changed[index + channel])
      }
      expect(alphaError / (128 * 128), changedSvg.outerHTML.slice(0, 150)).toBeLessThan(0.5)
      expect(changed[3]).toBeLessThanOrEqual(5)
      if (colorError > 1000) changedIcons++
    }
    expect(changedIcons).toBeGreaterThanOrEqual(40)
  })
})
