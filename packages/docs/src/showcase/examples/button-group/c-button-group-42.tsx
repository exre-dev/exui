"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ShieldAlertIcon, ShieldCheckIcon, TargetIcon, TrendingUpIcon } from "lucide-react"

import { useState } from "react"

import { cn } from "@exre/exui"
import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"
import { Tooltip, TooltipContent, TooltipTrigger } from "@exre/exui"


const orderTypes = [
  {
    id: "market",
    label: "Market",
    tooltip: "Execute immediately at best available price",
    icon: (
      <TrendingUpIcon aria-hidden="true" />
    ),
  },
  {
    id: "limit",
    label: "Limit",
    tooltip: "Execute only at your specified price or better",
    icon: (
      <TargetIcon aria-hidden="true" />
    ),
  },
  {
    id: "stop",
    label: "Stop",
    tooltip: "Trigger a market order at stop level",
    icon: (
      <ShieldAlertIcon aria-hidden="true" />
    ),
  },
  {
    id: "stop-limit",
    label: "Stop-Limit",
    tooltip: "Trigger a limit order at stop level",
    icon: (
      <ShieldCheckIcon aria-hidden="true" />
    ),
  },
]

  function OriginalPattern() {
  const [active, setActive] = useState("market")

  return (
    <ButtonGroup>
      <>
        {<ExampleText>{orderTypes.map((type) => (
          <Tooltip key={type.id}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className={cn(active === type.id ? "bg-muted" : "")}
                onClick={() => setActive(type.id)}
              >
                {<ExampleText>{type.icon}</ExampleText>}
                {<ExampleText>{type.label}</ExampleText>}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-52 text-center">
              {<ExampleText>{type.tooltip}</ExampleText>}
            </TooltipContent>
          </Tooltip>
        ))}</ExampleText>}
      </>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
