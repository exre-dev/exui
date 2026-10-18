
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Badge } from "@exre/exui"

import { Field, FieldLabel } from "@exre/exui"
import { Input } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <div className="flex items-center justify-between gap-2">
        <FieldLabel htmlFor={exampleId("middle-name")}>{<ExampleText>Middle Name</ExampleText>}</FieldLabel>
        <Badge variant="warning-outline" size="sm">
          {<ExampleText>Optional </ExampleText>}</Badge>
      </div>
      <Input id={exampleId("middle-name")} placeholder={copyExample("Alexander")} />
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
