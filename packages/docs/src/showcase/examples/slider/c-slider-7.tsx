"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"

import { Input } from "@exre/exui"
import { Label } from "@exre/exui"
import { Slider } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  const [value, setValue] = useState(50)

  return (
    <div className="mx-auto grid w-full max-w-sm gap-4">
      <div className="flex items-center justify-between">
        <Label htmlFor={exampleId("slider-input")} className="text-sm font-medium">
          {<ExampleText>Opacity </ExampleText>}</Label>
        <div className="flex items-center gap-1.5">
          <Input
            id={exampleId("slider-input")}
            type="number"
            value={value}
            onChange={(e) => {
              const v = Number(e.target.value)
              if (v >= 0 && v <= 100) setValue(v)
            }}
            min={0}
            max={100}
            className="h-8 w-16 text-center text-sm tabular-nums"
          />
          <span className="text-muted-foreground text-xs">%</span>
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={(val) =>
          setValue(
            Array.isArray(val) ? ((val[0] as number) ?? 50) : (val as number)
          )
        }
        max={100}
        step={1}
      />
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
