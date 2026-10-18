
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Checkbox } from "@exre/exui"
import { Field } from "@exre/exui"
import { Label } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <Field orientation="horizontal" className="mx-auto w-auto">
      <Checkbox id={exampleId("label-demo-terms")} />
      <Label htmlFor={exampleId("label-demo-terms")}>{<ExampleText>Accept terms and conditions</ExampleText>}</Label>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
