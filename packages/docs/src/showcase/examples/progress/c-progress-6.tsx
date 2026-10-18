"use client"


import { ExampleRuntimeProvider } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"

import { Progress } from "@exre/exui"
import { Slider } from "@exre/exui"

  function OriginalPattern() {
  const [value, setValue] = useState(50)

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col gap-6">
      <Progress value={value} />
      <Slider
        value={[value]}
        onValueChange={(value: number | readonly number[]) =>
          setValue(value as number)
        }
        min={0}
        max={100}
        step={1}
      />
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
