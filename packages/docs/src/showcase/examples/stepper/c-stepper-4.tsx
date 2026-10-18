"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"
import { StepperIndicator, StepperItem, StepperNav, StepperPanel, StepperSeparator } from "@exre/exui"
import { ExampleStepper as Stepper, ExampleStepperContent as StepperContent, ExampleStepperTrigger as StepperTrigger } from "../_shared/stepper-runtime"

import { Button } from "@exre/exui"

const steps = [1, 2, 3, 4]

  function OriginalPattern() {
  const [currentStep, setCurrentStep] = useState(2)

  return (
    <Stepper
      value={currentStep}
      onValueChange={setCurrentStep}
      className="w-full max-w-md space-y-8"
    >
      <StepperNav>
        {<ExampleText>{steps.map((step) => (
          <StepperItem key={step} step={step}>
            <StepperTrigger>
              <StepperIndicator className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=completed]:bg-green-500 data-[state=completed]:text-white data-[state=inactive]:text-gray-500">
                {<ExampleText>{step}</ExampleText>}
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

      {/* Buttons */}
      <div className="flex items-center justify-between gap-2.5">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => prev - 1)}
          disabled={currentStep === 1}
        >
          {<ExampleText>Previous </ExampleText>}</Button>
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => prev + 1)}
          disabled={currentStep === steps.length}
        >
          {<ExampleText>Next </ExampleText>}</Button>
      </div>
    </Stepper>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
