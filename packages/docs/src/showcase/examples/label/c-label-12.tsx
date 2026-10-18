"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon, PencilIcon } from "lucide-react"

import { useState } from "react"

import { Button } from "@exre/exui"
import { Field, FieldDescription } from "@exre/exui"
import { Input } from "@exre/exui"
import { Label } from "@exre/exui"


  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState("My Awesome Project")

  return (
    <Field className="w-full max-w-xs">
      <Label htmlFor={isEditing ? exampleId("label-inline-edit") : undefined} className="gap-2">
        {<ExampleText>Project Name </ExampleText>}<Button
          size="icon-xs"
          variant="ghost"
          aria-label={copyExample(isEditing ? "Save changes" : "Edit")}
          onClick={() => setIsEditing(!isEditing)}
        >
          {<ExampleText>{isEditing ? (
            <CheckIcon className="size-3.5" />
          ) : (
            <PencilIcon className="size-3.5" />
          )}</ExampleText>}
        </Button>
      </Label>
      {<ExampleText>{isEditing ? (
        <Input
          id={exampleId("label-inline-edit")}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
        />
      ) : (
        <FieldDescription>{<ExampleText>{value}</ExampleText>}</FieldDescription>
      )}</ExampleText>}
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
