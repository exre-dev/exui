"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon, ClipboardCheckIcon, ListChecksIcon, ScrollTextIcon, WorkflowIcon } from "lucide-react"

import { useId, useRef, useState } from "react"
import { Frame, FramePanel } from "@exre/exui"
import { IconTile } from "@exre/exui"
import { StepperDescription, StepperIndicator, StepperItem, StepperNav, StepperPanel, StepperTitle } from "@exre/exui"
import { ExampleStepper as Stepper, ExampleStepperContent as StepperContent, ExampleStepperTrigger as StepperTrigger } from "../_shared/stepper-runtime"
import { cn } from "@exre/exui"

import { Button } from "@exre/exui"
import { Separator } from "@exre/exui"


const steps = [
  {
    title: "Resolution",
    detail: "Choose between a rollback, a scale-out or a hotfix.",
    icon: (
      <ListChecksIcon  />
    ),
  },
  {
    title: "Execute",
    detail: "Roll api-gateway back to v2.14.1 across 6 pods.",
    icon: (
      <WorkflowIcon  />
    ),
  },
  {
    title: "Verify",
    detail: "Watch error rate and p95 latency for 10 minutes.",
    icon: (
      <ClipboardCheckIcon  />
    ),
  },
  {
    title: "Summary",
    detail: "Write up the timeline, root cause and follow-ups.",
    icon: (
      <ScrollTextIcon  />
    ),
  },
]

const completed = (
  <CheckIcon className="size-2.5" aria-hidden="true" />
)

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  // The primitive derives tab ids from the step number alone and points
  // aria-controls at a panel nothing renders, so both are scoped here.
  const id = useId()
  const panelId = `${id}-panel`
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

  return (
    <Stepper
      value={current}
      onValueChange={setCurrent}
      orientation="vertical"
      indicators={{ completed }}
      className="@container w-full max-w-xl pt-2"
      aria-label={copyExample("Incident resolution")}
    >
      {/* The cards keep their 240px beside the content. Under 28rem the
          content would get less than 176px, so it stacks below. */}
      <div className="flex flex-col gap-6 @md:flex-row @md:items-start">
        {/* The frame paints nothing and only lends each card its per-style
            radius, padding, border and surface. The default variant, not
            ghost, so vega and nova cards round at the drawn 10px, not 11px. */}
        <Frame
          spacing="xs"
          className="w-full max-w-60 shrink-0 border-0 bg-transparent p-0"
        >
          <StepperNav className="gap-2">
            {<ExampleText>{steps.map((item, index) => {
              const step = index + 1
              const done = step < current

              return (
                <ExampleRuntimeConsumer key={item.title} render={({id: exampleId}) => (<StepperItem
                  key={item.title}
                  step={step}
                  className="relative isolate"
                >
                  {/* The card is the tab itself, so all of it takes the click
                      and the focus ring. The radius undoes the trigger's pill.
                      The done tint is a 5% layer over the opaque card color,
                      stacked as drawn, so nothing behind the card shows
                      through. The design draws no card shadow and no
                      current-step state, so border-ring marks the selected
                      card. */}
                  <StepperTrigger
                    tabIndex={allDone && step === steps.length ? 0 : undefined}
                    id={exampleId(`${id}-tab-${step}`)}
                    aria-controls={exampleId(panelId)}
                    asChild
                    className="hover:border-ring/60 data-[state=active]:border-ring/50 data-[state=active]:bg-input/20 data-[state=completed]:border-success data-[state=completed]:from-success/5 data-[state=completed]:to-success/5 w-full gap-2 rounded-(--frame-panel-radius) px-2.5 shadow-none data-[state=completed]:bg-linear-to-b"
                  >
                    <FramePanel>
                      {/* 28px sits between the xs and sm rungs, so xs keeps its
                          14px glyph and the size is set directly. outline's
                          dark:bg-input/32 would outrank a state class in dark
                          mode, so a done step swaps to the solid variant. */}
                      <IconTile
                        variant={done ? "solid" : "outline"}
                        size="xs"
                        className={cn(
                          "shadow-xs [--icon-tile-size:--spacing(7)]",
                          done
                            ? "bg-success border border-white/15 text-white"
                            : "border-ring/30"
                        )}
                        aria-hidden="true"
                      >
                        {<ExampleText>{item.icon}</ExampleText>}
                      </IconTile>

                      {/* leading-5 is text-sm's own line height. Under truncate the
                          default leading-none clips the y of Verify and Summary. */}
                      <div className="flex min-w-0 flex-col">
                        <StepperTitle className="data-[state=completed]:text-success-foreground dark:data-[state=completed]:text-success truncate leading-5">
                          {<ExampleText>{item.title}</ExampleText>}
                        </StepperTitle>
                        <StepperDescription className="truncate text-xs">
                          {<ExampleText>Step </ExampleText>}{<ExampleText>{step}</ExampleText>}
                        </StepperDescription>
                        {<ExampleText>{done && <span className="sr-only">{<ExampleText>, completed</ExampleText>}</span>}</ExampleText>}
                      </div>
                    </FramePanel>
                  </StepperTrigger>

                  {/* Sits on the item, clear of the panel's overflow clip, and
                      lets clicks through. Its center lands 0.4r in and 0.1r
                      down from the corner, just above the arc (0.2r down
                      there): 3px out and 6px up at the drawn 10px, on the
                      corner when square. max() floors the square styles'
                      radius, which the frame's math takes below 0. z-10 clears
                      a focused card, the item's isolate keeps it off the host
                      page, and the stepper's pt-2 makes room for the first
                      check. */}
                  <StepperIndicator className="data-[state=completed]:bg-success pointer-events-none absolute end-[calc(max(0px,var(--frame-panel-radius))*0.4-0.4375rem)] top-[calc(max(0px,var(--frame-panel-radius))*0.1-0.4375rem)] z-10 size-3.5 border border-white/8 shadow-sm not-data-[state=completed]:hidden data-[state=completed]:text-white" />
                </StepperItem>)} />
              )
            })}</ExampleText>}
          </StepperNav>
        </Frame>

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
              <ExampleRuntimeConsumer key={item.title} render={({id: exampleId}) => (<StepperContent key={item.title} value={index + 1} id={exampleId(panelId)} aria-labelledby={exampleId(`${id}-tab-${index + 1}`)}>
                <div >
                  <p className="text-sm font-medium">{<ExampleText>{item.title}</ExampleText>}</p>
                  <p className="text-muted-foreground text-sm">{<ExampleText>{item.detail}</ExampleText>}</p>
                </div>
              </StepperContent>)} />
            ))}</ExampleText>}
            <StepperContent value={steps.length + 1} id={exampleId(panelId)} aria-labelledby={undefined}>
              <div >
                <p className="text-sm font-medium">{<ExampleText>Incident resolved</ExampleText>}</p>
                <p className="text-muted-foreground text-sm">
                  {<ExampleText>Every step is done and the incident closed. </ExampleText>}</p>
              </div>
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
