"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon, LoaderCircleIcon } from "lucide-react"

import { StepperIndicator, StepperItem, StepperNav, StepperPanel, StepperSeparator } from "@exre/exui"
import { ExampleStepper as Stepper, ExampleStepperContent as StepperContent, ExampleStepperTrigger as StepperTrigger } from "../_shared/stepper-runtime"



const steps = [1, 2, 3]

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <Stepper
        className="flex flex-col items-center justify-center gap-10"
        defaultValue={2}
        orientation="vertical"
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
          {<ExampleText>{steps.map((step) => (
            <StepperItem key={step} step={step} loading={step === 2}>
              <StepperTrigger>
                <StepperIndicator className="data-[state=completed]:bg-success data-[state=completed]:text-white">
                  {<ExampleText>{step}</ExampleText>}
                </StepperIndicator>
              </StepperTrigger>
              {<ExampleText>{steps.length > step && (
                <StepperSeparator className="group-data-[state=completed]/step:bg-success" />
              )}</ExampleText>}
            </StepperItem>
          ))}</ExampleText>}
        </StepperNav>

        <StepperPanel className="w-56 text-center text-sm">
          {<ExampleText>{steps.map((step) => (
            <StepperContent key={step} value={step}>
              {<ExampleText>Step </ExampleText>}{<ExampleText>{step}</ExampleText>} {<ExampleText> content </ExampleText>}</StepperContent>
          ))}</ExampleText>}
        </StepperPanel>
      </Stepper>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
