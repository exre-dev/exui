
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Field, FieldLabel } from "@exre/exui"
import { Input } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <Field orientation="horizontal" className="w-full max-w-xs">
      <FieldLabel htmlFor={exampleId("horizontal-name")} className="w-24">
        {<ExampleText>Name </ExampleText>}</FieldLabel>
      <Input id={exampleId("horizontal-name")} placeholder={copyExample("John Doe")} />
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
