
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Field, FieldLabel } from "@exre/exui"
import { Input } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor={exampleId("input-demo-url")}>{<ExampleText>URL</ExampleText>}</FieldLabel>
      <Input id={exampleId("input-demo-url")} type="url" placeholder={copyExample("https://example.com")} />
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
