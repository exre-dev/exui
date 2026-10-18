"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"

import { Field } from "@exre/exui"
import { Label } from "@exre/exui"
import { Textarea } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  const [length, setLength] = useState(0)

  return (
    <Field className="w-full max-w-xs">
      <Label htmlFor={exampleId("label-counter")} className="justify-between">
        {<ExampleText>Bio </ExampleText>}<span className="text-muted-foreground">{<ExampleText>{length}</ExampleText>}/200</span>
      </Label>
      <Textarea
        id={exampleId("label-counter")}
        placeholder={copyExample("Tell us about yourself…")}
        maxLength={200}
        onChange={(e) => setLength(e.target.value.length)}
      />
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
