"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"

import { Label } from "@exre/exui"
import { Slider } from "@exre/exui"

  function OriginalPattern() {
  const [temperature, setTemperature] = useState(4500)

  const getLabel = (temp: number) => {
    if (temp <= 3000) return "Warm"
    if (temp <= 4500) return "Neutral"
    if (temp <= 5500) return "Daylight"
    return "Cool"
  }

  return (
    <div className="mx-auto grid w-full max-w-sm gap-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{<ExampleText>Color Temperature</ExampleText>}</Label>
        <span className="text-muted-foreground text-xs font-medium tabular-nums">
          {<ExampleText>{temperature}</ExampleText>}{<ExampleText>K · </ExampleText>}{<ExampleText>{getLabel(temperature)}</ExampleText>}
        </span>
      </div>
      <div
        className="h-2 rounded-full"
        style={{
          background:
            "linear-gradient(to right, #ff8a2b, #ffd4a3, #fff5e6, #e8f0ff, #a3c9ff)",
        }}
      />
      <Slider
        value={[temperature]}
        onValueChange={(val) =>
          setTemperature(Array.isArray(val) ? (val[0] ?? 4500) : val)
        }
        min={2700}
        max={6500}
        step={100}
      />
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
