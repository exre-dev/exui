import "@exre/exui/style.css"
import { createRoot, type Root } from "react-dom/client"
import { page } from "vitest/browser"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { toast } from "@exre/exui"
import { pages } from "./pages/exui"

let root: Root

beforeEach(() => {
  const container = document.createElement("div")
  document.body.replaceChildren(container)
  root = createRoot(container)
})

afterEach(() => {
  toast.dismiss()
  root.unmount()
})

describe("ExUI page interactions", () => {
  it("validates and saves an edited project through the Form preview", async () => {
    const FormPage = pages.form
    root.render(<FormPage />)
    let submissions = 0
    const name = page.getByRole("textbox", { name: "Project name", exact: true }).first()
    await name.fill("")
    name.element().closest("form")!.addEventListener("submit", () => { submissions++ })
    await page.getByRole("button", { name: "Save project", exact: true }).click()
    await expect.element(page.getByText("Enter at least 2 characters", { exact: true }).first()).toBeVisible()
    await name.fill("Borealis")
    await page.getByRole("button", { name: "Save project", exact: true }).click()
    expect(submissions).toBe(2)
    await expect.element(page.getByRole("status").last()).toHaveTextContent("Borealis")
  })

  it("reviews the configured Form draft before launching and resets the completed flow", async () => {
    const ConfiguredFormPage = pages.form
    root.render(<ConfiguredFormPage />)
    const projectName = page.getByRole("textbox", { name: "Project name", exact: true }).last()
    await expect.element(projectName).toBeVisible()
    let submissions = 0
    projectName.element().closest("form")!.addEventListener("submit", () => { submissions++ })
    await page.getByRole("button", { name: "Continue", exact: true }).click()
    await page.getByRole("button", { name: /^Launch date/ }).click()
    await page.getByRole("button", { name: "Today", exact: true }).click()
    await page.getByRole("checkbox", { name: /^I accept the project guidelines/ }).click()
    await page.getByRole("button", { name: "Continue", exact: true }).click()
    await expect.element(page.getByRole("button", { name: "Launch project", exact: true })).toBeVisible()
    expect(submissions).toBe(0)
    await expect.element(page.getByRole("status").last()).not.toBeInTheDocument()
    await page.getByRole("button", { name: "Launch project", exact: true }).click()
    expect(submissions).toBe(1)
    await expect.element(page.getByRole("status").last()).toHaveTextContent("Aurora is ready")
    await page.getByRole("button", { name: "Reset", exact: true }).last().click()
    await expect.element(projectName).toBeVisible()
    await expect.element(projectName).toHaveValue("Aurora")
    await expect.element(page.getByRole("button", { name: "Continue", exact: true })).toBeVisible()
    await expect.element(page.getByRole("status").last()).not.toBeInTheDocument()
    await expect.element(page.getByRole("button", { name: "Back", exact: true })).not.toBeInTheDocument()
  })
})
