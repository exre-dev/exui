"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon, ClipboardCheckIcon, ListChecksIcon, ScrollTextIcon, WorkflowIcon } from "lucide-react"

import { useRef, useState } from "react"
import { Frame, FramePanel } from "@exre/exui"
import { IconTile } from "@exre/exui"
import { StepperDescription, StepperIndicator, StepperItem, StepperNav, StepperPanel, StepperTitle } from "@exre/exui"
import { ExampleStepper as Stepper, ExampleStepperContent as StepperContent, ExampleStepperTrigger as StepperTrigger } from "../_shared/stepper-runtime"

import { Button } from "@exre/exui"


const steps = [
  {
    title: "Choose Resolution",
    description: "Pick one of the resolution options",
    detail: "Comparing 3 fixes by risk and time to recover.",
    icon: (
      <ListChecksIcon  />
    ),
  },
  {
    title: "Execute Resolution",
    description: "Verify details and proceed",
    detail: "Rolling back api-gateway to v2.14.1 on 6 pods.",
    icon: (
      <WorkflowIcon  />
    ),
  },
  {
    title: "Verify Outcome",
    description: "Confirm the issue is resolved",
    detail: "Watching error rate and latency for 10 minutes.",
    icon: (
      <ClipboardCheckIcon  />
    ),
  },
  {
    title: "Resolution Summary",
    description: "View actions taken",
    detail: "Writing up the timeline and every action taken.",
    icon: (
      <ScrollTextIcon  />
    ),
  },
]

const completed = (
  <span className="border-success bg-success/10 text-success flex size-4 items-center justify-center rounded-full border">
    <CheckIcon className="size-3" aria-hidden="true" />
    <span className="sr-only">{<ExampleText>Completed</ExampleText>}</span>
  </span>
)

// A repeating conic mask cuts the ring into eleven dashes at the design's 3:1
// rhythm. The stroke overhangs the 14px box by half its width, so it centers
// on the box as the design's does. The spinner is a 139deg arc over it that
// holds still under reduced motion, where it reads as the design's static arc.
function Ring({ spin = false }: { spin?: boolean }) {
  return (
    <span className="relative block size-3.5">
      <span className="border-ring/50 absolute -inset-[0.8px] rounded-full border-[1.6px] mask-[repeating-conic-gradient(from_36deg,#000_0_calc(270deg/11),transparent_0_calc(360deg/11))]" />
      {<ExampleText>{spin && (
        <>
          <span className="absolute -inset-[0.8px] rounded-full border-[1.6px] border-blue-500 mask-[conic-gradient(from_-28deg,#000_139deg,transparent_0)] motion-safe:animate-spin" />
          <span className="sr-only">{<ExampleText>In progress</ExampleText>}</span>
        </>
      )}</ExampleText>}
    </span>
  )
}

const indicators = { completed, inactive: <Ring />, loading: <Ring spin /> }

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

  return (
    <Stepper
      value={current}
      onValueChange={setCurrent}
      orientation="vertical"
      indicators={indicators}
      className="max-w-115"
      aria-label={copyExample("Incident resolution")}
    >
      <div className="flex flex-col gap-6">
        <StepperNav className="w-full">
          {/* Each row is its own panel: stacked joins them into one list, ghost
              drops the outer border and xs spacing is the design's 8px row
              padding. */}
          <Frame variant="ghost" spacing="xs" stacked>
            {<ExampleText>{steps.map((item, index) => (
              // The trigger sits inside the padding, so the panel paints the
              // hover, selected and focus states for the whole row.
              <FramePanel
                key={item.title}
                className="hover:bg-muted has-data-[state=active]:bg-muted has-focus-visible:ring-ring/50 has-focus-visible:ring-3 has-focus-visible:ring-inset"
              >
                {/* The primitive shows loading on the active step only, so every
                    step carries the flag and the spinner follows the selection. */}
                <StepperItem step={index + 1} loading>
                  {/* Its after layer stretches over the panel, so the padding
                      takes the click too. */}
                  <StepperTrigger
                    tabIndex={
                      allDone && index + 1 === steps.length ? 0 : undefined
                    }
                    className="w-full gap-2 text-start after:absolute after:inset-0 focus-visible:ring-0"
                  >
                    {/* The frame tile's 1px border plus its 2px inset form the
                        3px ring. The border goes transparent so the ring reads
                        as one fill; the item's data-state picks the tone. */}
                    <IconTile
                      variant="frame"
                      size="sm"
                      className="bg-input/50 text-muted-foreground group-data-[state=active]/step:bg-input group-data-[state=completed]/step:bg-success/20 after:border-ring/30 after:bg-background group-data-[state=completed]/step:after:bg-success border-transparent [--icon-tile-icon-size:--spacing(3.5)] [--icon-tile-size:--spacing(8.5)] group-data-[state=active]/step:text-blue-500 group-data-[state=completed]/step:text-white after:shadow-sm group-data-[state=completed]/step:after:border-white/8"
                      aria-hidden="true"
                    >
                      {<ExampleText>{item.icon}</ExampleText>}
                    </IconTile>

                    {/* The 14px title, 4px gap and 16px subtitle add up to the
                        34px tile, so the text adds no height to the row. */}
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <StepperTitle>{<ExampleText>{item.title}</ExampleText>}</StepperTitle>
                      <StepperDescription className="text-xs">
                        {<ExampleText>{item.description}</ExampleText>}
                      </StepperDescription>
                    </div>

                    {/* 16px for the check and 14px for the rings, whose stroke
                        overhangs the box, so the indicator stops clipping. */}
                    <StepperIndicator className="size-3.5 overflow-visible bg-transparent data-[state=active]:bg-transparent data-[state=completed]:size-4 data-[state=completed]:bg-transparent" />
                  </StepperTrigger>
                </StepperItem>
              </FramePanel>
            ))}</ExampleText>}
          </Frame>
        </StepperNav>

        <div className="flex flex-col gap-3 text-start">
          <StepperPanel>
            {<ExampleText>{steps.map((item, index) => (
              <StepperContent key={item.title} value={index + 1}>
                <p className="text-muted-foreground text-xs">
                  {<ExampleText>Step </ExampleText>}{<ExampleText>{index + 1}</ExampleText>} {<ExampleText> of </ExampleText>}{<ExampleText>{steps.length}</ExampleText>}
                </p>
                <p className="text-sm font-medium">{<ExampleText>{item.title}</ExampleText>}</p>
                <p className="text-muted-foreground text-sm">{<ExampleText>{item.detail}</ExampleText>}</p>
              </StepperContent>
            ))}</ExampleText>}
            <StepperContent value={steps.length + 1}>
              <p className="text-muted-foreground text-xs">
                {<ExampleText>All </ExampleText>}{<ExampleText>{steps.length}</ExampleText>} {<ExampleText> steps done </ExampleText>}</p>
              <p className="text-sm font-medium">{<ExampleText>Incident resolved</ExampleText>}</p>
              <p className="text-muted-foreground text-sm">
                {<ExampleText>Every step is complete and the case can close. </ExampleText>}</p>
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
