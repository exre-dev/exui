
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Field, FieldLabel } from "@exre/exui"
import { Input } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor={exampleId("subtle-bg")}>{<ExampleText>Subtle Background</ExampleText>}</FieldLabel>
      <Input
        id={exampleId("subtle-bg")}
        className="bg-muted focus-visible:bg-muted hover:bg-muted transition-colors duration-300"
        placeholder={copyExample("Enter text...")}
      />
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
