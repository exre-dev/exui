"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { Code2Icon, GlobeIcon, TestTube2Icon } from "lucide-react"

import { useState } from "react"

import { cn } from "@exre/exui"
import { Button } from "@exre/exui"
import {
  ButtonGroup,
  ButtonGroupText,
} from "@exre/exui"
import { Tooltip, TooltipContent, TooltipTrigger } from "@exre/exui"


const environments = [
  {
    id: "development",
    label: "Dev",
    tooltip: "Local development environment",
    icon: (
      <Code2Icon aria-hidden="true" />
    ),
  },
  {
    id: "staging",
    label: "Staging",
    tooltip: "Pre-production mirror",
    icon: (
      <TestTube2Icon aria-hidden="true" />
    ),
  },
  {
    id: "production",
    label: "Production",
    tooltip: "Live environment — affects real users",
    icon: (
      <GlobeIcon aria-hidden="true" />
    ),
  },
]

  function OriginalPattern() {
  const [active, setActive] = useState("development")

  return (
    <ButtonGroup>
      <>
        {<ExampleText>{environments.map((env) => (
          <Tooltip key={env.id}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className={cn(active === env.id ? "bg-muted" : "")}
                onClick={() => setActive(env.id)}
              >
                {<ExampleText>{env.icon}</ExampleText>}
                {<ExampleText>{env.label}</ExampleText>}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{<ExampleText>{env.tooltip}</ExampleText>}</TooltipContent>
          </Tooltip>
        ))}</ExampleText>}
        {<ExampleText>{active === "production" ? (
          <ButtonGroupText className="bg-transparent">
            <div className="bg-success size-1.5 rounded-full" />
            <span>{<ExampleText>Live</ExampleText>}</span>
          </ButtonGroupText>
        ) : null}</ExampleText>}
      </>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
