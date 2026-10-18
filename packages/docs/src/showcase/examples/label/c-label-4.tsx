
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Field } from "@exre/exui"
import { Input } from "@exre/exui"
import { Label } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <Field data-disabled={true} className="w-full max-w-xs">
      <Label htmlFor={exampleId("label-demo-disabled")}>{<ExampleText>Disabled Field</ExampleText>}</Label>
      <Input id={exampleId("label-demo-disabled")} placeholder={copyExample("Disabled input…")} disabled />
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
