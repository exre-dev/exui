"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useId, useState } from "react"
import {
  TimePicker,
  TimePickerContent,
  TimePickerInput,
} from "@exre/exui"

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@exre/exui"

  function OriginalPattern() {
  const {format: formatExample,  id: exampleId, locales: exampleLocales } = useExampleRuntime()

  const id = useId()
  const [value, setValue] = useState<string | null>(null)

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <Field>
        {/* `htmlFor` alone is enough: the input speaks its own value. */}
        <FieldLabel htmlFor={exampleId(id)}>{<ExampleText>Pickup time</ExampleText>}</FieldLabel>
        <TimePicker i18n={exampleLocales.timePicker}
          id={exampleId(id)}
          minuteStep={5}
          value={value}
          onValueChange={setValue}
          aria-describedby={exampleId(`${id}-description`)}
        >
          {/* Typed text commits on blur or Enter; unreadable text reverts.
              The popover anchors on the clock button at the end of the
              field, so `align="end"` keeps it under the field. */}
          <TimePickerInput />
          <TimePickerContent align="end" />
        </TimePicker>
        <FieldDescription id={exampleId(`${id}-description`)}>
          {<ExampleText>Type 930, 14:30 or 2:30 pm. Times snap to 5 minutes. </ExampleText>}</FieldDescription>
      </Field>
      <p role="status" className="text-muted-foreground text-sm">
        {<ExampleText>{value ? <>{formatExample("Pickup at {time}", { time: value })}</> : "No pickup time yet"}</ExampleText>}
      </p>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
