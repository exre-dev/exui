"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon, CheckSquareIcon, ClockCheckIcon, FileTextIcon, LightbulbIcon, TargetIcon, WorkflowIcon } from "lucide-react"

import { useRef, useState } from "react"
import { Frame, FramePanel } from "@exre/exui"
import { StepperIndicator, StepperItem, StepperNav, StepperPanel, StepperTitle } from "@exre/exui"
import { ExampleStepper as Stepper, ExampleStepperContent as StepperContent, ExampleStepperTrigger as StepperTrigger } from "../_shared/stepper-runtime"

import { Button } from "@exre/exui"
import { Separator } from "@exre/exui"


const steps = [
  {
    title: "Resolution",
    detail: "Pick the fix: roll api-gateway back to v2.14.1.",
    icon: (
      <LightbulbIcon className="size-3.5" aria-hidden="true" />
    ),
  },
  {
    title: "Scoping",
    detail: "Limit the change to 6 pods in eu-west-1.",
    icon: (
      <TargetIcon className="size-3.5" aria-hidden="true" />
    ),
  },
  {
    title: "Execution",
    detail: "Replace the pods one at a time.",
    icon: (
      <WorkflowIcon className="size-3.5" aria-hidden="true" />
    ),
  },
  {
    title: "Verification",
    detail: "Watch error rate and p95 latency for 10 min.",
    icon: (
      <CheckSquareIcon className="size-3.5" aria-hidden="true" />
    ),
  },
  {
    title: "Approval",
    detail: "The incident lead signs off on the fix.",
    icon: (
      <ClockCheckIcon className="size-3.5" aria-hidden="true" />
    ),
  },
  {
    title: "Summary",
    detail: "Record the root cause and follow-ups.",
    icon: (
      <FileTextIcon className="size-3.5" aria-hidden="true" />
    ),
  },
]

const completed = (
  <CheckIcon className="size-2.5" aria-hidden="true" />
)

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [current, setCurrent] = useState(3)
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

  return (
    <div className="@container mx-auto w-full max-w-lg">
      <Stepper
        value={current}
        onValueChange={setCurrent}
        orientation="vertical"
        indicators={{ completed }}
        className="flex flex-col gap-6 @md:flex-row @md:items-start"
        aria-label={copyExample("Incident workflow")}
      >
        {/* A bare frame that paints nothing: it only hands each row its
            per-style radius, padding and border color. 6px of block padding
            around the 20px text-sm line keeps the drawn 34px row. */}
        <Frame
          variant="ghost"
          spacing="xs"
          className="w-full max-w-45 shrink-0 bg-transparent p-0 [--frame-panel-py-base:--spacing(1.5)]"
        >
          <StepperNav className="gap-1.5">
            {<ExampleText>{steps.map((item, index) => {
              const step = index + 1

              // Every row is a panel whose border stays transparent until it
              // is active, so the selection moves without shifting a row, and
              // gap-1.5 absorbs that border to keep the design's row pitch.
              // 3px under the ghost panel radius lands on the drawn 8px. The
              // theme has no blue token, so the active row takes blue-500.
              return (
                <StepperItem key={item.title} step={step}>
                  <StepperTrigger
                    tabIndex={allDone && step === steps.length ? 0 : undefined}
                    asChild
                    className="text-muted-foreground hover:bg-muted/50 data-[state=active]:bg-muted/50 data-[state=completed]:text-foreground w-full gap-2 rounded-[calc(var(--frame-panel-radius)-3px)] border-transparent bg-transparent shadow-none data-[state=active]:border-(--frame-panel-border-color) data-[state=active]:text-blue-500"
                  >
                    <FramePanel>
                      {<ExampleText>{item.icon}</ExampleText>}
                      <StepperTitle className="min-w-0 flex-1 truncate leading-5">
                        {<ExampleText>{item.title}</ExampleText>}
                      </StepperTitle>
                      {<ExampleText>{step < current && (
                        <span className="sr-only">{<ExampleText>, completed</ExampleText>}</span>
                      )}</ExampleText>}
                      <StepperIndicator className="data-[state=completed]:bg-success size-3.5 not-data-[state=completed]:hidden data-[state=completed]:text-white" />
                      {<ExampleText>{step === current && (
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute start-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-e-full bg-blue-500"
                        />
                      )}</ExampleText>}
                    </FramePanel>
                  </StepperTrigger>
                </StepperItem>
              )
            })}</ExampleText>}
          </StepperNav>
        </Frame>

        {/* Stacked, 9px (a row's 1px border plus its 8px inline padding)
            lines the copy up with the step icons above it. */}
        {/* Decorative, so hidden from assistive tech: a line across while the
            columns stack, a line between them once they sit side by side. */}
        <Separator aria-hidden="true" className="@md:hidden" />
        <Separator
          aria-hidden="true"
          orientation="vertical"
          className="hidden @md:block"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-3 px-2.25 text-start @md:px-0">
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
              <p className="text-sm font-medium">{<ExampleText>Incident closed</ExampleText>}</p>
              <p className="text-muted-foreground text-sm text-pretty">
                {<ExampleText>Approved and summarized, with every step done. </ExampleText>}</p>
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
      </Stepper>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
