"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"

import { Label } from "@exre/exui"
import { Slider } from "@exre/exui"

const emojis = ["😡", "🙁", "😐", "🙂", "😍"]
const labels = ["Awful", "Poor", "Okay", "Good", "Amazing"]

  function OriginalPattern() {
  const [value, setValue] = useState(3)

  return (
    <div className="mx-auto grid w-full max-w-sm gap-3">
      <Label className="text-sm font-medium">{<ExampleText>Rate your experience</ExampleText>}</Label>
      <div className="flex items-center gap-3">
        <Slider
          value={[value]}
          onValueChange={(val) =>
            setValue(Array.isArray(val) ? (val[0] ?? 3) : val)
          }
          min={1}
          max={5}
          step={1}
        />
        <span className="text-2xl" aria-hidden="true">
          {<ExampleText>{emojis[value - 1]}</ExampleText>}
        </span>
      </div>
      <span className="text-muted-foreground text-center text-xs font-medium">
        {<ExampleText>{labels[value - 1]}</ExampleText>}
      </span>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
