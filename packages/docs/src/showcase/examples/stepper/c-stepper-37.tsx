"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon, ClipboardCheckIcon, ListChecksIcon, ScrollTextIcon, WorkflowIcon } from "lucide-react"

import { useRef, useState } from "react"
import { Frame, FramePanel } from "@exre/exui"
import { IconTile } from "@exre/exui"
import { StepperDescription, StepperIndicator, StepperItem, StepperNav, StepperPanel, StepperTitle } from "@exre/exui"
import { ExampleStepper as Stepper, ExampleStepperContent as StepperContent, ExampleStepperTrigger as StepperTrigger } from "../_shared/stepper-runtime"
import { cn } from "@exre/exui"

import { Button } from "@exre/exui"


const steps = [
  {
    title: "Resolution",
    detail: "Choose a fix: roll back, scale out or patch forward.",
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
    detail: "Record the timeline, root cause and follow-ups.",
    icon: (
      <ScrollTextIcon  />
    ),
  },
]

const completed = (
  <CheckIcon className="size-2.5" aria-hidden="true" />
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
    // The pressed button disables itself at either end, so focus moves to its partner.
    if (step === 1) nextRef.current?.focus()
    if (step > steps.length) prevRef.current?.focus()
  }

  return (
    <Stepper
      value={current}
      onValueChange={setCurrent}
      indicators={{ completed }}
      className="@container flex max-w-150 flex-col gap-6 pt-2"
      aria-label={copyExample("Incident resolution")}
    >
      {/* The frame paints nothing: it only lends each card its per-style
          radius, padding, border and surface. The default variant, not ghost,
          so vega and nova cards round at the drawn 10px rather than 11px. */}
      <Frame spacing="xs" className="border-0 bg-transparent p-0">
        {/* Two columns below 36rem, where four would cut the titles short. */}
        <StepperNav className="grid grid-cols-2 gap-2 @xl:grid-cols-4">
          {<ExampleText>{steps.map((item, index) => {
            const step = index + 1
            const done = step < current

            return (
              <StepperItem key={item.title} step={step} className="isolate">
                {/* The card is the tab itself, so all of it takes the click
                    and the focus ring. The radius undoes the trigger's pill.
                    The done tint is a 5% layer over the card's own surface,
                    as drawn: an sRGB color-mix would carry the success
                    color's out-of-gamut red into the result. */}
                <StepperTrigger
                  tabIndex={allDone && step === steps.length ? 0 : undefined}
                  asChild
                  className="hover:border-ring/60 data-[state=active]:border-ring/50 data-[state=active]:bg-input/20 data-[state=completed]:border-success data-[state=completed]:from-success/5 data-[state=completed]:to-success/5 min-w-0 gap-2 overflow-visible rounded-(--frame-panel-radius) px-2.5 shadow-none data-[state=completed]:bg-linear-to-b"
                >
                  <FramePanel>
                    {/* outline's dark:bg-input/32 would outrank a state class
                        in dark mode, so a done step swaps to the solid
                        variant. Its white edge is drawn outside the fill,
                        hence a ring. */}
                    <IconTile
                      variant={done ? "solid" : "outline"}
                      size="xs"
                      className={cn(
                        "shadow-xs [--icon-tile-size:--spacing(7)]",
                        done
                          ? "bg-success text-white ring-1 ring-white/15"
                          : "border-ring/30"
                      )}
                      aria-hidden="true"
                    >
                      {<ExampleText>{item.icon}</ExampleText>}
                    </IconTile>

                    {/* leading-5 is text-sm's own line height: truncate clips
                        at the line box, so the title's default leading-none
                        would cut the descenders of Verify and Summary. */}
                    <div className="flex min-w-0 flex-col">
                      <StepperTitle className="data-[state=completed]:text-success-foreground dark:data-[state=completed]:text-success truncate leading-5">
                        {<ExampleText>{item.title}</ExampleText>}
                      </StepperTitle>
                      <StepperDescription className="truncate text-xs">
                        {<ExampleText>Step </ExampleText>}{<ExampleText>{step}</ExampleText>}
                      </StepperDescription>
                      {<ExampleText>{done && <span className="sr-only">{<ExampleText>, completed</ExampleText>}</span>}</ExampleText>}
                    </div>

                    {/* A child of the card so the check takes the click too:
                        half of it lies past the corner arc, where a rounded
                        box takes no pointer hits, hence overflow-visible
                        (min-w-0 keeps the titles truncating). Centered 0.4r
                        in from the edge and 1px above the arc (0.2r down
                        there): 3px out and 6px up at the drawn 10px, less the
                        1px border the offsets start inside; max() floors the
                        square styles at 0. The stepper's pt-2 keeps the first
                        row's check off any clipping parent, and the item's
                        isolate keeps a focused card's z-10 off the host
                        page. */}
                    <StepperIndicator className="data-[state=completed]:bg-success absolute end-[calc(max(0px,var(--frame-panel-radius))*0.4-8px)] top-[calc(max(0px,var(--frame-panel-radius))*0.2-9px)] size-3.5 shadow-sm ring-1 ring-white/8 not-data-[state=completed]:hidden data-[state=completed]:text-white" />
                  </FramePanel>
                </StepperTrigger>
              </StepperItem>
            )
          })}</ExampleText>}
        </StepperNav>
      </Frame>

      <StepperPanel className="text-center">
        {<ExampleText>{steps.map((item, index) => (
          <StepperContent key={item.title} value={index + 1}>
            <p className="text-sm font-medium">{<ExampleText>{item.title}</ExampleText>}</p>
            <p className="text-muted-foreground text-sm">{<ExampleText>{item.detail}</ExampleText>}</p>
          </StepperContent>
        ))}</ExampleText>}
        <StepperContent value={steps.length + 1}>
          <p className="text-sm font-medium">{<ExampleText>Incident resolved</ExampleText>}</p>
          <p className="text-muted-foreground text-sm">
            {<ExampleText>Every step is recorded and the incident closed. </ExampleText>}</p>
        </StepperContent>
        <div className="mt-3 flex justify-center gap-2">
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
      </StepperPanel>
    </Stepper>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
