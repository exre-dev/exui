"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { TimePicker } from "@exre/exui"

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@exre/exui"

const BOOKED = new Set(["10:00", "14:30", "15:00"])

/* Values arrive as `HH:mm`, so plain string comparison orders them. Module
   scope keeps the function stable, and a function prop is also why this file
   is a client module although it holds no state. */
function isUnavailable(value: string) {
  return (value >= "12:00" && value < "13:00") || BOOKED.has(value)
}

  function OriginalPattern() {
  const { id: exampleId, locales: exampleLocales } = useExampleRuntime()

  return (
    <div className="w-full max-w-xs">
      <Field>
        <FieldLabel id={exampleId("appointment-time-label")} htmlFor={exampleId("appointment-time")}>
          {<ExampleText>Appointment </ExampleText>}</FieldLabel>
        {/* An hour with no free slot left is disabled whole, like 12. */}
        <TimePicker i18n={exampleLocales.timePicker}
          id={exampleId("appointment-time")}
          minuteStep={30}
          min="09:00"
          max="17:00"
          isTimeDisabled={isUnavailable}
          aria-labelledby={exampleId("appointment-time-label")}
          aria-describedby={exampleId("appointment-time-description")}
        />
        <FieldDescription id={exampleId("appointment-time-description")}>
          {<ExampleText>Lunch from 12:00 to 13:00 and times already booked are unavailable. </ExampleText>}</FieldDescription>
      </Field>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
