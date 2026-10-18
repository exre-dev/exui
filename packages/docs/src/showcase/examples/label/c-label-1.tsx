
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Field } from "@exre/exui"
import { Input } from "@exre/exui"
import { Label } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <Field className="w-full max-w-xs">
      <Label htmlFor={exampleId("label-demo-username")}>{<ExampleText>Username</ExampleText>}</Label>
      <Input id={exampleId("label-demo-username")} placeholder={copyExample("Enter your username…")} />
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
