"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon, CircleDashedIcon } from "lucide-react"

import { useRef, useState } from "react"
import { StepperIndicator, StepperItem, StepperNav, StepperPanel, StepperSeparator } from "@exre/exui"
import { ExampleStepper as Stepper, ExampleStepperContent as StepperContent, ExampleStepperTrigger as StepperTrigger } from "../_shared/stepper-runtime"
import { cn } from "@exre/exui"

import { Button } from "@exre/exui"


const steps = [
  { title: "Account", description: "Create your login" },
  { title: "Workspace", description: "Name your workspace" },
  { title: "Team", description: "Invite your teammates" },
  { title: "Billing", description: "Choose a plan" },
  { title: "Review", description: "Confirm and launch" },
]

function Pending() {
  return (
    <span className="bg-ring/80 flex size-3 items-center justify-center rounded-full text-white">
      <CircleDashedIcon className="size-2" aria-hidden="true" />
    </span>
  )
}

// The current step trades its solid ring for a dashed track with a 2px green
// arc spinning over it, inset so the arc stays inside the box and 1px clear
// of the dot. pathLength={44} counts the ring as 44 units, so the track closes
// in eleven 3+1 dashes at any size; only the arc moves.
function Current() {
  return (
    <span className="relative flex size-4 items-center justify-center">
      <svg
        viewBox="0 0 16 16"
        fill="none"
        strokeWidth="1"
        aria-hidden="true"
        className="absolute inset-0 size-full"
      >
        <circle
          cx="8"
          cy="8"
          r="7"
          pathLength={44}
          strokeDasharray="3 1"
          className="stroke-ring/50"
        />
        <circle
          cx="8"
          cy="8"
          r="7"
          pathLength={44}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="15 29"
          className="stroke-success origin-center motion-safe:animate-spin"
        />
      </svg>
      <span className="bg-ring/80 size-2.5 rounded-full" />
    </span>
  )
}

// The 16px ring keeps a transparent fill and the 12px dot inside it carries
// the state color, so the 1px gap between them shows whatever surface is behind.
const indicators = {
  completed: (
    <span className="bg-success flex size-3 items-center justify-center rounded-full text-white">
      <CheckIcon className="size-2.5" aria-hidden="true" />
    </span>
  ),
  inactive: <Pending />,
  loading: <Current />,
}

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [current, setCurrent] = useState(4)
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
      indicators={indicators}
      className="max-w-60 space-y-6"
      aria-label={copyExample("Workspace setup")}
    >
      <StepperNav>
        {<ExampleText>{steps.map((item, index) => {
          const step = index + 1

          // The primitive shows loading on the active step only, so every
          // step carries the flag, the spinner follows the selection and
          // `indicators` needs no `active` entry.
          return (
            <ExampleRuntimeConsumer key={item.title} render={({format: formatExample, copy: copyExample}) => (<StepperItem key={item.title} step={step} loading>
              {/* after: grows the 16px dot to a 24px hit area without
                  moving the connectors. */}
              <StepperTrigger
                tabIndex={allDone && step === steps.length ? 0 : undefined}
                aria-label={(formatExample("Step {step}: {title}", { step: step, title: copyExample(item.title) }))}
                className="relative after:absolute after:-inset-1"
              >
                <StepperIndicator className="border-ring/80 data-[state=completed]:border-success size-4 border bg-transparent data-[state=active]:border-0 data-[state=active]:bg-transparent data-[state=completed]:bg-transparent" />
              </StepperTrigger>

              {/* 3px dots spaced edge to edge by mask-repeat: space, so a
                  connector at least one tile wide never shows a clipped dot.
                  data-state greens the start once this step is done; the end
                  follows only when the next step is done too. */}
              {<ExampleText>{step < steps.length && (
                <StepperSeparator
                  className={cn(
                    "from-ring/80 to-ring/80 data-[state=completed]:from-success bg-transparent bg-linear-to-r to-70% mask-[radial-gradient(circle_closest-side,#000_90%,transparent)] mask-size-[0.375rem_0.1875rem] mask-repeat-space group-data-[orientation=horizontal]/stepper-nav:h-0.75 rtl:bg-linear-to-l",
                    step + 1 < current
                      ? "to-success"
                      : "data-[state=completed]:to-ring"
                  )}
                />
              )}</ExampleText>}
            </StepperItem>)} />
          )
        })}</ExampleText>}
      </StepperNav>

      <StepperPanel className="text-center">
        {<ExampleText>{steps.map((item, index) => (
          <StepperContent key={item.title} value={index + 1}>
            <p className="text-muted-foreground text-xs">
              {<ExampleText>Step </ExampleText>}{<ExampleText>{index + 1}</ExampleText>} {<ExampleText> of </ExampleText>}{<ExampleText>{steps.length}</ExampleText>}
            </p>
            <p className="text-sm font-medium">{<ExampleText>{item.title}</ExampleText>}</p>
            <p className="text-muted-foreground text-sm">{<ExampleText>{item.description}</ExampleText>}</p>
          </StepperContent>
        ))}</ExampleText>}
        <StepperContent value={steps.length + 1}>
          <p className="text-muted-foreground text-xs">
            {<ExampleText>All </ExampleText>}{<ExampleText>{steps.length}</ExampleText>} {<ExampleText> steps done </ExampleText>}</p>
          <p className="text-sm font-medium">{<ExampleText>Workspace ready</ExampleText>}</p>
          <p className="text-muted-foreground text-sm">
            {<ExampleText>Setup is complete and your team can sign in. </ExampleText>}</p>
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
