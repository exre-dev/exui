"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon, LoaderCircleIcon } from "lucide-react"

import { StepperIndicator, StepperItem, StepperNav, StepperPanel, StepperSeparator, StepperTitle } from "@exre/exui"
import { ExampleStepper as Stepper, ExampleStepperContent as StepperContent, ExampleStepperTrigger as StepperTrigger } from "../_shared/stepper-runtime"



const steps = [{ title: "Step 1" }, { title: "Step 2" }, { title: "Step 3" }]

  function OriginalPattern() {
  return (
    <Stepper
      className="w-full max-w-md space-y-8"
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
      <StepperNav>
        {<ExampleText>{steps.map((step, index) => (
          <StepperItem
            key={index}
            step={index + 1}
            className="relative flex-1 items-start"
          >
            <StepperTrigger className="flex flex-col gap-2.5">
              <StepperIndicator>{<ExampleText>{index + 1}</ExampleText>}</StepperIndicator>
              <StepperTitle>{<ExampleText>{step.title}</ExampleText>}</StepperTitle>
            </StepperTrigger>

            {<ExampleText>{steps.length > index + 1 && (
              <StepperSeparator className="group-data-[state=completed]/step:bg-primary absolute inset-x-0 top-3 left-[calc(50%+0.875rem)] m-0 group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem+0.225rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none" />
            )}</ExampleText>}
          </StepperItem>
        ))}</ExampleText>}
      </StepperNav>

      <StepperPanel className="text-sm">
        {<ExampleText>{steps.map((step, index) => (
          <StepperContent
            key={index}
            value={index + 1}
            className="flex items-center justify-center"
          >
            {<ExampleText>Step </ExampleText>}{<ExampleText>{step.title}</ExampleText>} {<ExampleText> content </ExampleText>}</StepperContent>
        ))}</ExampleText>}
      </StepperPanel>
    </Stepper>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
