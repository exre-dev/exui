"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ArrowLeftIcon, ArrowRightIcon, CompassIcon } from "lucide-react"

import { useState } from "react"

import { Button } from "@exre/exui"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@exre/exui"


const steps = [
  {
    title: "Invite Your Team",
    description:
      "Add team members by email to collaborate on projects in real time. Assign roles and manage permissions from the team settings.",
  },
  {
    title: "Create a Project",
    description:
      "Set up your first project with a name, description, and timeline. Choose from templates or start from scratch.",
  },
  {
    title: "Connect Integrations",
    description:
      "Link tools like GitHub, Slack, and Figma to streamline your workflow and keep everything in sync.",
  },
  {
    title: "Set Up Notifications",
    description:
      "Customize which events trigger alerts — mentions, due dates, status changes, and deployment updates.",
  },
]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1

  return (
    <div className="flex min-h-[100px] items-center justify-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <CompassIcon aria-hidden="true" />
            {<ExampleText>Feature Tour </ExampleText>}</Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-72 gap-2 px-3 pt-3 pb-2"
          side="top"
          sideOffset={8}
        >
          <div className="space-y-2">
            <p className="leading-tight font-medium">
              {<ExampleText>{steps[currentStep].title}</ExampleText>}
            </p>
            <p className="text-muted-foreground">
              {<ExampleText>{steps[currentStep].description}</ExampleText>}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              {<ExampleText>{currentStep + 1}</ExampleText>} {<ExampleText> of </ExampleText>}{<ExampleText>{steps.length}</ExampleText>}
            </span>
            <div className="flex gap-0.5">
              <Button
                aria-label={copyExample("Previous step")}
                className="size-6"
                disabled={isFirst}
                onClick={handlePrev}
                size="icon"
                variant="ghost"
              >
                <ArrowLeftIcon className="size-3.5" aria-hidden="true" />
              </Button>
              <Button
                aria-label={copyExample("Next step")}
                className="size-6"
                disabled={isLast}
                onClick={handleNext}
                size="icon"
                variant="ghost"
              >
                <ArrowRightIcon className="size-3.5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
