
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Field, FieldLabel } from "@exre/exui"
import { Input } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor={exampleId("custom-focus")}>{<ExampleText>Custom Focus</ExampleText>}</FieldLabel>
      <Input
        id={exampleId("custom-focus")}
        className="focus-visible:border-emerald-500 focus-visible:ring-emerald-500/50"
        placeholder={copyExample("Green focus ring")}
      />
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
