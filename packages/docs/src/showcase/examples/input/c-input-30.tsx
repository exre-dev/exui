
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Field, FieldLabel } from "@exre/exui"
import { Input } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor={exampleId("pill-input")}>{<ExampleText>Search</ExampleText>}</FieldLabel>
      <Input
        id={exampleId("pill-input")}
        className="rounded-full px-4"
        placeholder={copyExample("Search everything...")}
      />
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
