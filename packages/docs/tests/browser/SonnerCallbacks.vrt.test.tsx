import "@exre/exui/style.css"
import { flushSync } from "react-dom"
import { createRoot, type Root } from "react-dom/client"
import { Toaster, toast } from "@exre/exui"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import CallbackNotificationExample, { startUploadWithNotice } from "../../../../skills/exui/examples/sonner-callbacks"

type Subscribe = Parameters<typeof startUploadWithNotice>[0]

function controlledUpload() {
  let progress = (_percent: number) => {}
  let success = () => {}
  let error = (_reason: Error) => {}
  let unsubscribeCount = 0
  const subscribe: Subscribe = (onProgress, onSuccess, onError) => {
    progress = onProgress
    success = onSuccess
    error = onError
    return () => { unsubscribeCount++ }
  }
  return {
    subscribe,
    progress: (percent: number) => progress(percent),
    success: () => success(),
    error: (reason: Error) => error(reason),
    get unsubscribeCount() { return unsubscribeCount },
  }
}

let root: Root
let container: HTMLDivElement

function notification() {
  return [...container.querySelectorAll<HTMLElement>('[data-sonner-toast]:not([data-removed="true"])')]
    .find(item => item.textContent?.includes("Upload")) ?? null
}

function uploadRecord() {
  const record = toast.getToasts().find(item => "title" in item && typeof item.title === "string" && item.title.startsWith("Upload"))
  return record && "title" in record ? record : null
}

beforeEach(() => {
  container = document.createElement("div")
  document.body.append(container)
  root = createRoot(container)
  flushSync(() => root.render(<Toaster position="top-right" duration={3000} visibleToasts={3} />))
})

afterEach(() => {
  flushSync(() => root.unmount())
  toast.dismiss()
  container.remove()
})

describe("callback notification example", () => {
  it("keeps progress and success on the same notification, then lets cancel clear the result", async () => {
    const upload = controlledUpload()
    const cancel = startUploadWithNotice(upload.subscribe)
    await expect.poll(notification).not.toBeNull()
    const original = notification()
    const id = uploadRecord()?.id
    expect(uploadRecord()?.type).toBe("loading")
    upload.progress(42)
    expect(uploadRecord()).toMatchObject({ id, type: "loading", title: "Uploading... 42%" })
    await expect.poll(() => notification()?.textContent).toContain("42%")
    expect(notification()).toBe(original)
    upload.success()
    expect(uploadRecord()).toMatchObject({ id, type: "success", title: "Upload complete" })
    await expect.poll(() => notification()?.textContent).toContain("Upload complete")
    expect(notification()).toBe(original)
    expect(upload.unsubscribeCount).toBe(1)
    cancel()
    expect(uploadRecord()).toBeNull()
    await expect.poll(notification).toBeNull()
  })

  it("keeps an error on the same notification and ignores repeated or late results", async () => {
    const upload = controlledUpload()
    const cancel = startUploadWithNotice(upload.subscribe)
    await expect.poll(notification).not.toBeNull()
    const original = notification()
    const id = uploadRecord()?.id
    upload.progress(65)
    expect(uploadRecord()).toMatchObject({ id, type: "loading", title: "Uploading... 65%" })
    await expect.poll(() => notification()?.textContent).toContain("65%")
    upload.error(new Error("Disk full"))
    expect(uploadRecord()).toMatchObject({ id, type: "error", title: "Upload failed: Disk full" })
    await expect.poll(() => notification()?.textContent).toContain("Disk full")
    expect(notification()).toBe(original)
    upload.success()
    upload.error(new Error("Second failure"))
    upload.progress(99)
    expect(uploadRecord()).toMatchObject({ id, type: "error", title: "Upload failed: Disk full" })
    expect(notification()?.textContent).toContain("Disk full")
    expect(notification()?.textContent).not.toContain("Second failure")
    expect(upload.unsubscribeCount).toBe(1)
    cancel()
  })

  it("cancels only its own notification and ignores callbacks after cancellation", async () => {
    const externalId = toast.info("External notice")
    const upload = controlledUpload()
    const cancel = startUploadWithNotice(upload.subscribe)
    await expect.poll(notification).not.toBeNull()
    cancel()
    expect(uploadRecord()).toBeNull()
    await expect.poll(notification).toBeNull()
    upload.progress(90)
    expect(uploadRecord()).toBeNull()
    upload.success()
    expect(uploadRecord()).toBeNull()
    upload.error(new Error("Late failure"))
    expect(uploadRecord()).toBeNull()
    expect(notification()).toBeNull()
    expect(upload.unsubscribeCount).toBe(1)
    expect([...container.querySelectorAll<HTMLElement>("[data-sonner-toast]")].some(item => item.textContent?.includes("External notice"))).toBe(true)
    toast.dismiss(externalId)
  })

  it("closes an overdue upload once and ignores its late callback", async () => {
    const upload = controlledUpload()
    const cancel = startUploadWithNotice(upload.subscribe, 100)
    await expect.poll(notification).not.toBeNull()
    await expect.poll(() => upload.unsubscribeCount).toBe(1)
    expect(uploadRecord()).toBeNull()
    await expect.poll(notification).toBeNull()
    upload.progress(80)
    expect(uploadRecord()).toBeNull()
    upload.success()
    expect(uploadRecord()).toBeNull()
    upload.error(new Error("Late failure"))
    expect(uploadRecord()).toBeNull()
    expect(notification()).toBeNull()
    cancel()
  })

  it("cleans its task when the React example unmounts", async () => {
    const upload = controlledUpload()
    flushSync(() => root.render(<><Toaster position="top-right" duration={3000} visibleToasts={3} /><CallbackNotificationExample subscribe={upload.subscribe} /></>))
    await page.elementLocator(container).getByRole("button", { name: "Start upload" }).click()
    await expect.poll(notification).not.toBeNull()
    flushSync(() => root.render(<Toaster position="top-right" duration={3000} visibleToasts={3} />))
    expect(uploadRecord()).toBeNull()
    await expect.poll(notification).toBeNull()
    expect(upload.unsubscribeCount).toBe(1)
    upload.progress(75)
    expect(uploadRecord()).toBeNull()
    upload.success()
    expect(uploadRecord()).toBeNull()
    upload.error(new Error("Late failure"))
    expect(uploadRecord()).toBeNull()
    expect(notification()).toBeNull()
  })

  it("unsubscribes even when success or error arrives synchronously during subscribe", async () => {
    for (const outcome of ["success", "error"] as const) {
      let unsubscribeCount = 0
      const subscribe: Subscribe = (_progress, success, error) => {
        if (outcome === "success") success()
        else error(new Error("Immediate failure"))
        return () => { unsubscribeCount++ }
      }
      const cancel = startUploadWithNotice(subscribe)
      expect(uploadRecord()?.type).toBe(outcome === "success" ? "success" : "error")
      await expect.poll(() => notification()?.textContent).toContain(outcome === "success" ? "Upload complete" : "Immediate failure")
      expect(unsubscribeCount).toBe(1)
      cancel()
      expect(uploadRecord()).toBeNull()
      await expect.poll(notification).toBeNull()
    }
  })

  it("turns a thrown subscription into an error notification that cancel can clear", async () => {
    const cancel = startUploadWithNotice(() => { throw new Error("Connection refused") }, 30)
    expect(uploadRecord()).toMatchObject({ type: "error", title: "Upload failed: Connection refused" })
    await expect.poll(() => notification()?.textContent).toContain("Connection refused")
    cancel()
    expect(uploadRecord()).toBeNull()
    await expect.poll(notification).toBeNull()
  })
})
