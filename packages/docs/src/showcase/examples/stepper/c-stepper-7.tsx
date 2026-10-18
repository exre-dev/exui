"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BookUserIcon, CheckIcon, CreditCardIcon, LoaderCircleIcon, LockIcon } from "lucide-react"

import { useState } from "react"
import { Badge } from "@exre/exui"
import { StepperIndicator, StepperItem, StepperNav, StepperPanel, StepperSeparator, StepperTitle } from "@exre/exui"
import { ExampleStepper as Stepper, ExampleStepperContent as StepperContent, ExampleStepperTrigger as StepperTrigger } from "../_shared/stepper-runtime"

import { Button } from "@exre/exui"


const steps = [
  {
    title: "User Details",
    icon: (
      <BookUserIcon className="size-4" />
    ),
  },
  {
    title: "Payment Info",
    icon: (
      <CreditCardIcon className="size-4" />
    ),
  },
  {
    title: "Auth OTP",
    icon: (
      <LockIcon className="size-4" />
    ),
  },
]

  function OriginalPattern() {
  const [currentStep, setCurrentStep] = useState(2)

  return (
    <Stepper
      value={currentStep}
      onValueChange={setCurrentStep}
      indicators={{
        completed: (
          <CheckIcon className="size-3.5" />
        ),
        loading: (
          <LoaderCircleIcon className="size-3.5 animate-spin" />
        ),
      }}
      className="w-full max-w-xl space-y-8"
    >
      <StepperNav className="gap-3">
        {<ExampleText>{steps.map((step, index) => (
          <StepperItem
            key={index}
            step={index + 1}
            className="relative flex-1 items-start"
          >
            <StepperTrigger
              className="flex grow flex-col items-start justify-center gap-2.5"
            >
              <StepperIndicator className="data-[state=inactive]:border-border data-[state=inactive]:text-muted-foreground data-[state=completed]:bg-success size-8 border-2 data-[state=completed]:text-white data-[state=inactive]:bg-transparent">
                {<ExampleText>{step.icon}</ExampleText>}
              </StepperIndicator>
              <div className="flex flex-col items-start gap-1">
                <div className="text-muted-foreground text-[10px] font-semibold uppercase">
                  {<ExampleText>Step </ExampleText>}{<ExampleText>{index + 1}</ExampleText>}
                </div>
                <StepperTitle className="group-data-[state=inactive]/step:text-muted-foreground text-start text-base font-semibold">
                  {<ExampleText>{step.title}</ExampleText>}
                </StepperTitle>
                <div>
                  <Badge
                    size="sm"
                    variant="primary-light"
                    className="hidden group-data-[state=active]/step:inline-flex"
                  >
                    {<ExampleText>In Progress </ExampleText>}</Badge>
                  <Badge
                    variant="success-light"
                    size="sm"
                    className="hidden group-data-[state=completed]/step:inline-flex"
                  >
                    {<ExampleText>Completed </ExampleText>}</Badge>
                  <Badge
                    variant="secondary"
                    size="sm"
                    className="text-muted-foreground hidden group-data-[state=inactive]/step:inline-flex"
                  >
                    {<ExampleText>Pending </ExampleText>}</Badge>
                </div>
              </div>
            </StepperTrigger>

            {<ExampleText>{steps.length > index + 1 && (
              <StepperSeparator className="group-data-[state=completed]/step:bg-success absolute inset-x-0 start-9 top-4 m-0 group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none" />
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
