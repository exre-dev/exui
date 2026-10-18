"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon, LoaderCircleIcon } from "lucide-react"

import { StepperIndicator, StepperItem, StepperNav, StepperPanel, StepperTitle } from "@exre/exui"
import { ExampleStepper as Stepper, ExampleStepperContent as StepperContent, ExampleStepperTrigger as StepperTrigger } from "../_shared/stepper-runtime"



const steps = [
  { title: "User Details" },
  { title: "Payment Info" },
  { title: "Auth OTP" },
  { title: "Preview Form" },
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
      <StepperNav className="gap-3">
        {<ExampleText>{steps.map((step, index) => (
          <StepperItem
            key={index}
            step={index + 1}
            className="relative flex-1 items-start"
          >
            <StepperTrigger className="flex grow flex-col items-start justify-center gap-3">
              <StepperIndicator>{<ExampleText>{index + 1}</ExampleText>}</StepperIndicator>
              <StepperTitle className="group-data-[state=inactive]/step:text-muted-foreground text-start font-semibold">
                {<ExampleText>{step.title}</ExampleText>}
              </StepperTitle>
            </StepperTrigger>
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
