"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon, LoaderCircleIcon } from "lucide-react"

import { StepperDescription, StepperIndicator, StepperItem, StepperNav, StepperPanel, StepperSeparator, StepperTitle } from "@exre/exui"
import { ExampleStepper as Stepper, ExampleStepperContent as StepperContent, ExampleStepperTrigger as StepperTrigger } from "../_shared/stepper-runtime"



const steps = [
  { title: "Step 1", description: "Description" },
  { title: "Step 2", description: "Description" },
  { title: "Step 3", description: "Description" },
]

  function OriginalPattern() {
  return (
    <Stepper
      defaultValue={2}
      indicators={{
        completed: (
          <CheckIcon className="size-3.5" />
        ),
        loading: (
          <LoaderCircleIcon className="size-3.5 animate-spin" />
        ),
      }}
      className="w-full max-w-lg space-y-8"
    >
      <StepperNav>
        {<ExampleText>{steps.map((step, index) => (
          <StepperItem key={index} step={index + 1} className="relative">
            <StepperTrigger className="flex justify-start gap-1.5">
              <StepperIndicator>{<ExampleText>{index + 1}</ExampleText>}</StepperIndicator>
              <div className="flex flex-col items-start gap-0.5">
                <StepperTitle>{<ExampleText>{step.title}</ExampleText>}</StepperTitle>
                <StepperDescription>{<ExampleText>{step.description}</ExampleText>}</StepperDescription>
              </div>
            </StepperTrigger>

            {<ExampleText>{steps.length > index + 1 && (
              <StepperSeparator className="md:mx-2.5" />
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
            {<ExampleText>{step.title}</ExampleText>} {<ExampleText> content </ExampleText>}</StepperContent>
        ))}</ExampleText>}
      </StepperPanel>
    </Stepper>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
