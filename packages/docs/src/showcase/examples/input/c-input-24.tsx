"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"

import { Field, FieldLabel } from "@exre/exui"
import { Input } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  const [isFocused, setIsFocused] = useState(false)

  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor={exampleId("pulsed-input")}>{<ExampleText>Pulsed Background</ExampleText>}</FieldLabel>
      <div className="relative">
        <div
          className={`bg-primary/20 pointer-events-none absolute inset-0 rounded-md transition-opacity duration-300 ${
            isFocused ? "opacity-0" : "animate-pulse"
          }`}
        />
        <Input
          id={exampleId("pulsed-input")}
          placeholder={copyExample("Animation stops on focus...")}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="focus-visible:bg-background relative bg-transparent shadow-none transition-colors duration-300"
        />
      </div>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
