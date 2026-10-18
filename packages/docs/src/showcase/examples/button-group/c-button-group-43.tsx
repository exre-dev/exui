"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { MinusIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { useState } from "react"

import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"


const stances = [
  {
    id: "buy",
    label: "Buy",
    icon: (
      <TrendingUpIcon aria-hidden="true" />
    ),
  },
  {
    id: "hold",
    label: "Hold",
    icon: (
      <MinusIcon aria-hidden="true" />
    ),
  },
  {
    id: "sell",
    label: "Sell",
    icon: (
      <TrendingDownIcon aria-hidden="true" />
    ),
  },
]

  function OriginalPattern() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <ButtonGroup>
      {<ExampleText>{stances.map((stance) => (
        <Button
          key={stance.id}
          variant={active === stance.id ? "default" : "outline"}
          onClick={() => setActive(active === stance.id ? null : stance.id)}
        >
          {<ExampleText>{stance.icon}</ExampleText>}
          {<ExampleText>{stance.label}</ExampleText>}
        </Button>
      ))}</ExampleText>}
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
