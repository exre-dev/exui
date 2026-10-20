import "@exre/exui/style.css"
import "../../src/showcase/Showcase.css"

import { createRoot } from "react-dom/client"
import { page } from "vitest/browser"
import { expect, it } from "vitest"
import { FormExamples } from "../../src/showcase/FormExamples"

it("lets Showcase visitors change shared sizing and preview narrow rows without losing drafts", async () => {
  const host = document.createElement("div")
  host.style.width = "48rem"
  document.body.replaceChildren(host)
  const root = createRoot(host)
  try {
    root.render(<FormExamples />)
    const input = page.getByRole("textbox", { name: "Inherited content", exact: true })
    const override = page.getByRole("textbox", { name: "Local override", exact: true })
    const standalone = page.getByRole("textbox", { name: "Standalone input", exact: true }).last()
    await expect.element(input).toBeVisible()
    await expect.element(standalone).toBeVisible()
    const standaloneField = standalone.element().closest<HTMLElement>('[data-slot="field"]')!
    const standaloneLabel = standaloneField.querySelector<HTMLElement>('[data-slot="field-label"]')!
    expect(Math.abs(standaloneLabel.getBoundingClientRect().top - standalone.element().getBoundingClientRect().top)).toBeLessThan(8)
    await expect.poll(() => standalone.element().getBoundingClientRect().width).toBeCloseTo(288, 0)
    await standalone.fill("Independent draft")
    await input.fill("Preserved draft")
    await page.getByRole("button", { name: "12rem", exact: true }).click()
    await expect.poll(() => input.element().getBoundingClientRect().width).toBeCloseTo(192, 0)
    await expect.poll(() => standalone.element().getBoundingClientRect().width).toBeCloseTo(192, 0)
    const standaloneRight = standalone.element().getBoundingClientRect().left
    const rightAlignedLeft = input.element().getBoundingClientRect().left
    await page.getByRole("button", { name: "Align content left", exact: true }).click()
    await expect.poll(() => input.element().getBoundingClientRect().left).toBeLessThan(rightAlignedLeft - 20)
    await expect.poll(() => standalone.element().getBoundingClientRect().left).toBeLessThan(standaloneRight - 20)
    expect(override.element().getBoundingClientRect().width).toBeCloseTo(160, 0)
    expect(page.getByRole("textbox", { name: "Configured content", exact: true }).element().getBoundingClientRect().width).toBeCloseTo(192, 0)
    await page.getByRole("button", { name: "Narrow preview", exact: true }).click()
    await expect.poll(() => input.element().getBoundingClientRect().width).toBeCloseTo(320, 0)
    expect(override.element().getBoundingClientRect().width).toBeCloseTo(320, 0)
    await expect.poll(() => standalone.element().getBoundingClientRect().width).toBeCloseTo(320, 0)
    expect(standalone.element().getBoundingClientRect().width).toBeCloseTo(standaloneField.getBoundingClientRect().width, 0)
    expect(standalone.element().getBoundingClientRect().top).toBeGreaterThanOrEqual(standaloneLabel.getBoundingClientRect().bottom)
    expect(standaloneField.scrollWidth).toBeLessThanOrEqual(standaloneField.clientWidth)
    await expect.element(standalone).toHaveValue("Independent draft")
    await expect.element(input).toHaveValue("Preserved draft")
  } finally {
    root.unmount()
  }
})
