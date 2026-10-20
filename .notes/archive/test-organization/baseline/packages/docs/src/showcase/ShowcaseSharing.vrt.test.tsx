import "./ShowcaseStyles"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { page } from "vitest/browser"
import Showcase from "./Showcase"

let root: Root
let container: HTMLDivElement
let previousClasses: string
const storageKeys = ["exui-showcase-language", "exui-showcase-theme", "exui-showcase-density"] as const
let previous: { hash: string; language: string; title: string; storage: (string | null)[]; x: number; y: number }

beforeEach(async () => {
  previousClasses = document.documentElement.className
  previous = { hash: location.hash, language: document.documentElement.lang, title: document.title, storage: storageKeys.map(key => localStorage.getItem(key)), x: scrollX, y: scrollY }
  localStorage.setItem("exui-showcase-language", "en")
  history.replaceState(null, "", "#/components/button")
  container = document.createElement("div")
  document.body.replaceChildren(container)
  root = createRoot(container)
  root.render(<Showcase />)
  await document.fonts.ready
})

afterEach(() => {
  root.unmount()
  vi.restoreAllMocks()
  document.documentElement.className = previousClasses
  document.documentElement.lang = previous.language
  document.title = previous.title
  history.replaceState(null, "", previous.hash || location.pathname + location.search)
  storageKeys.forEach((key, index) => previous.storage[index] === null ? localStorage.removeItem(key) : localStorage.setItem(key, previous.storage[index]!))
  scrollTo(previous.x, previous.y)
})

describe.skipIf(window.innerWidth < 1000)("Showcase sharing", () => {
  it("shows stable numbering and two copy actions above every example", async () => {
    await expect.poll(() => container.querySelectorAll('[data-example-id]').length).toBe(61)
    expect(container.querySelectorAll('.showcase-example:has([data-example-id]) > .showcase-example-header')).toHaveLength(61)
    expect(container.querySelectorAll('.showcase-example:has([data-example-kind="exui-extension"]) > .showcase-example-header')).toHaveLength(2)
    const header = container.querySelector('[data-share-example-id="c-button-1"] .showcase-example-header')!
    expect(header.textContent).toContain('Button · 01')
    expect(header.querySelectorAll('button')).toHaveLength(2)
  })

  it("copies a canonical link without appearance preferences or current query parameters", async () => {
    await expect.poll(() => container.querySelector('[data-share-example-id="c-button-1"]')).not.toBeNull()
    const write = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    const header = container.querySelector('[data-share-example-id="c-button-1"] .showcase-example-header')!
    await page.elementLocator(header).getByRole('button', { name: 'Copy link', exact: true }).click()
    expect(write).toHaveBeenCalledOnce()
    const url = new URL(write.mock.calls[0][0])
    expect(url.pathname).toMatch(/\/examples\/c-button-1\/$/)
    expect(url.search).toBe('')
    expect(url.hash).toBe('')
    await expect.element(page.elementLocator(header).getByRole('status')).toHaveTextContent('Link copied')
  })

  it("locates a lazy example and keeps the input draft when switching targets on the same page", async () => {
    location.hash = '#/components/input?example=c-input-1'
    await expect.poll(() => container.querySelector('[data-share-example-id="c-input-1"][data-highlighted="true"]')).not.toBeNull()
    const input = container.querySelector('[data-example-id="c-input-1"] input') as HTMLInputElement
    await page.elementLocator(input).fill('Keep this draft')
    location.hash = '#/components/input?example=c-input-2'
    await expect.poll(() => container.querySelector('[data-share-example-id="c-input-2"][data-highlighted="true"]')).not.toBeNull()
    expect(container.querySelector('[data-example-id="c-input-1"] input')).toBe(input)
    expect(input.value).toBe('Keep this draft')
  })

  it("reports clipboard failure without claiming success", async () => {
    await expect.poll(() => container.querySelector('[data-share-example-id="c-button-1"]')).not.toBeNull()
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Denied'))
    const header = container.querySelector('[data-share-example-id="c-button-1"] .showcase-example-header')!
    await page.elementLocator(header).getByRole('button', { name: 'Copy link', exact: true }).click()
    await expect.element(page.elementLocator(header).getByRole('status')).toHaveTextContent('Copy failed. Please try again.')
  })

  it("copies the readable Markdown and its helper files from the real source endpoint", async () => {
    location.hash = '#/components/input-group'
    await expect.poll(() => container.querySelector('[data-share-example-id="c-input-group-1"]')).not.toBeNull()
    const write = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    const header = container.querySelector('[data-share-example-id="c-input-group-1"] .showcase-example-header')!
    await page.elementLocator(header).getByRole('button', { name: 'Copy source', exact: true }).click()
    await expect.poll(() => write.mock.calls.length).toBe(1)
    const text = write.mock.calls[0][0]
    expect(text).toContain('Reference: http')
    expect(text).toContain('src/showcase/examples/input-group/c-input-group-1.tsx')
    expect(text).toContain('src/showcase/examples/_shared/example-runtime.tsx')
    await expect.element(page.elementLocator(header).getByRole('status')).toHaveTextContent('Source copied')
  })

  it("provides headers for extension and ExUI previews without changing upstream IDs", async () => {
    location.hash = '#/components/input-group'
    await expect.poll(() => container.querySelector('[data-share-example-id="exui-direction"]')).not.toBeNull()
    const extension = container.querySelector('[data-share-example-id="exui-direction"]')!
    expect(extension.querySelector('[data-example-id]')).toBeNull()
    expect(extension.querySelector('.showcase-example-number')?.textContent).toBe('Input Group · E01')
    location.hash = '#/components/field'
    await expect.poll(() => container.querySelector('[data-page-loaded]')?.getAttribute('data-page-loaded')).toBe('field')
    await expect.poll(() => container.querySelectorAll('.showcase-example-header').length).toBe(14)
    expect(Array.from(container.querySelectorAll<HTMLElement>('[data-share-example-id^="exui-field-"]'), node => node.dataset.shareExampleId)).toEqual([
      'exui-field-settings', 'exui-field-display', 'exui-field-layout',
    ])
    expect(Array.from(container.querySelectorAll<HTMLElement>('[data-example-id]'), node => node.dataset.exampleId)).toEqual(
      Array.from({ length: 11 }, (_, index) => `c-field-${index + 1}`),
    )
    expect(container.querySelectorAll('[data-share-example-id]')).toHaveLength(14)
  })

  it("accepts a valid Markdown document from a static host with a generic content type", async () => {
    await expect.poll(() => container.querySelector('[data-share-example-id="c-button-1"]')).not.toBeNull()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('# Button · 01\n\nExample ID: `c-button-1`\n\n## Files\n', { headers: { 'content-type': 'application/octet-stream' } }))
    const write = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    const header = container.querySelector('[data-share-example-id="c-button-1"] .showcase-example-header')!
    await page.elementLocator(header).getByRole('button', { name: 'Copy source', exact: true }).click()
    await expect.poll(() => write.mock.calls.length).toBe(1)
    expect(write.mock.calls[0][0]).toContain('Example ID: `c-button-1`')
  })
})
