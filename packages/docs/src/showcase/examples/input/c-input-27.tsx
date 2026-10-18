
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Field, FieldLabel } from "@exre/exui"
import { Input } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor={exampleId("bottom-border")}>{<ExampleText>Bottom Border Only</ExampleText>}</FieldLabel>
      <Input
        id={exampleId("bottom-border")}
        className="focus-visible:border-primary rounded-none border-x-0 border-t-0 border-b-2 px-0 shadow-none focus-visible:ring-0"
        placeholder={copyExample("Type here...")}
      />
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
