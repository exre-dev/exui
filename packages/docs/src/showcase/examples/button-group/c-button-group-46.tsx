"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CalendarDaysIcon, CalendarIcon, ClockIcon, SparklesIcon } from "lucide-react"

import { useState } from "react"

import { cn } from "@exre/exui"
import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"


const intervals = [
  {
    id: "1m",
    icon: (
      <ClockIcon aria-hidden="true" />
    ),
  },
  {
    id: "5m",
    icon: (
      <ClockIcon aria-hidden="true" />
    ),
  },
  {
    id: "1H",
    icon: (
      <ClockIcon aria-hidden="true" />
    ),
  },
  {
    id: "1D",
    icon: (
      <CalendarIcon aria-hidden="true" />
    ),
  },
  {
    id: "1W",
    icon: (
      <CalendarDaysIcon aria-hidden="true" />
    ),
  },
  {
    id: "Auto",
    icon: (
      <SparklesIcon aria-hidden="true" />
    ),
  },
]

  function OriginalPattern() {
  const [active, setActive] = useState("1H")

  return (
    <ButtonGroup>
      {<ExampleText>{intervals.map((interval) => (
        <Button
          key={interval.id}
          variant="outline"
          size="sm"
          className={cn(
            "h-7 gap-1.5 px-2.5 text-xs tabular-nums",
            active === interval.id ? "bg-muted" : ""
          )}
          onClick={() => setActive(interval.id)}
        >
          {<ExampleText>{interval.icon}</ExampleText>}
          {<ExampleText>{interval.id}</ExampleText>}
        </Button>
      ))}</ExampleText>}
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
