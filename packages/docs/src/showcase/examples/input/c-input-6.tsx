"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"

import { Field, FieldLabel } from "@exre/exui"
import { Input } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  const [value, setValue] = useState("")
  const maxLength = 50

  return (
    <Field className="max-w-xs">
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor={exampleId("bio")}>{<ExampleText>Description</ExampleText>}</FieldLabel>
        <span className="text-muted-foreground text-xs">
          {<ExampleText>{value.length}</ExampleText>}/{<ExampleText>{maxLength}</ExampleText>}
        </span>
      </div>
      <Input
        id={exampleId("bio")}
        maxLength={maxLength}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={copyExample("Description of your project")}
      />
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
