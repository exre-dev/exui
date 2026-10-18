"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useId, useState } from "react"
import { Badge } from "@exre/exui"
import {
  SignaturePad,
  SignaturePadArea,
  SignaturePadClear,
  SignaturePadControls,
  SignaturePadGuide,
  SignaturePadPlaceholder,
  type SignaturePadPointerType,
} from "@exre/exui"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@exre/exui"
import { Switch } from "@exre/exui"

const INPUT_LABEL: Record<SignaturePadPointerType, string> = {
  pen: "Stylus, width from pressure",
  touch: "Finger, width from speed",
  mouse: "Mouse, width from speed",
}

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  const id = useId()
  const [penOnly, setPenOnly] = useState(false)
  const [lastInput, setLastInput] = useState<SignaturePadPointerType | null>(
    null
  )

  return (
    <SignaturePad
      /* A stylus reports pressure; accepting only it ignores a resting palm. */
      pointerTypes={penOnly ? ["pen"] : undefined}
      onStrokeStart={({ pointerType }) => setLastInput(pointerType)}
      className="mx-auto max-w-lg"
    >
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor={exampleId(`${id}-pen`)}>{<ExampleText>Pen only</ExampleText>}</FieldLabel>
          <FieldDescription>
            {<ExampleText>Ignore touch and mouse, so a hand resting on the screen leaves no marks. </ExampleText>}</FieldDescription>
        </FieldContent>
        <Switch
          id={exampleId(`${id}-pen`)}
          checked={penOnly}
          onCheckedChange={(checked) => setPenOnly(checked)}
        />
      </Field>
      <SignaturePadArea className="h-48">
        <SignaturePadGuide />
        <SignaturePadPlaceholder>
          {<ExampleText>{penOnly
            ? "Sign with a stylus"
            : "Sign with a stylus, finger or mouse"}</ExampleText>}
        </SignaturePadPlaceholder>
        <SignaturePadControls position="top-end">
          <SignaturePadClear variant="ghost" />
        </SignaturePadControls>
      </SignaturePadArea>
      <div className="text-muted-foreground flex items-center gap-2 text-xs">
        {<ExampleText>Last stroke </ExampleText>}<Badge variant="outline">
          {<ExampleText>{lastInput ? INPUT_LABEL[lastInput] : "None yet"}</ExampleText>}
        </Badge>
      </div>
    </SignaturePad>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
