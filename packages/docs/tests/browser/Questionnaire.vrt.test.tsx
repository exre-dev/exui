import "../../app/styles/docs.css"
import "../../src/showcase/ShowcaseStyles"
import {
  Button, Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle,
  Questionnaire, QuestionnaireActions, QuestionnaireItem, QuestionnaireNext,
  QuestionnairePrevious, QuestionnaireSkip, QuestionnaireSubmit, QuestionnaireTitle,
} from "@exre/exui"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { LanguageContext, type ShowcaseLanguage } from "../../src/showcase/language"
import { examples } from "../../src/showcase/examples/questionnaire/index.generated"

let container: HTMLDivElement
let root: Root
let previousClasses: string

beforeEach(() => {
  previousClasses = document.documentElement.className
  container = document.createElement("div")
  container.style.width = "min(calc(100vw - 4rem), 28rem)"
  document.body.append(container)
  root = createRoot(container)
})

afterEach(() => {
  root.unmount()
  container.remove()
  document.documentElement.className = previousClasses
})

function expectHeaderLayout(header: HTMLElement) {
  const title = header.querySelector<HTMLElement>('[data-slot="questionnaire-title"], [data-slot="card-title"]')!
  const description = header.querySelector<HTMLElement>('[data-slot="questionnaire-description"], [data-slot="card-description"]')!
  const titleBox = title.getBoundingClientRect()
  const descriptionBox = description.getBoundingClientRect()
  expect(titleBox.width).toBeGreaterThan(0)
  expect(Math.abs(descriptionBox.left - titleBox.left)).toBeLessThan(1)
  expect(descriptionBox.top).toBeGreaterThanOrEqual(titleBox.bottom)
  expect(descriptionBox.right).toBeLessThanOrEqual(header.getBoundingClientRect().right)

  const action = header.querySelector<HTMLElement>('[data-slot="card-action"]')
  if (action) {
    const actionBox = action.getBoundingClientRect()
    expect(Math.abs(actionBox.top - titleBox.top)).toBeLessThan(1)
    expect(actionBox.left).toBeGreaterThan(titleBox.right)
    expect(actionBox.left).toBeGreaterThan(descriptionBox.right)
    expect(actionBox.right).toBeLessThanOrEqual(header.getBoundingClientRect().right)
  }
}

describe("Questionnaire card headers with docs utility layers", () => {
  for (const language of ["en", "zh-CN"] satisfies ShowcaseLanguage[]) {
    for (const theme of ["light", "dark", "pitch-black"]) {
      for (const density of ["standard", "compact"]) {
        it(`stacks titles and descriptions beside progress in ${language}, ${theme}, ${density}`, async () => {
          document.documentElement.className = theme === "light" ? "" : `dark ${theme === "pitch-black" ? "pitch-black" : ""}`
          container.className = density === "compact" ? "density-compact" : ""
          root.render(
            <LanguageContext.Provider value={{ language, setLanguage: () => {} }}>
              {examples.map(({ id, Component }) => <div key={id} data-example={id}><Component /></div>)}
              <Card>
                <CardHeader>
                  <CardTitle>Workspace</CardTitle>
                  <CardDescription>Manage your workspace settings.</CardDescription>
                  <CardAction>Settings</CardAction>
                </CardHeader>
              </Card>
            </LanguageContext.Provider>
          )
          await expect.poll(() => container.querySelectorAll('[data-slot="questionnaire"]').length).toBe(7)
          await document.fonts.ready

          const visibleHeaders = Array.from(container.querySelectorAll<HTMLElement>('[data-slot="card-header"]'))
            .filter(header => header.getBoundingClientRect().width > 0)
          expect(visibleHeaders).toHaveLength(6)
          for (const header of visibleHeaders) expectHeaderLayout(header)

          const questionnaire = container.querySelector<HTMLElement>('[data-example="c-questionnaire-1"] [data-slot="questionnaire"]')!
          for (const step of [1, 2, 3]) {
            const item = Array.from(questionnaire.querySelectorAll<HTMLElement>('[data-slot="questionnaire-item"]'))
              .find(element => element.getBoundingClientRect().width > 0)!
            // Exercise the next step through real controls, so hidden headers
            // cannot make the geometry assertions pass with zero-sized boxes.
            expect(questionnaire.querySelector('[data-slot="questionnaire-progress"]')?.getAttribute("aria-valuenow")).toBe(String(step))
            expectHeaderLayout(item.querySelector<HTMLElement>('[data-slot="card-header"]')!)
            if (step === 3) break
            await page.elementLocator(item.querySelector<HTMLElement>('[data-slot="questionnaire-choice"]')!).click()
            await page.elementLocator(questionnaire.querySelector<HTMLElement>('[data-slot="questionnaire-next"]')!).click()
            await expect.poll(() => item.getBoundingClientRect().width).toBe(0)
          }
        })
      }
    }
  }
})

