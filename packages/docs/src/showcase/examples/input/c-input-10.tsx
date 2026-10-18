
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Field, FieldLabel } from "@exre/exui"
import { Input } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor={exampleId("input-demo-number")}>{<ExampleText>Number</ExampleText>}</FieldLabel>
      <Input id={exampleId("input-demo-number")} type="number" placeholder={copyExample("123")} />
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
