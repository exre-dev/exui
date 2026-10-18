
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Checkbox } from "@exre/exui"
import { Field, FieldLabel } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <Field orientation="horizontal" className="w-auto">
      <Checkbox id={exampleId("indeterminate")} checked="indeterminate" />
      <FieldLabel htmlFor={exampleId("indeterminate")}>{<ExampleText>Indeterminate state</ExampleText>}</FieldLabel>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