describe("Questionnaire selected choice indicators", () => {
  for (const theme of ["light", "dark", "pitch-black"]) {
    for (const density of ["standard", "compact"]) {
      for (const [id, type, visibleSlot, hiddenSlot] of [
        ["c-questionnaire-2", "checkbox", "check", "dot"],
        ["c-questionnaire-3", "radio", "dot", "check"],
      ] as const) {
        it(`shows the ${type} selection mark in ${theme}, ${density}`, async () => {
          document.documentElement.className = theme === "light" ? "" : `dark ${theme === "pitch-black" ? "pitch-black" : ""}`
          container.className = density === "compact" ? "density-compact" : ""
          const Example = examples.find(example => example.id === id)!.Component
          root.render(<LanguageContext.Provider value={{ language: "zh-CN", setLanguage: () => {} }}><Example /></LanguageContext.Provider>)
          await expect.poll(() => container.querySelector('[data-slot="questionnaire-choice"]')).not.toBeNull()
          await document.fonts.ready
          const choices = Array.from(container.querySelectorAll<HTMLElement>('[data-slot="questionnaire-choice"]'))
            .filter(choice => choice.getBoundingClientRect().width > 0)
          const first = choices[0]
          const input = first.querySelector<HTMLInputElement>("input")!
          const visible = first.querySelector<HTMLElement>(`[data-slot="questionnaire-choice-indicator-${visibleSlot}"]`)!
          const hidden = first.querySelector<HTMLElement>(`[data-slot="questionnaire-choice-indicator-${hiddenSlot}"]`)!
          expect(input.checked).toBe(false)
          expect(getComputedStyle(visible).display).toBe("none")
          expect(getComputedStyle(hidden).display).toBe("none")

          await page.elementLocator(first).click()
          await expect.poll(() => input.checked).toBe(true)
          expect(first.hasAttribute("data-checked")).toBe(true)
          expect(getComputedStyle(visible).display).not.toBe("none")
          expect(visible.getBoundingClientRect().width).toBeGreaterThan(0)
          expect(visible.getBoundingClientRect().height).toBeGreaterThan(0)
          expect(getComputedStyle(hidden).display).toBe("none")
          const indicator = first.querySelector<HTMLElement>('[data-slot="questionnaire-choice-indicator"]')!
          expect(visible.getBoundingClientRect().width).toBeLessThanOrEqual(indicator.getBoundingClientRect().width)
          expect(visible.getBoundingClientRect().height).toBeLessThanOrEqual(indicator.getBoundingClientRect().height)
          expect(type === "checkbox" ? getComputedStyle(visible).color : getComputedStyle(visible).backgroundColor)
            .not.toBe(getComputedStyle(indicator).backgroundColor)

          await page.elementLocator(type === "checkbox" ? first : choices[1]).click()
          await expect.poll(() => input.checked).toBe(false)
          expect(getComputedStyle(visible).display).toBe("none")
          expect(getComputedStyle(hidden).display).toBe("none")
          if (type === "radio") {
            expect(getComputedStyle(choices[1].querySelector('[data-slot="questionnaire-choice-indicator-dot"]')!).display).not.toBe("none")
            expect(getComputedStyle(choices[1].querySelector('[data-slot="questionnaire-choice-indicator-check"]')!).display).toBe("none")
          }
        })
      }
    }
  }
})

