
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Field, FieldError } from "@exre/exui"
import { Input } from "@exre/exui"
import { Label } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <Field className="w-full max-w-xs" data-invalid="true">
      <Label htmlFor={exampleId("label-error")}>{<ExampleText>Email</ExampleText>}</Label>
      <Input
        id={exampleId("label-error")}
        type="email"
        defaultValue="invalid-email"
        aria-invalid="true"
      />
      <FieldError>{<ExampleText>Please enter a valid email address</ExampleText>}</FieldError>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
