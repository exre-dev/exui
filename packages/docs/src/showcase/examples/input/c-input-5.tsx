
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Field, FieldError, FieldLabel } from "@exre/exui"
import { Input } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor={exampleId("input-demo-error")}>{<ExampleText>Email</ExampleText>}</FieldLabel>
      <Input
        id={exampleId("input-demo-error")}
        type="email"
        placeholder={copyExample("name@example.com")}
        aria-invalid="true"
      />
      <FieldError>{<ExampleText>Please enter a valid email address.</ExampleText>}</FieldError>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
