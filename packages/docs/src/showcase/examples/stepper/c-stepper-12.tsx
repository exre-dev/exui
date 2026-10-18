"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ArrowLeftIcon } from "lucide-react"

import { useState } from "react"
import { StepperIndicator, StepperItem, StepperNav, StepperPanel } from "@exre/exui"
import { ExampleStepper as Stepper, ExampleStepperContent as StepperContent, ExampleStepperTrigger as StepperTrigger } from "../_shared/stepper-runtime"

import { cn } from "@exre/exui"
import { Button } from "@exre/exui"


const steps = [1, 2, 3, 4]

  function OriginalPattern() {
  const [currentStep, setCurrentStep] = useState(1)

  return (
    <div className="w-full max-w-md">
      <Stepper value={currentStep} onValueChange={setCurrentStep}>
        <StepperNav>
          {<ExampleText>{steps.map((step) => (
            <StepperItem
              key={step}
              step={step}
              className="first:rounded-s-full last:rounded-e-full flex-1 overflow-hidden transition-all duration-300"
            >
              <StepperTrigger
                className="w-full flex-col items-start gap-2"
              >
                <StepperIndicator className="bg-border h-2 w-full rounded-none!">
                  <span className="sr-only">{<ExampleText>{step}</ExampleText>}</span>
                </StepperIndicator>
              </StepperTrigger>
            </StepperItem>
          ))}</ExampleText>}
        </StepperNav>

        <div className="flex items-center justify-between gap-2.5 py-1">
          <Button
            variant="link"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className={cn(
              "px-0",
              currentStep === 1 && "pointer-events-none opacity-0"
            )}
          >
            <ArrowLeftIcon className="size-4" />
            {<ExampleText>Back </ExampleText>}</Button>

          <div className="text-sm font-medium">
            <span className="text-foreground">{<ExampleText>{currentStep}</ExampleText>}</span>{<ExampleText>{" "}</ExampleText>}
            <span className="text-muted-foreground/60">/ {<ExampleText>{steps.length}</ExampleText>}</span>
          </div>
        </div>

        <StepperPanel className="py-6 text-sm">
          {<ExampleText>{steps.map((step) => (
            <StepperContent
              className="flex w-full items-center justify-center"
              key={step}
              value={step}
            >
              {<ExampleText>Step </ExampleText>}{<ExampleText>{step}</ExampleText>} {<ExampleText> content </ExampleText>}</StepperContent>
          ))}</ExampleText>}
        </StepperPanel>

        <div className="flex items-center justify-end gap-2.5">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((prev) => prev + 1)}
            disabled={currentStep === steps.length}
          >
            {<ExampleText>Next </ExampleText>}</Button>
        </div>
      </Stepper>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
