"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useId, useState } from "react"
import { TimePicker } from "@exre/exui"

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@exre/exui"

  function OriginalPattern() {
  const {format: formatExample,  id: exampleId, locales: exampleLocales } = useExampleRuntime()

  const id = useId()
  /* Only a committed value reaches this state. Column picks, Now and Clear
     stay a draft in the popover until OK, and closing it discards them, so
     the roster never sees a half-made change. */
  const [shiftStart, setShiftStart] = useState<string | null>("08:00")

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col gap-3">
      <Field>
        <FieldLabel id={exampleId(`${id}-label`)} htmlFor={exampleId(id)}>
          {<ExampleText>Shift start </ExampleText>}</FieldLabel>
        <TimePicker i18n={exampleLocales.timePicker}
          id={exampleId(id)}
          aria-labelledby={exampleId(`${id}-label`)}
          aria-describedby={exampleId(`${id}-hint`)}
          value={shiftStart}
          onValueChange={setShiftStart}
          minuteStep={15}
          /* Also adds OK to the footer, drawn as the primary button. */
          requireConfirm
        />
        <FieldDescription id={exampleId(`${id}-hint`)}>
          {<ExampleText>Changes apply when you press OK. </ExampleText>}</FieldDescription>
      </Field>
      {/* Announced once per applied change, not on every pick in the
          columns. */}
      <p role="status" className="text-muted-foreground text-sm">
        {<ExampleText>{shiftStart ? <>{formatExample("Shift starts at {time}", { time: shiftStart })}</> : "No shift start set"}</ExampleText>}
      </p>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
