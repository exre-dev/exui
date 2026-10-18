
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Field, FieldLabel } from "@exre/exui"
import { Input } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor={exampleId("minimal-input")}>{<ExampleText>Invisible Input</ExampleText>}</FieldLabel>
      <Input
        id={exampleId("minimal-input")}
        placeholder={copyExample("Type here...")}
        className="border-none bg-transparent p-0 shadow-none focus-visible:ring-0"
      />
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
