"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { InfoIcon } from "lucide-react"

import { useState } from "react"

import { Field } from "@exre/exui"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [value, setValue] = useState("")
  const maxLength = 140

  return (
    <Field className="max-w-xs">
      <InputGroup>
        <InputGroupTextarea
          placeholder={copyExample("Description...")}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={maxLength}
          className="min-h-16 pb-12"
        />
        <InputGroupAddon align="block-end">
          <InputGroupText className="text-muted-foreground text-xs">
            {<ExampleText>{value.length}</ExampleText>}/{<ExampleText>{maxLength}</ExampleText>} {<ExampleText> characters </ExampleText>}</InputGroupText>
          <InfoIcon className="text-muted-foreground ml-auto" />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
