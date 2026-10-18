"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useId, useState } from "react"
import { TimePicker } from "@exre/exui"

import { Button } from "@exre/exui"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@exre/exui"

  function OriginalPattern() {
  const {format: formatExample,  id: exampleId, locales: exampleLocales } = useExampleRuntime()

  const id = useId()
  const [invalid, setInvalid] = useState(false)
  const [booked, setBooked] = useState<string | null>(null)

  return (
    /* `noValidate`: the Field draws the error, not the browser bubble. */
    <form
      noValidate
      className="mx-auto w-full max-w-sm"
      onSubmit={(event) => {
        event.preventDefault()
        /* The picker submits `HH:mm` under its `name`, or "" while empty. */
        const time = String(
          new FormData(event.currentTarget).get("deliveryTime") ?? ""
        )
        setInvalid(!time)
        setBooked(time || null)
      }}
      onReset={() => {
        /* The picker returns to its default (empty) on the same reset. */
        setInvalid(false)
        setBooked(null)
      }}
    >
      <FieldGroup>
        <Field data-invalid={invalid || undefined}>
          <FieldLabel id={exampleId(`${id}-label`)} htmlFor={exampleId(id)}>
            {<ExampleText>Delivery time </ExampleText>}</FieldLabel>
          <TimePicker i18n={exampleLocales.timePicker}
            id={exampleId(id)}
            name="deliveryTime"
            required
            /* Sets aria-invalid on the trigger; the Field colors the label. */
            invalid={invalid}
            minuteStep={30}
            min="08:00"
            max="20:00"
            aria-labelledby={exampleId(`${id}-label`)}
            aria-describedby={exampleId(`${id}-hint`)}
            onValueChange={(next) => {
              /* A pick clears the error; emptying the field waits for Submit. */
              if (next) setInvalid(false)
            }}
          />
          {/* One id for both, so aria-describedby follows whichever is shown. */}
          {<ExampleText>{invalid ? (
            <FieldError id={exampleId(`${id}-hint`)}>
              {<ExampleText>Choose a delivery time to continue. </ExampleText>}</FieldError>
          ) : (
            <FieldDescription id={exampleId(`${id}-hint`)}>
              {<ExampleText>30-minute slots between 08:00 and 20:00. </ExampleText>}</FieldDescription>
          )}</ExampleText>}
        </Field>
        <div className="flex items-center gap-2">
          <Button type="submit">{<ExampleText>Submit</ExampleText>}</Button>
          <Button type="reset" variant="outline">
            {<ExampleText>Reset </ExampleText>}</Button>
          <p
            role="status"
            className="text-muted-foreground ms-auto min-w-0 truncate text-sm"
          >
            {<ExampleText>{booked && <>{formatExample("Delivery booked for {time}", { time: booked })}</>}</ExampleText>}
          </p>
        </div>
      </FieldGroup>
    </form>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
