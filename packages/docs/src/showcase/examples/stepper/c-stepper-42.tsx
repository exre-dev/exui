"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useRef, useState } from "react"
import { StepperDescription, StepperIndicator, StepperItem, StepperNav, StepperPanel, StepperTitle } from "@exre/exui"
import { ExampleStepper as Stepper, ExampleStepperContent as StepperContent, ExampleStepperTrigger as StepperTrigger } from "../_shared/stepper-runtime"

import { Button } from "@exre/exui"
import { Separator } from "@exre/exui"

const steps = [
  {
    title: "Resolution Planning",
    detail: "Hotfix chosen over a rollback, with an owner per service.",
  },
  {
    title: "Scope Alignment",
    detail: "Checkout and payments are in scope, search waits a sprint.",
  },
  {
    title: "Implementation",
    detail: "Rolling the patch out to 6 pods behind a feature flag.",
  },
  {
    title: "Outcome Verification",
    detail: "Watching error rate and p95 latency for 30 minutes.",
  },
  {
    title: "Final Summary",
    detail: "Root cause, timeline and follow-ups for the postmortem.",
  },
]

// The step in progress splits its 40px bar into four 8px dashes.
const active = (
  <span className="flex h-10 flex-col justify-between">
    {<ExampleText>{[1, 2, 3, 4].map((dash) => (
      <span key={dash} className="h-2 w-0.5 rounded-full bg-blue-500" />
    ))}</ExampleText>}
  </span>
)

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [current, setCurrent] = useState(2)
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  // One past the last step marks every step complete. No tab is selected
  // then, so the last one keeps the tablist's tab stop.
  const allDone = current > steps.length

  function goTo(step: number) {
    setCurrent(step)
    // The pressed button disables itself at either end, so focus moves to
    // its partner.
    if (step === 1) nextRef.current?.focus()
    if (step > steps.length) prevRef.current?.focus()
  }

  // Side by side from 28rem, which leaves 13rem beside the 13rem steps for
  // the text and the Previous and Next row. Below that both stack in the
  // same 13rem column.
  return (
    <Stepper
      value={current}
      onValueChange={setCurrent}
      orientation="vertical"
      indicators={{ active }}
      className="@container mx-auto max-w-lg"
      aria-label={copyExample("Incident resolution")}
    >
      <div className="mx-auto flex max-w-52 flex-col gap-6 @md:max-w-none @md:flex-row @md:items-start">
        <StepperNav className="w-full gap-3 @md:w-52 @md:shrink-0">
          {<ExampleText>{steps.map((item, index) => {
            const step = index + 1

            return (
              <StepperItem
                key={item.title}
                step={step}
                className="items-stretch"
              >
                {/* The whole row is the tab, while the focus ring moves onto
                    the label: a pill around the row would cut through the
                    bar. */}
                <StepperTrigger
                  tabIndex={allDone && step === steps.length ? 0 : undefined}
                  className="gap-1.5 focus-visible:ring-0"
                >
                  <StepperIndicator className="bg-input data-[state=completed]:bg-success h-10 w-0.5 data-[state=active]:bg-transparent" />

                  {/* 6px gap plus 10px padding make the drawn 16px, and the
                      padding keeps the ring's rounded ends clear of the
                      text. */}
                  <div className="ring-ring/50 flex min-w-0 flex-col justify-center self-stretch rounded-full px-2.5 text-start in-focus-visible:ring-3">
                    {/* truncate clips at the line box, so the title gets
                        text-sm's own 20px line back from leading-none, which
                        clips descenders. With the 16px caption: 36px of 40. */}
                    <StepperTitle className="data-[state=inactive]:text-muted-foreground truncate leading-5">
                      {<ExampleText>{item.title}</ExampleText>}
                    </StepperTitle>
                    <StepperDescription className="text-xs whitespace-nowrap">
                      {<ExampleText>Step </ExampleText>}{<ExampleText>{step}</ExampleText>}
                    </StepperDescription>
                    {/* Only the bar's color says a step is done, so screen
                        readers get it in words. */}
                    {<ExampleText>{step < current && (
                      <span className="sr-only">{<ExampleText>, completed</ExampleText>}</span>
                    )}</ExampleText>}
                  </div>
                </StepperTrigger>
              </StepperItem>
            )
          })}</ExampleText>}
        </StepperNav>

        {/* Decorative, so hidden from assistive tech: a line across while the
            columns stack, a line between them once they sit side by side. */}
        <Separator aria-hidden="true" className="@md:hidden" />
        <Separator
          aria-hidden="true"
          orientation="vertical"
          className="hidden @md:block"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-3 text-start">
          <StepperPanel>
            {<ExampleText>{steps.map((item, index) => (
              <StepperContent key={item.title} value={index + 1}>
                <p className="text-muted-foreground text-xs">
                  {<ExampleText>Step </ExampleText>}{<ExampleText>{index + 1}</ExampleText>} {<ExampleText> of </ExampleText>}{<ExampleText>{steps.length}</ExampleText>}
                </p>
                <p className="text-sm font-medium">{<ExampleText>{item.title}</ExampleText>}</p>
                <p className="text-muted-foreground text-sm text-pretty">
                  {<ExampleText>{item.detail}</ExampleText>}
                </p>
              </StepperContent>
            ))}</ExampleText>}
            <StepperContent value={steps.length + 1}>
              <p className="text-muted-foreground text-xs">
                {<ExampleText>All </ExampleText>}{<ExampleText>{steps.length}</ExampleText>} {<ExampleText> steps done </ExampleText>}</p>
              <p className="text-sm font-medium">{<ExampleText>Incident resolved</ExampleText>}</p>
              <p className="text-muted-foreground text-sm text-pretty">
                {<ExampleText>The final summary is shared and the incident closed. </ExampleText>}</p>
            </StepperContent>
          </StepperPanel>
          <div className="flex justify-start gap-2">
            <Button
              ref={prevRef}
              variant="outline"
              size="sm"
              disabled={current === 1}
              onClick={() => goTo(current - 1)}
            >
              {<ExampleText>Previous </ExampleText>}</Button>
            <Button
              ref={nextRef}
              variant="outline"
              size="sm"
              disabled={allDone}
              onClick={() => goTo(current + 1)}
            >
              {<ExampleText>Next </ExampleText>}</Button>
          </div>
        </div>
      </div>
    </Stepper>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
