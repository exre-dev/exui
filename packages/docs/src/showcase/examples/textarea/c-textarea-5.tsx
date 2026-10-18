
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Field, FieldLabel } from "@exre/exui"
import { Textarea } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <div className="mx-auto w-full max-w-xs">
      <Field className="w-full">
        <FieldLabel htmlFor={exampleId("textarea-disabled")}>{<ExampleText>Message (Disabled)</ExampleText>}</FieldLabel>
        <Textarea
          id={exampleId("textarea-disabled")}
          placeholder={copyExample("Type your message here…")}
          disabled
        />
      </Field>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
