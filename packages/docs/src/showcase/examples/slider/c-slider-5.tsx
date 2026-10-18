"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"

import { Label } from "@exre/exui"
import { Slider } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  const [value, setValue] = useState([0.3, 0.7])

  return (
    <div className="mx-auto grid w-full max-w-sm gap-4">
      <div className="flex items-center justify-between gap-2">
        <Label id={exampleId("slider-controlled-label")} className="text-sm font-medium">
          {<ExampleText>Controlled Range </ExampleText>}</Label>
        <span className="text-secondary-foreground text-xs font-semibold">
          {<ExampleText>{value[0]?.toFixed(1)}</ExampleText>} – {<ExampleText>{value[1]?.toFixed(1)}</ExampleText>}
        </span>
      </div>
      <Slider
        id={exampleId("slider-controlled")}
        role="group"
        aria-labelledby={exampleId("slider-controlled-label")}
        value={value}
        onValueChange={(val) => setValue(val as number[])}
        min={0}
        max={1}
        step={0.1}
      />
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
