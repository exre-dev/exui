"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { StepperIndicator, StepperItem, StepperNav, StepperPanel, StepperSeparator } from "@exre/exui"
import { ExampleStepper as Stepper, ExampleStepperContent as StepperContent, ExampleStepperTrigger as StepperTrigger } from "../_shared/stepper-runtime"

const steps = [1, 2, 3, 4]

  function OriginalPattern() {
  return (
    <Stepper defaultValue={2} className="w-full max-w-md space-y-8">
      <StepperNav>
        {<ExampleText>{steps.map((step) => (
          <StepperItem key={step} step={step}>
            <StepperTrigger>
              <StepperIndicator>{<ExampleText>{step}</ExampleText>}</StepperIndicator>
            </StepperTrigger>
            {<ExampleText>{steps.length > step && (
              <StepperSeparator className="group-data-[state=completed]/step:bg-primary" />
            )}</ExampleText>}
          </StepperItem>
        ))}</ExampleText>}
      </StepperNav>

      <StepperPanel className="text-sm">
        {<ExampleText>{steps.map((step) => (
          <StepperContent
            key={step}
            value={step}
            className="flex items-center justify-center"
          >
            {<ExampleText>Step </ExampleText>}{<ExampleText>{step}</ExampleText>} {<ExampleText> content </ExampleText>}</StepperContent>
        ))}</ExampleText>}
      </StepperPanel>
    </Stepper>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
