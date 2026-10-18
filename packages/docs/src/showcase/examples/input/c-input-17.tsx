
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Badge } from "@exre/exui"

import { Field, FieldLabel } from "@exre/exui"
import { Input } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <Field className="w-full max-w-xs">
      <div className="flex items-center gap-2">
        <FieldLabel htmlFor={exampleId("api-key")}>{<ExampleText>API Key</ExampleText>}</FieldLabel>
        <Badge variant="success-light">{<ExampleText>New</ExampleText>}</Badge>
      </div>
      <Input id={exampleId("api-key")} placeholder={copyExample("9f82a1c4b7e243d8a6c9f1e2a3b4c5d6")} />
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
