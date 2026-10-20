import "../../src/showcase/ShowcaseStyles"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import WebhookResend from "../../src/showcase/examples/trace/c-trace-14"
import StreamingRun from "../../src/showcase/examples/trace/c-trace-2"
import DnsRecords from "../../src/showcase/examples/trace/c-trace-21"
import { LanguageContext, type ShowcaseLanguage } from "../../src/showcase/language"

let root: Root
let container: HTMLDivElement

function render(language: ShowcaseLanguage) {
  root.render(
    <LanguageContext.Provider value={{ language, setLanguage: () => {} }}>
      <WebhookResend />
    </LanguageContext.Provider>
  )
}

beforeEach(() => {
  container = document.createElement("div")
  document.body.append(container)
  root = createRoot(container)
})

afterEach(() => {
  root.unmount()
  container.remove()
})

describe("Trace example copy", () => {
  it("renders the DNS record count as one Chinese sentence", async () => {
    root.render(<LanguageContext.Provider value={{ language: "zh-CN", setLanguage: () => {} }}><DnsRecords /></LanguageContext.Provider>)
    await expect.element(page.getByText("在 DNS 服务商处添加 3 条记录")).toBeVisible()
  })

  it("continues streaming the same reasoning after switching from Chinese to English", async () => {
    root.render(<LanguageContext.Provider value={{ language: "zh-CN", setLanguage: () => {} }}><StreamingRun /></LanguageContext.Provider>)
    await expect.element(page.getByText("502 表示函数崩溃或超时；日志会说明具体原因。")).toBeVisible()

    root.render(<LanguageContext.Provider value={{ language: "en", setLanguage: () => {} }}><StreamingRun /></LanguageContext.Provider>)
    await expect.element(page.getByText("A 502 means the function crashed or timed out. The logs will say which.")).toBeVisible()
    await expect.element(page.getByText("Searching logs for POST /api/checkout")).toBeVisible()
  })

  it("switches the live resend copy to Chinese without resetting attempts", async () => {
    render("en")
    await expect.element(page.getByText("Attempt 3 delivered, 200 in 214 ms")).toBeVisible()
    await page.getByRole("button", { name: "Resend event" }).click()
    await expect.element(page.getByText("Attempt 4 delivered, 200 in 188 ms")).toBeVisible()

    render("zh-CN")
    await expect.element(page.getByText("第 4 次尝试已送达，200，耗时 188 毫秒")).toBeVisible()
    await expect.element(page.getByText("共 4 次尝试")).toBeVisible()
    expect(container.querySelectorAll('[data-slot="trace-collapsible"]')).toHaveLength(4)

    render("en")
    await expect.element(page.getByText("Attempt 4 delivered, 200 in 188 ms")).toBeVisible()
  })
})
