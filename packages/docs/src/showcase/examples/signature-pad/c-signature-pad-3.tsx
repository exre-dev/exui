"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useId, useState } from "react"
import {
  SignaturePad,
  SignaturePadArea,
  SignaturePadGuide,
} from "@exre/exui"

import { Button } from "@exre/exui"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@exre/exui"
import { Input } from "@exre/exui"

  function OriginalPattern() {
  const {format: formatExample,  id: exampleId, copy: copyExample } = useExampleRuntime()

  const id = useId()
  const [invalid, setInvalid] = useState(false)
  const [submitted, setSubmitted] = useState<{
    name: string
    size: number
  } | null>(null)

  return (
    <form
      noValidate
      className="mx-auto w-full max-w-md"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        /* The pad writes an SVG data URL into the form under its `name`. */
        const signature = String(data.get("signature") ?? "")
        setInvalid(!signature)
        setSubmitted(
          signature
            ? {
                name: String(data.get("name") ?? "").trim(),
                size: new Blob([signature]).size,
              }
            : null
        )
      }}
      onReset={() => {
        setInvalid(false)
        setSubmitted(null)
      }}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={exampleId(`${id}-name`)}>{<ExampleText>Full name</ExampleText>}</FieldLabel>
          <Input
            id={exampleId(`${id}-name`)}
            name="name"
            autoComplete="name"
            placeholder={copyExample("Maya Chen")}
          />
        </Field>
        <Field data-invalid={invalid || undefined}>
          <FieldLabel id={exampleId(`${id}-label`)}>{<ExampleText>Signature</ExampleText>}</FieldLabel>
          <SignaturePad
            name="signature"
            format="svg"
            required
            onStrokeStart={() => setInvalid(false)}
          >
            <SignaturePadArea
              aria-labelledby={exampleId(`${id}-label`)}
              aria-describedby={exampleId(`${id}-hint`)}
              aria-invalid={invalid || undefined}
            >
              <SignaturePadGuide />
            </SignaturePadArea>
          </SignaturePad>
          {<ExampleText>{invalid ? (
            <FieldError id={exampleId(`${id}-hint`)}>{<ExampleText>Sign above to continue.</ExampleText>}</FieldError>
          ) : (
            <FieldDescription id={exampleId(`${id}-hint`)}>
              {<ExampleText>Use a mouse, a finger or a stylus. </ExampleText>}</FieldDescription>
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
            {<ExampleText>{submitted &&
              <>{formatExample("Signed by {name}, {size} KB SVG", { name: submitted.name || copyExample("Unnamed signer"), size: (submitted.size / 1024).toFixed(1) })}</>}</ExampleText>}
          </p>
        </div>
      </FieldGroup>
    </form>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
