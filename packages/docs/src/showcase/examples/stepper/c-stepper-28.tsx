"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronRightIcon } from "lucide-react"

import { useId, useRef, useState } from "react"
import { StepperItem, StepperNav, StepperPanel, StepperTitle } from "@exre/exui"
import { ExampleStepper as Stepper, ExampleStepperContent as StepperContent, ExampleStepperTrigger as StepperTrigger } from "../_shared/stepper-runtime"
import { cn } from "@exre/exui"

import { Button } from "@exre/exui"


const steps = [
  {
    title: "Registration",
    summary: "Create your employee login and confirm your contact details.",
  },
  {
    title: "Paperwork",
    summary: "Sign your contract, tax forms and direct deposit details.",
  },
  {
    title: "Store Tour",
    summary: "Walk the floor, stockroom and break room with your manager.",
  },
  {
    title: "Job Training",
    summary: "Learn the register, returns and opening routine with a mentor.",
  },
  {
    title: "First Shift",
    summary: "Saturday from 9:00 AM to 3:00 PM, paired with your mentor.",
  },
]

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  const [current, setCurrent] = useState(4)
  const labelId = useId()
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
      className="@container max-w-200"
      aria-labelledby={exampleId(labelId)}
    >
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
        <p id={exampleId(labelId)} className="text-sm font-medium">
          {<ExampleText>Onboarding </ExampleText>}</p>

        {/* Under 48rem the steps drop to a row of their own and wrap there.
            From 48rem up they fill the space between the label and the
            counter and center in it, which is where justify-between would
            put them. The one-row header needs about 660px. */}
        <StepperNav className="order-last flex-wrap gap-y-2.5 @3xl:order-none @3xl:flex-1 @3xl:justify-center">
          {<ExampleText>{steps.map((item, index) => {
            const step = index + 1

            // The primitive grows every item but the last; these stay packed.
            return (
              <StepperItem
                key={item.title}
                step={step}
                className="not-last:flex-none"
              >
                {/* Margin and padding cancel out, so the text stays put while
                    the hit area grows to 24px and the focus ring gets room. */}
                <StepperTrigger
                  tabIndex={allDone && step === steps.length ? 0 : undefined}
                  className="-mx-1.5 -my-1.25 px-1.5 py-1.25"
                >
                  <StepperTitle className="text-muted-foreground data-[state=active]:text-foreground whitespace-nowrap">
                    {<ExampleText>{item.title}</ExampleText>}
                  </StepperTitle>
                  {<ExampleText>{step < current && (
                    <span className="sr-only">{<ExampleText>, completed</ExampleText>}</span>
                  )}</ExampleText>}
                </StepperTrigger>

                {<ExampleText>{step < steps.length && (
                  <ChevronRightIcon className="text-ring/50 group-data-[state=completed]/step:text-ring mx-1.5 size-3.5 rtl:rotate-180" aria-hidden="true" />
                )}</ExampleText>}
              </StepperItem>
            )
          })}</ExampleText>}
        </StepperNav>

        {/* Reads as "Step 4 of 5" to assistive tech. */}
        <p className="text-muted-foreground flex gap-1.5 text-xs whitespace-nowrap tabular-nums">
          <span>{<ExampleText>Step</ExampleText>}</span>
          <span>
            <span className="text-foreground">
              {<ExampleText>{Math.min(current, steps.length)}</ExampleText>}
            </span>{<ExampleText>{" "}</ExampleText>}
            <span aria-hidden="true">/</span>
            <span className="sr-only">{<ExampleText>of</ExampleText>}</span> {<ExampleText>{steps.length}</ExampleText>}
          </span>
        </p>
      </div>

      {/* The bar repeats the counter, so assistive tech skips it. */}
      <div aria-hidden="true" className="flex h-1 gap-1">
        {<ExampleText>{steps.map((item, index) => (
          <span
            key={item.title}
            className={cn(
              "flex-1 rounded-full",
              index < current ? "bg-foreground" : "bg-ring/20"
            )}
          />
        ))}</ExampleText>}
      </div>

      <StepperPanel className="mt-6 text-center">
        {<ExampleText>{steps.map((item, index) => (
          <StepperContent key={item.title} value={index + 1}>
            <p className="text-sm font-medium">{<ExampleText>{item.title}</ExampleText>}</p>
            <p className="text-muted-foreground text-sm">{<ExampleText>{item.summary}</ExampleText>}</p>
          </StepperContent>
        ))}</ExampleText>}
        <StepperContent value={steps.length + 1}>
          <p className="text-sm font-medium">{<ExampleText>Onboarding complete</ExampleText>}</p>
          <p className="text-muted-foreground text-sm">
            {<ExampleText>All </ExampleText>}{<ExampleText>{steps.length}</ExampleText>} {<ExampleText> steps are done, welcome to the team. </ExampleText>}</p>
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
