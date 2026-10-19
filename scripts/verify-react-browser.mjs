import assert from "node:assert/strict"
import { createRequire } from "node:module"
import { join } from "node:path"
import { pathToFileURL } from "node:url"

// The controller reuses the workspace's pinned browser tooling. The page
// itself serves only the isolated consumer's production build and tarball.
const requireFromShowcase = createRequire(new URL("../packages/docs/package.json", import.meta.url))

async function verifyReactBrowser(consumerRoot) {
  const { chromium } = requireFromShowcase("playwright")
  const requireFromConsumer = createRequire(join(consumerRoot, "package.json"))
  const { preview } = await import(pathToFileURL(requireFromConsumer.resolve("vite")).href)
  const server = await preview({
    configFile: false,
    root: consumerRoot,
    logLevel: "error",
    preview: { host: "127.0.0.1", port: 0 },
  })
  let browser
  try {
    browser = await chromium.launch({ headless: true })
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" })
    page.setDefaultTimeout(10_000)
    const pageErrors = []
    const chunkRequests = []
    page.on("pageerror", (error) => pageErrors.push(error.message))
    page.on("requestfinished", (request) => chunkRequests.push(request.url()))
    await page.goto(server.resolvedUrls.local[0])

    const semanticPrimaryOf = (locator) => locator.evaluate((element) => {
      const probe = document.createElement("span")
      probe.style.color = "var(--primary)"
      element.append(probe)
      const color = getComputedStyle(probe).color
      probe.remove()
      return color
    })
    const brandBadge = page.locator("[data-testid='reui-brand-badge']")
    const initialBrand = await brandBadge.evaluate((element) => getComputedStyle(element).backgroundColor)
    await page.evaluate(() => document.documentElement.style.setProperty("--exui-control-primary", "#ff00aa"))
    assert.equal(await semanticPrimaryOf(brandBadge), "rgb(255, 0, 170)",
      "ReUI semantic primary must follow a consumer override of the ExUI brand Token")
    assert.notEqual(await brandBadge.evaluate((element) => getComputedStyle(element).backgroundColor), initialBrand,
      "Badge's contrast-adjusted fill must still respond to a brand Token override")
    await page.evaluate(() => document.documentElement.style.removeProperty("--exui-control-primary"))
    assert.equal(await brandBadge.evaluate((element) => getComputedStyle(element).backgroundColor), initialBrand)

    const nestedDark = page.locator("[data-testid='nested-dark']")
    const backgroundOf = (selector) => page.locator(selector).evaluate((element) => getComputedStyle(element).backgroundColor)
    const lightBackground = await backgroundOf("[data-testid='root-background']")
    assert.notEqual(await backgroundOf("[data-testid='nested-dark-background']"), lightBackground,
      "a nested dark surface must resolve its own short semantic background")
    assert.notEqual(await backgroundOf("[data-testid='nested-pitch-background']"), lightBackground,
      "a nested pitch-black surface must resolve its own short semantic background")
    const nestedBrandBadge = page.locator("[data-testid='nested-dark-badge']")
    const initialNestedBrand = await backgroundOf("[data-testid='nested-dark-badge']")
    await nestedDark.evaluate((element) => element.style.setProperty("--exui-control-primary", "#ff00aa"))
    assert.equal(await semanticPrimaryOf(nestedBrandBadge), "rgb(255, 0, 170)",
      "a scoped brand Token override must reach a ReUI short semantic alias")
    assert.notEqual(await backgroundOf("[data-testid='nested-dark-badge']"), initialNestedBrand,
      "a scoped override must update the contrast-adjusted Badge fill")
    assert.equal(await brandBadge.evaluate((element) => getComputedStyle(element).backgroundColor), initialBrand,
      "a scoped brand override must not change the root Badge")
    await nestedDark.evaluate((element) => element.style.removeProperty("--exui-control-primary"))
    assert.equal(await backgroundOf("[data-testid='nested-dark-badge']"), initialNestedBrand)

    const geometry = async (selector) => page.locator(selector).evaluate((element) => {
      const style = getComputedStyle(element)
      return {
        height: Number.parseFloat(style.height),
        padding: Number.parseFloat(style.paddingLeft),
        paddingBlock: Number.parseFloat(style.paddingTop),
        gap: Number.parseFloat(style.columnGap),
      }
    })
    for (const theme of ["light", "dark", "pitch-black"]) {
      await page.evaluate((name) => {
        document.documentElement.classList.remove("dark", "pitch-black")
        if (name !== "light") document.documentElement.classList.add(name)
      }, theme)
      for (const [density, height, padding] of [["standard", 36, 12], ["compact", 32, 8]]) {
        for (const control of ["button", "input"]) {
          const actual = await geometry(`[data-testid='density-${density}-${control}']`)
          assert.ok(Math.abs(actual.height - height) <= 0.5, `${theme}/${density} ${control} height: ${actual.height}`)
          assert.ok(Math.abs(actual.padding - padding) <= 0.5, `${theme}/${density} ${control} padding: ${actual.padding}`)
        }
      }
      for (const slot of ["select-trigger", "native-select", "input-group"]) {
        const standard = await page.locator(`[data-testid='density-standard'] [data-slot='${slot}']`).evaluate((element) => getComputedStyle(element).height)
        const compact = await page.locator(`[data-testid='density-compact'] [data-slot='${slot}']`).evaluate((element) => getComputedStyle(element).height)
        assert.equal(standard, "36px", `${theme} standard ${slot}`)
        assert.equal(compact, "32px", `${theme} compact ${slot}`)
      }
      const textStandard = await page.locator("[data-testid='density-standard-textarea']").evaluate((element) => getComputedStyle(element).paddingLeft)
      const textCompact = await page.locator("[data-testid='density-compact-textarea']").evaluate((element) => getComputedStyle(element).paddingLeft)
      assert.equal(textStandard, "12px", `${theme} standard Textarea padding`)
      assert.equal(textCompact, "8px", `${theme} compact Textarea padding`)
      for (const density of ["standard", "compact"]) {
        const scope = page.getByTestId(`density-${density}`)
        await scope.evaluate(async (element) => {
          element.style.setProperty("--density-control-height", "44px")
          element.style.setProperty("--density-control-padding-inline", "20px")
          element.style.setProperty("--density-control-gap", "14px")
          element.getBoundingClientRect()
          await Promise.all(element.getAnimations({ subtree: true }).map((animation) => animation.finished))
        })
        try {
          for (const slot of ["button", "input", "select-trigger", "native-select", "input-group"]) {
            const actual = await geometry(`[data-testid='density-${density}'] [data-slot='${slot}']`)
            assert.equal(actual.height, 44, `${theme}/${density} ${slot} must inherit the control height`)
          }
          for (const slot of ["button", "input", "textarea", "select-trigger", "native-select"]) {
            const actual = await geometry(`[data-testid='density-${density}'] [data-slot='${slot}']`)
            assert.equal(actual.padding, 20, `${theme}/${density} ${slot} must inherit inline padding`)
          }
          for (const [slot, dimension] of [["button", "gap"], ["textarea", "paddingBlock"]]) {
            const actual = await geometry(`[data-testid='density-${density}'] [data-slot='${slot}']`)
            assert.equal(actual[dimension], 14, `${theme}/${density} ${slot} must inherit the control gap`)
          }
        } finally {
          await scope.evaluate(async (element) => {
            element.style.removeProperty("--density-control-height")
            element.style.removeProperty("--density-control-padding-inline")
            element.style.removeProperty("--density-control-gap")
            element.getBoundingClientRect()
            await Promise.all(element.getAnimations({ subtree: true }).map((animation) => animation.finished))
          })
        }
      }
    }
    await page.evaluate(() => document.documentElement.classList.remove("dark", "pitch-black"))
    const draftInput = page.getByRole("textbox", { name: "Standard density input" })
    await draftInput.fill("kept draft")
    await draftInput.focus()
    const focusedHeight = (await geometry("[data-testid='density-standard-input']")).height
    await page.locator("[data-testid='density-standard']").evaluate(async (element) => {
      element.classList.add("density-compact")
      element.getBoundingClientRect()
      await Promise.all(element.getAnimations({ subtree: true }).map((animation) => animation.finished))
    })
    assert.equal(await draftInput.inputValue(), "kept draft", "density changes must retain the draft")
    assert.equal((await geometry("[data-testid='density-standard-input']")).height, 32,
      "density changes must update a focused control in place")
    await page.locator("[data-testid='density-standard']").evaluate(async (element) => {
      element.classList.remove("density-compact")
      element.getBoundingClientRect()
      await Promise.all(element.getAnimations({ subtree: true }).map((animation) => animation.finished))
    })
    assert.equal((await geometry("[data-testid='density-standard-input']")).height, focusedHeight)
    const glassButton = page.locator("[data-testid='density-standard-button']")
    const glassHeight = (await geometry("[data-testid='density-standard-button']")).height
    await glassButton.evaluate((element) => element.classList.remove("ex-glass"))
    assert.equal((await geometry("[data-testid='density-standard-button']")).height, glassHeight,
      "Glass toggling must not change default control geometry")
    await glassButton.evaluate((element) => element.classList.add("ex-glass"))

    const editableRating = page.getByRole("radiogroup", { name: "Rating" })
    await editableRating.getByRole("radio", { name: "2 of 5" }).focus()
    await page.keyboard.press("ArrowRight")
    assert.equal(await editableRating.getByRole("radio", { name: "3 of 5" }).getAttribute("aria-checked"), "true")
    await page.keyboard.press("End")
    assert.equal(await editableRating.getByRole("radio", { name: "5 of 5" }).getAttribute("aria-checked"), "true")
    await page.keyboard.press("Home")
    const firstRating = editableRating.getByRole("radio", { name: "1 of 5" })
    assert.equal(await firstRating.getAttribute("aria-checked"), "true", "Home must select the first rating")
    assert.equal(await firstRating.evaluate((element) => element === document.activeElement), true,
      "Home must move keyboard focus to the first rating")
    const readonlyRating = page.getByRole("meter", { name: "Read-only rating" })
    assert.equal(await readonlyRating.getAttribute("aria-valuenow"), "2.5")
    assert.equal(await readonlyRating.getAttribute("aria-valuemax"), "5")

    await page.locator("[data-slot='data-grid']").getByText("Ada", { exact: true }).waitFor({ state: "visible" })
    assert.equal((await page.locator("[data-slot='data-grid']").getAttribute("class"))?.includes("ex-glass"), true,
      "the packed grid container must accept Glass on its outer surface")
    await page.locator("[data-slot='code-block-token']").first().waitFor({ state: "visible" })
    assert.equal((await page.locator("[data-slot='code-block']").getAttribute("class"))?.includes("ex-glass"), true,
      "the packed code block must accept Glass on its outer surface")
    assert.ok(chunkRequests.some((url) => /typescript-[^/]+\.js$/.test(url)),
      "highlighting must load the TypeScript grammar from the packed dynamic chunks")

    // Real chart data must reach ExUI's legend and tooltip via the same
    // Recharts context. A placeholder child or empty SSR result cannot pass.
    const bars = page.locator(".recharts-bar-rectangle")
    await bars.nth(1).waitFor({ state: "visible" })
    assert.equal(await bars.count(), 2, "both chart data points must render")
    const legend = page.locator(".recharts-legend-wrapper")
    await legend.getByText("Visitors", { exact: true }).waitFor({ state: "visible" })

    const tooltip = page.locator(".recharts-tooltip-wrapper")
    for (const [index, month, value] of [[0, "January", "10"], [1, "February", "20"]]) {
      await bars.nth(index).hover()
      await tooltip.getByText(month, { exact: true }).waitFor({ state: "visible" })
      await tooltip.getByText("Visitors", { exact: true }).waitFor({ state: "visible" })
      await tooltip.getByText(value, { exact: true }).waitFor({ state: "visible" })
    }
    await page.mouse.move(1000, 800)
    await tooltip.waitFor({ state: "hidden" })

    const trigger = page.getByRole("button", { name: "Open", exact: true })
    await trigger.click()
    const dialog = page.getByRole("dialog", { name: "Subscribe" })
    await dialog.waitFor({ state: "visible" })
    assert.equal(await dialog.evaluate((element) => element.closest("#app") === null), true,
      "DialogContent must mount through its portal outside the application root")
    await dialog.getByLabel("Email", { exact: true }).fill("reader@example.com")
    await dialog.getByRole("button", { name: "Subscribe", exact: true }).click()
    await dialog.getByRole("status").getByText("reader@example.com", { exact: true }).waitFor()
    await page.keyboard.press("Escape")
    await dialog.waitFor({ state: "hidden" })
    await page.waitForFunction(() => document.activeElement?.textContent === "Open")

    const profileTrigger = page.getByRole("button", { name: "Open profile", exact: true })
    await profileTrigger.click()
    const profileDialog = page.getByRole("dialog", { name: "Project profile" })
    await profileDialog.waitFor({ state: "visible" })
    assert.equal(await profileDialog.evaluate((element) => element.closest("#app") === null), true,
      "ReUI Dialog must mount through its portal outside the application root")
    assert.equal(await profileDialog.evaluate((element) => element.getAttribute("aria-describedby")),
      await page.locator("[data-slot='dialog-description']").getAttribute("id"),
      "the description must be wired to the element that carries it")

    // The reduce path is the context default here: no motion, but fully usable.
    const reduced = await profileDialog.evaluate((element) => {
      const style = getComputedStyle(element)
      return { name: style.animationName, duration: style.animationDuration }
    })
    assert.equal(reduced.name, "none", "the packed dialog must drop its motion under reduce")
    assert.equal(reduced.duration, "0s", "and must not wait out a duration")

    // Crossing the breakpoint keeps one tree: the draft, the file control, and
    // the footer stay where the consumer put them.
    await profileDialog.getByLabel("Draft", { exact: true }).fill("kept draft")
    await page.setViewportSize({ width: 390, height: 844 })
    assert.equal(await profileDialog.evaluate((element) => element.getBoundingClientRect().right <= innerWidth), true,
      "a narrow dialog must remain inside the viewport")
    await page.setViewportSize({ width: 1280, height: 900 })
    assert.equal(await profileDialog.getByLabel("Draft", { exact: true }).inputValue(), "kept draft",
      "the draft must survive a breakpoint change")
    assert.equal(await page.locator("#dialog-file").count(), 1, "the file control must be the same one")

    // A real outside click is a trusted pointer sequence closing the dialog, and
    // focus must come back to the trigger that opened it.
    const box = await profileDialog.boundingBox()
    await page.mouse.click(Math.max(4, Math.round(box.x) - 12), 4)
    await profileDialog.waitFor({ state: "hidden" })
    await page.waitForFunction(() => document.activeElement?.textContent === "Open profile")

    // Public Toaster and toast must share the packed package's Sonner instance.
    await page.getByRole("button", { name: "Notify", exact: true }).click()
    await page.locator("[data-sonner-toast]").getByText("Packed message ready", { exact: true })
      .waitFor({ state: "visible" })
    const activeToast = page.locator('[data-sonner-toast]:not([data-removed="true"])')
    await page.getByRole("button", { name: "Start loading" }).click()
    const loadingToast = activeToast.filter({ hasText: "Upload starting" })
    await loadingToast.waitFor({ state: "visible" })
    const loadingNode = await loadingToast.elementHandle()
    for (const [button, message] of [
      ["Progress 30%", "Upload 30%"],
      ["Progress 70%", "Upload 70%"],
      ["Complete loading", "Upload complete"],
    ]) {
      await page.getByRole("button", { name: button }).click()
      const updated = activeToast.filter({ hasText: message })
      await updated.waitFor({ state: "visible" })
      assert.equal(await updated.evaluate((element, previous) => element === previous, loadingNode), true,
        `${message} must update the same toast DOM node`)
    }
    await page.getByRole("button", { name: "Start loading" }).click()
    await activeToast.filter({ hasText: "Upload starting" }).waitFor({ state: "visible" })
    await page.getByRole("button", { name: "Progress 30%" }).click()
    await activeToast.filter({ hasText: "Upload 30%" }).waitFor({ state: "visible" })
    await page.getByRole("button", { name: "Fail loading" }).click()
    await activeToast.filter({ hasText: "Upload failed" }).waitFor({ state: "visible" })
    await page.getByRole("button", { name: "Start loading" }).click()
    await activeToast.filter({ hasText: "Upload starting" }).waitFor({ state: "visible" })
    await page.getByRole("button", { name: "Dismiss loading" }).click()
    await activeToast.filter({ hasText: "Upload starting" }).waitFor({ state: "hidden" })

    await page.getByRole("button", { name: "Start promise" }).click()
    await activeToast.filter({ hasText: "Promise working" }).waitFor({ state: "visible" })
    await page.getByRole("button", { name: "Resolve promise" }).click()
    await activeToast.filter({ hasText: "Promise resolved: done" }).waitFor({ state: "visible" })
    await page.getByRole("button", { name: "Start promise" }).click()
    await activeToast.filter({ hasText: "Promise working" }).waitFor({ state: "visible" })
    await page.getByRole("button", { name: "Reject promise" }).click()
    await activeToast.filter({ hasText: "Promise rejected: failed" }).waitFor({ state: "visible" })

    // The packed tarball has to ship the material itself: the seed's filter, the
    // class entry point on an element that is not an ExUI component, the prop
    // entry point, and the danger material. Only computed styles are read here;
    // this does not judge how the refraction renders.
    const seedFilter = page.locator("[data-slot='glass-seed'] filter")
    assert.equal(await seedFilter.count(), 1, "the packed seed must declare exactly one filter")
    assert.equal(
      await seedFilter.getAttribute("id"),
      "exui-glass-distortion-v1",
      "the packed seed must keep the documented filter id"
    )

    const classSurface = page.locator("[data-testid='glass-class-surface']")
    const classSurfaceStyle = await classSurface.evaluate((element) => {
      const style = getComputedStyle(element)
      return { background: style.backgroundColor, backdrop: style.backdropFilter, borderRadius: style.borderRadius }
    })
    assert.match(classSurfaceStyle.backdrop, /blur\(/, "a plain element using the class must take the material")
    assert.notEqual(classSurfaceStyle.background, "rgba(0, 0, 0, 0)", "the material must paint a background")
    assert.equal(await page.evaluate(() => document.documentElement.style.getPropertyValue("--_exui-glass-reference")),
      'url("#exui-glass-distortion-v1")',
      "a mounted seed must publish the filter reference on the document root")
    assert.match(classSurfaceStyle.backdrop, /url\(/, "a mounted seed must reach the material's chain")
    assert.equal(
      await classSurface.evaluate((element) => getComputedStyle(element).borderTopWidth),
      "0px",
      "the material's edge must not become a border width"
    )

    const dangerButton = page.getByRole("button", { name: "Delete", exact: true })
    const dangerBackground = await dangerButton.evaluate((element) => getComputedStyle(element).backgroundColor)
    const dangerChannels = (dangerBackground.match(/[\d.]+/g) ?? []).map(Number)
    assert.ok(
      dangerChannels[0] > dangerChannels[1] && dangerBackground.includes("0.9"),
      `the danger surface must keep the danger material instead of the neutral one: ${dangerBackground}`
    )

    assert.equal(await page.locator("[glass]").count(), 0, "the glass prop must never reach the DOM as an attribute")

    // The packed stylesheet must follow the application root font size with no
    // extra consumer configuration, and it must not fight an application that
    // sets one of its own.
    const setRootFontSize = (value) =>
      page.evaluate((fontSize) => {
        document.documentElement.style.fontSize = fontSize
      }, value)
    const measure = (locator, property) =>
      locator.evaluate((element, name) => {
        const style = getComputedStyle(element)
        return {
          value: Number.parseFloat(style.getPropertyValue(name)),
          rootFontSize: Number.parseFloat(getComputedStyle(document.documentElement).fontSize),
        }
      }, property)
    const closeEnough = (actual, expected, label) => {
      assert.ok(
        Math.abs(actual - expected) <= 0.5,
        `${label}: expected about ${expected}px, received ${actual}px`
      )
    }
    // Buttons use `transition-all`, so a root font size change animates the
    // geometry. Wait for the transition to settle before measuring.
    const settle = (selector, property, expected) =>
      page.waitForFunction(
        ({ selector: target, property: cssProperty, expected: value }) => {
          const element = document.querySelector(target)
          if (!element) {
            return false
          }
          const actual = Number.parseFloat(getComputedStyle(element).getPropertyValue(cssProperty))
          return Number.isFinite(actual) && Math.abs(actual - value) <= 0.5
        },
        { selector, property, expected }
      )
    const triggerSelector = "[aria-haspopup='dialog']"

    await setRootFontSize("16px")
    try {
      await settle(triggerSelector, "height", 36)
      const base = await measure(trigger, "height")
      assert.equal(base.rootFontSize, 16, "the application root font size must remain 16px")
      closeEnough(base.value, 36, "the default Button height at a 16px root font size")

      await setRootFontSize("32px")
      await settle(triggerSelector, "height", 72)
      await settle(triggerSelector, "font-size", 28)
      const doubled = await measure(trigger, "height")
      assert.equal(doubled.rootFontSize, 32, "the application root font size must reach 32px")
      closeEnough(doubled.value, 72, "the default Button height at a 32px root font size")
      closeEnough(
        (await measure(trigger, "font-size")).value,
        28,
        "the default Button font size at a 32px root font size"
      )
      closeEnough(
        (await measure(trigger, "border-top-width")).value,
        1,
        "the default Button hairline border at a 32px root font size"
      )
      closeEnough(
        (await measure(trigger, "border-radius")).value,
        9999,
        "the default Button capsule radius at a 32px root font size"
      )

      await trigger.click()
      const scaledDialog = page.getByRole("dialog", { name: "Subscribe" })
      await scaledDialog.waitFor({ state: "visible" })
      await page.waitForFunction(() => {
        const element = document.querySelector("[data-slot='dialog-content']")
        if (!element) {
          return false
        }
        return Math.abs(Number.parseFloat(getComputedStyle(element).paddingTop) - 32) <= 0.5
      })
      const scaledPadding = await measure(scaledDialog, "padding-top")
      closeEnough(scaledPadding.value, 32, "the portal Dialog padding at a 32px root font size")
      await page.keyboard.press("Escape")
      await scaledDialog.waitFor({ state: "hidden" })
    } finally {
      await setRootFontSize("16px")
    }

    await settle(triggerSelector, "height", 36)
    const restored = await measure(trigger, "height")
    closeEnough(restored.value, 36, "the default Button height after restoring the root font size")

    // Motion preference is a browser setting, so the normal path needs its own context.
    const motionPage = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "no-preference" })
    const motionErrors = []
    motionPage.on("pageerror", (error) => motionErrors.push(error.message))
    try {
      await motionPage.goto(server.resolvedUrls.local[0])
      await motionPage.getByRole("button", { name: "Open profile", exact: true }).click()
      const motionDialog = motionPage.getByRole("dialog", { name: "Project profile" })
      await motionDialog.waitFor({ state: "visible" })
      assert.equal(await motionDialog.evaluate((element) => getComputedStyle(element).animationName), "enter",
        "the composed Dialog must use the upstream enter animation")
      await motionPage.keyboard.press("Escape")
      await motionDialog.waitFor({ state: "hidden" })

      assert.deepEqual(motionErrors, [], "packed consumer must not raise browser runtime errors with motion enabled")
    } finally {
      await motionPage.close()
    }

    assert.deepEqual(pageErrors, [], "packed consumer must not raise browser runtime errors")
    console.log("Packed browser consumer passed: chart hover/legend, composed Dialog portal, form submission, focus return, managed notification, glass material, rem scaling, density inheritance, Rating keyboard access, motion")
  } finally {
    try {
      await browser?.close()
    } finally {
      await new Promise((resolve, reject) => server.httpServer.close((error) => error ? reject(error) : resolve()))
    }
  }
}

assert.equal(process.argv.length, 3, "usage: node packages/components/tests/consumers/verify-react-browser.mjs <consumer-directory>")
await verifyReactBrowser(process.argv[2])
