
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Checkbox } from "@exre/exui"
import { Field, FieldLabel } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <Field orientation="horizontal" data-disabled className="w-auto">
      <Checkbox id={exampleId("disabled-2")} disabled defaultChecked />
      <FieldLabel htmlFor={exampleId("disabled-2")}>{<ExampleText>Disabled checkbox</ExampleText>}</FieldLabel>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
