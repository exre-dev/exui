"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"

import { Field, FieldLabel } from "@exre/exui"
import { Input } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  const [value, setValue] = useState(50)

  return (
    <Field className="w-full max-w-xs">
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor={exampleId("range-slider")}>{<ExampleText>Volume</ExampleText>}</FieldLabel>
        <span className="text-muted-foreground text-xs font-medium">
          {<ExampleText>{value}</ExampleText>}
        </span>
      </div>
      <Input
        id={exampleId("range-slider")}
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value))}
        className="bg-muted accent-primary h-2 cursor-pointer appearance-none"
      />
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
