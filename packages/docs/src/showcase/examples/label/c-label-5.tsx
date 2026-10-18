
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Field } from "@exre/exui"
import { Input } from "@exre/exui"
import { Label } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <Field className="w-full max-w-xs">
      <Label htmlFor={exampleId("label-required")}>
        {<ExampleText>Email address </ExampleText>}<span className="text-destructive">*</span>
      </Label>
      <Input
        id={exampleId("label-required")}
        type="email"
        placeholder={copyExample("you@example.com")}
        required
      />
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
