"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon } from "lucide-react"

import { useRef, useState } from "react"
import { StepperDescription, StepperIndicator, StepperItem, StepperNav, StepperPanel, StepperTitle } from "@exre/exui"
import { ExampleStepper as Stepper, ExampleStepperContent as StepperContent, ExampleStepperTrigger as StepperTrigger } from "../_shared/stepper-runtime"
import { cn } from "@exre/exui"

import { Button } from "@exre/exui"


const checkpoints = [
  {
    title: "Goods Loaded",
    time: "10:52AM",
    summary: "18 pallets scanned and sealed at the Rotterdam depot.",
  },
  {
    title: "Checkpoint 1",
    time: "11:09AM",
    summary: "Cleared the A15 weigh station, running on schedule.",
  },
  {
    title: "Checkpoint 2",
    time: "1:06PM",
    summary: "Crossed into Germany at Venlo, about an hour out.",
  },
  {
    title: "Delivery",
    time: "2:15PM",
    summary: "Dock 4 at the Duisburg warehouse, signature required.",
  },
]

// The design draws the 10px check with a 1.4px line: 3.36 on a 24-unit grid.
const completed = (
  <CheckIcon strokeWidth={3.36} className="size-2.5" aria-hidden="true" />
)

// pathLength counts the ring as 28 units, so the 3:1 dash pattern closes in
// seven even dashes instead of leaving a stub at the seam.
function DashedRing({ spin = false }: { spin?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={cn("size-4", spin && "motion-safe:animate-spin")}
    >
      <circle
        cx="8"
        cy="8"
        r="4.45"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeDasharray="3 1"
        pathLength={28}
      />
    </svg>
  )
}

const indicators = {
  completed,
  inactive: <DashedRing />,
  loading: <DashedRing spin />,
}

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [current, setCurrent] = useState(2)
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  // One past the last step marks every step complete. No tab is selected
  // then, so the last one keeps the tablist's tab stop.
  const allDone = current > checkpoints.length

  function goTo(step: number) {
    setCurrent(step)
    // The pressed button disables itself at either end, so focus moves to
    // its partner.
    if (step === 1) nextRef.current?.focus()
    if (step > checkpoints.length) prevRef.current?.focus()
  }

  return (
    <Stepper
      value={current}
      onValueChange={setCurrent}
      indicators={indicators}
      className="@container max-w-200"
      aria-label={copyExample("Shipment tracking")}
    >
      {/* Under 32rem the labels go screen-reader only and the row keeps its
          track, so any number of steps fits; the panel below names the
          current one. */}
      <StepperNav>
        {<ExampleText>{checkpoints.map((checkpoint, index) => {
          const step = index + 1

          // The primitive shows loading on the active checkpoint only, so
          // every checkpoint carries the flag and the spinner follows the
          // selection.
          return (
            <StepperItem
              key={checkpoint.title}
              step={step}
              loading
              className="min-w-0 flex-1 items-stretch"
            >
              {/* Triggers stretch to the tallest column and stack from the
                  top, so the track stays one line when a title wraps. */}
              <StepperTrigger
                tabIndex={
                  allDone && step === checkpoints.length ? 0 : undefined
                }
                className="w-full flex-col gap-4"
              >
                {/* A checkpoint not reached yet has no time: the dashes are
                    hidden so its tab reads as the title alone. */}
                <StepperDescription className="text-xs whitespace-nowrap @max-lg:sr-only">
                  {<ExampleText>{step <= current ? (
                    checkpoint.time
                  ) : (
                    <span aria-hidden="true">--</span>
                  )}</ExampleText>}
                </StepperDescription>

                {/* The track stops 3px short of the dot on each side, so the
                    cut shows whatever surface is behind it. The active slice
                    fills out to the column edges, so the first and last reach
                    the track's ends. */}
                <span className="flex h-1 w-full items-center gap-0.75">
                  <span className="bg-ring/20 flex h-full flex-1 group-first/step:rounded-s-full">
                    <span className="group-data-[state=active]/step:bg-foreground flex-1 rounded-s-full" />
                  </span>
                  <StepperIndicator className="bg-ring/20 text-ring data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=completed]:bg-ring/20 data-[state=completed]:text-ring size-4" />
                  <span className="bg-ring/20 flex h-full flex-1 group-last/step:rounded-e-full">
                    <span className="group-data-[state=active]/step:bg-foreground flex-1 rounded-e-full" />
                  </span>
                </span>

                <StepperTitle className="mx-1 data-[state=active]:font-semibold @max-lg:sr-only">
                  {<ExampleText>{checkpoint.title}</ExampleText>}
                </StepperTitle>
                {<ExampleText>{step < current && <span className="sr-only">{<ExampleText>, completed</ExampleText>}</span>}</ExampleText>}
                {<ExampleText>{step === current && (
                  <span className="sr-only">{<ExampleText>, in progress</ExampleText>}</span>
                )}</ExampleText>}
              </StepperTrigger>
            </StepperItem>
          )
        })}</ExampleText>}
      </StepperNav>

      <div className="mt-6 flex flex-col gap-3 text-center">
        <StepperPanel>
          {<ExampleText>{checkpoints.map((checkpoint, index) => (
            <StepperContent key={checkpoint.title} value={index + 1}>
              <p className="text-sm font-medium">{<ExampleText>{checkpoint.title}</ExampleText>}</p>
              <p className="text-muted-foreground text-sm">
                {<ExampleText>{checkpoint.summary}</ExampleText>}
              </p>
            </StepperContent>
          ))}</ExampleText>}
          <StepperContent value={checkpoints.length + 1}>
            <p className="text-sm font-medium">{<ExampleText>Delivered</ExampleText>}</p>
            <p className="text-muted-foreground text-sm">
              {<ExampleText>Signed for at dock 4 of the Duisburg warehouse. </ExampleText>}</p>
          </StepperContent>
        </StepperPanel>
        <div className="flex justify-center gap-2">
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
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
