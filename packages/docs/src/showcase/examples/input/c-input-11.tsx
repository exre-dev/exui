
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Field, FieldLabel } from "@exre/exui"
import { Input } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor={exampleId("input-demo-date")}>{<ExampleText>Date</ExampleText>}</FieldLabel>
      <Input id={exampleId("input-demo-date")} type="date" />
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
