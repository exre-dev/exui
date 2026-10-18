"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"

import { Label } from "@exre/exui"
import { Slider } from "@exre/exui"

  function OriginalPattern() {
  const [value, setValue] = useState(50)
  const min = 0
  const max = 100
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className="mx-auto grid w-full max-w-sm gap-4">
      <Label className="text-sm font-medium">{<ExampleText>Volume</ExampleText>}</Label>
      <div className="relative pt-7">
        <div
          className="bg-foreground text-background absolute top-0 rounded px-2 py-0.5 text-xs font-semibold tabular-nums"
          style={{
            left: `${percentage}%`,
            transform: "translateX(-50%)",
          }}
        >
          {<ExampleText>{value}</ExampleText>}%
          <div className="bg-foreground absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45" />
        </div>
        <Slider
          value={[value]}
          onValueChange={(val) =>
            setValue(Array.isArray(val) ? (val[0] ?? 50) : val)
          }
          min={min}
          max={max}
          step={1}
        />
      </div>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
