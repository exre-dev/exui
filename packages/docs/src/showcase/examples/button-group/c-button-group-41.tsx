"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BrainIcon, FlaskConicalIcon, ZapIcon } from "lucide-react"

import { useState } from "react"
import { Badge } from "@exre/exui"

import { cn } from "@exre/exui"
import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"
import { Tooltip, TooltipContent, TooltipTrigger } from "@exre/exui"


const models = [
  {
    id: "gpt4o",
    label: "GPT-4o",
    badge: "Fast",
    badgeVariant: "success-light" as const,
    tooltip: "128k context, fastest response",
    icon: (
      <ZapIcon aria-hidden="true" />
    ),
  },
  {
    id: "claude",
    label: "Claude",
    badge: "Pro",
    badgeVariant: "info-light" as const,
    tooltip: "200k context, best for analysis",
    icon: (
      <BrainIcon aria-hidden="true" />
    ),
  },
  {
    id: "gemini",
    label: "Gemini",
    badge: "Preview",
    badgeVariant: "warning-light" as const,
    tooltip: "1M context, experimental",
    icon: (
      <FlaskConicalIcon aria-hidden="true" />
    ),
  },
]

  function OriginalPattern() {
  const [active, setActive] = useState("claude")

  return (
    <ButtonGroup>
      <>
        {<ExampleText>{models.map((model) => (
          <Tooltip key={model.id}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className={cn(active === model.id ? "bg-muted" : "")}
                onClick={() => setActive(model.id)}
              >
                {<ExampleText>{model.icon}</ExampleText>}
                {<ExampleText>{model.label}</ExampleText>}
                <Badge variant={model.badgeVariant} size="xs">
                  {<ExampleText>{model.badge}</ExampleText>}
                </Badge>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{<ExampleText>{model.tooltip}</ExampleText>}</TooltipContent>
          </Tooltip>
        ))}</ExampleText>}
      </>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
