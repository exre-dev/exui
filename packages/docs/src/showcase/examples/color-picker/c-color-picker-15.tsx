"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useId, useState } from "react"
import {
  ColorPicker,
  ColorPickerContent,
  ColorPickerInput,
} from "@exre/exui"

import { Button } from "@exre/exui"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@exre/exui"

  function OriginalPattern() {
  const {format: formatExample,  id: exampleId, copy: copyExample, locales: exampleLocales } = useExampleRuntime()

  const id = useId()
  const [invalid, setInvalid] = useState(false)
  const [saved, setSaved] = useState<string | null>(null)

  return (
    /* `noValidate`: the Field draws the error, not the browser bubble. */
    <form
      noValidate
      className="mx-auto w-full max-w-sm"
      onSubmit={(event) => {
        event.preventDefault()
        /* The picker submits its value under `name`, or "" while empty. */
        const color = String(
          new FormData(event.currentTarget).get("brandColor") ?? ""
        )
        setInvalid(!color)
        setSaved(color || null)
      }}
      onReset={() => {
        /* The picker returns to its default (empty) on the same reset. */
        setInvalid(false)
        setSaved(null)
      }}
    >
      <FieldGroup>
        <Field data-invalid={invalid || undefined}>
          <FieldLabel htmlFor={exampleId(id)}>{<ExampleText>Brand color</ExampleText>}</FieldLabel>
          <ColorPicker i18n={exampleLocales.colorPicker}
            id={exampleId(id)}
            name="brandColor"
            required
            invalid={invalid}
            aria-describedby={exampleId(`${id}-hint`)}
            onValueChange={(next) => {
              if (next) setInvalid(false)
            }}
          >
            <ColorPickerInput placeholder={copyExample("Type or pick a color")} />
            <ColorPickerContent />
          </ColorPicker>
          {/* One id for both, so aria-describedby follows whichever shows. */}
          {<ExampleText>{invalid ? (
            <FieldError id={exampleId(`${id}-hint`)}>
              {<ExampleText>Choose a brand color to continue. </ExampleText>}</FieldError>
          ) : (
            <FieldDescription id={exampleId(`${id}-hint`)}>
              {<ExampleText>Used on the login page, emails and invoices. </ExampleText>}</FieldDescription>
          )}</ExampleText>}
        </Field>
        <div className="flex items-center gap-2">
          <Button type="submit">{<ExampleText>Save</ExampleText>}</Button>
          <Button type="reset" variant="outline">
            {<ExampleText>Reset </ExampleText>}</Button>
          <p
            role="status"
            className="text-muted-foreground ms-auto min-w-0 truncate text-sm"
          >
            {<ExampleText>{saved && <>{formatExample("Saved {value}", { value: saved.toUpperCase() })}</>}</ExampleText>}
          </p>
        </div>
      </FieldGroup>
    </form>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
