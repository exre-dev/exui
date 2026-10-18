"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon, LoaderCircleIcon } from "lucide-react"

import { StepperIndicator, StepperItem, StepperNav, StepperPanel, StepperSeparator } from "@exre/exui"
import { ExampleStepper as Stepper, ExampleStepperContent as StepperContent, ExampleStepperTrigger as StepperTrigger } from "../_shared/stepper-runtime"



const steps = [1, 2, 3]

  function OriginalPattern() {
  return (
    <Stepper
      className="w-full max-w-md"
      defaultValue={2}
      indicators={{
        completed: (
          <CheckIcon className="size-3.5" />
        ),
        loading: (
          <LoaderCircleIcon className="size-3.5 animate-spin" />
        ),
      }}
    >
      <StepperNav className="mb-5">
        {<ExampleText>{steps.map((step) => (
          <StepperItem key={step} step={step} loading={step === 2}>
            <StepperTrigger>
              <StepperIndicator className="data-[state=active]:text-primary-foreground data-[state=active]:bg-primary data-[state=active]:border-primary data-[state=inactive]:border-muted size-5 border-2 data-[state=completed]:border-green-500 data-[state=completed]:bg-green-500 data-[state=completed]:text-white">
                <span className="bg-primary-foreground hidden size-1.5 rounded-full group-data-[state=active]/step:block"></span>
              </StepperIndicator>
            </StepperTrigger>
            {<ExampleText>{steps.length > step && (
              <StepperSeparator className="group-data-[state=completed]/step:bg-green-500" />
            )}</ExampleText>}
          </StepperItem>
        ))}</ExampleText>}
      </StepperNav>

      <StepperPanel className="text-sm">
        {<ExampleText>{steps.map((step) => (
          <StepperContent
            className="flex w-full items-center justify-center"
            key={step}
            value={step}
          >
            {<ExampleText>Step </ExampleText>}{<ExampleText>{step}</ExampleText>} {<ExampleText> content </ExampleText>}</StepperContent>
        ))}</ExampleText>}
      </StepperPanel>
    </Stepper>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