describe("Questionnaire action button heights", () => {
  for (const density of ["standard", "compact"]) {
    for (const size of ["xs", "sm", "default", "lg"] as const) {
      it(`uses shared Button sizing in ${density}, ${size}`, async () => {
        container.className = density === "compact" ? "density-compact" : ""
        root.render(<>
          <Button size={size}>Reference</Button>
          <Questionnaire defaultItem="first" items={[{ name: "first" }, { name: "middle" }, { name: "last" }]}>
            <Card>
              {(["first", "middle", "last"] as const).map(name => (
                <QuestionnaireItem key={name} name={name}>
                  <QuestionnaireTitle>{name}</QuestionnaireTitle>
                </QuestionnaireItem>
              ))}
              <CardFooter>
                <QuestionnaireActions className="w-full">
                  <QuestionnairePrevious size={size} />
                  <QuestionnaireSkip size={size} />
                  <QuestionnaireNext size={size} />
                  <QuestionnaireSubmit size={size} />
                </QuestionnaireActions>
              </CardFooter>
            </Card>
          </Questionnaire>
        </>)
        await expect.poll(() => container.querySelector('[data-slot="questionnaire-next"]')).not.toBeNull()
        await document.fonts.ready
        const reference = container.querySelector<HTMLElement>('[data-slot="button"]')!
        const expectedHeight = reference.getBoundingClientRect().height
        const seen = new Set<string>()
        for (const step of [1, 2, 3]) {
          const actions = Array.from(container.querySelectorAll<HTMLButtonElement>('[data-slot="questionnaire-actions"] button'))
            .filter(button => button.getBoundingClientRect().height > 0)
          for (const button of actions) {
            seen.add(button.dataset.slot!)
            expect(button.getBoundingClientRect().height).toBeCloseTo(expectedHeight, 1)
          }
          if (step === 3) break
          await page.elementLocator(container.querySelector<HTMLElement>('[data-slot="questionnaire-skip"]')!).click()
          await expect.poll(() => container.querySelectorAll<HTMLElement>('[data-slot="questionnaire-item"]')[step].getBoundingClientRect().height).toBeGreaterThan(0)
        }
        expect([...seen].sort()).toEqual(["questionnaire-next", "questionnaire-previous", "questionnaire-skip", "questionnaire-submit"])
      })
    }
  }
})

describe("Questionnaire answer control heights", () => {
  for (const language of ["en", "zh-CN"] satisfies ShowcaseLanguage[]) {
    for (const density of ["standard", "compact"]) {
      it(`keeps write-in answers and single-line choices compact in ${language}, ${density}`, async () => {
        container.className = density === "compact" ? "density-compact" : ""
        const Example = examples.find(example => example.id === "c-questionnaire-3")!.Component
        root.render(<LanguageContext.Provider value={{ language, setLanguage: () => {} }}><Example /></LanguageContext.Provider>)
        await expect.poll(() => container.querySelector('[data-slot="questionnaire-input"]')).not.toBeNull()
        await document.fonts.ready

        const input = container.querySelector<HTMLInputElement>('[data-slot="questionnaire-input"]')!
        const choices = Array.from(container.querySelectorAll<HTMLElement>('[data-slot="questionnaire-choice"]'))
          .filter(choice => choice.getBoundingClientRect().height > 0)
        expect(choices).toHaveLength(4)
        if (window.innerWidth < 640) {
          expect(input.getBoundingClientRect().height).toBeGreaterThanOrEqual(44)
          for (const choice of choices) expect(choice.getBoundingClientRect().height).toBeGreaterThanOrEqual(44)
        } else {
          expect(input.getBoundingClientRect().height).toBeCloseTo(36, 1)
          for (const choice of choices) {
            expect(choice.getBoundingClientRect().height).toBeGreaterThanOrEqual(36)
            expect(choice.getBoundingClientRect().height).toBeLessThan(40)
          }
        }

        await page.elementLocator(choices[0]).click()
        const radio = choices[0].querySelector<HTMLInputElement>("input")!
        await expect.poll(() => radio.checked).toBe(true)
        await page.elementLocator(input).fill("A different source")
        await expect.poll(() => radio.checked).toBe(false)
        expect(input.value).toBe("A different source")
      })

      it(`allows choice descriptions to grow without clipping in ${language}, ${density}`, async () => {
        container.className = density === "compact" ? "density-compact" : ""
        container.style.width = "16rem"
        const Example = examples.find(example => example.id === "c-questionnaire-1")!.Component
        root.render(<LanguageContext.Provider value={{ language, setLanguage: () => {} }}><Example /></LanguageContext.Provider>)
        await expect.poll(() => container.querySelector('[data-slot="questionnaire-choice-description"]')).not.toBeNull()
        await document.fonts.ready

        const choices = Array.from(container.querySelectorAll<HTMLElement>('[data-slot="questionnaire-choice"]'))
          .filter(choice => choice.getBoundingClientRect().height > 0)
        expect(choices.length).toBeGreaterThan(0)
        for (const choice of choices) {
          const bounds = choice.getBoundingClientRect()
          const content = choice.querySelector<HTMLElement>('[data-slot="questionnaire-choice-label"]')!.getBoundingClientRect()
          const description = choice.querySelector<HTMLElement>('[data-slot="questionnaire-choice-description"]')!.getBoundingClientRect()
          expect(description.height).toBeGreaterThan(0)
          expect(content.top).toBeGreaterThan(bounds.top)
          expect(content.bottom).toBeLessThan(bounds.bottom)
          expect(content.right).toBeLessThan(bounds.right)
          expect(choice.scrollWidth).toBeLessThanOrEqual(choice.clientWidth)
          expect(choice.scrollHeight).toBeLessThanOrEqual(choice.clientHeight)
        }
      })
    }
  }
})
