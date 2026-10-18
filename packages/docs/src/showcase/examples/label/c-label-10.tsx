
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Field, FieldDescription } from "@exre/exui"
import { Input } from "@exre/exui"
import { Label } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <Field className="w-full max-w-xs">
      <div className="flex flex-col gap-1">
        <Label htmlFor={exampleId("label-helper")}>{<ExampleText>API Key</ExampleText>}</Label>
        <FieldDescription>
          {<ExampleText>Your secret key for API authentication </ExampleText>}</FieldDescription>
      </div>
      <Input
        id={exampleId("label-helper")}
        placeholder={copyExample("sk_live_...")}
        className="font-mono"
      />
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
