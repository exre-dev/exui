
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Field, FieldLabel } from "@exre/exui"
import { Textarea } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <div className="mx-auto w-full max-w-xs">
      <Field className="w-full">
        <FieldLabel htmlFor={exampleId("textarea-with-label")}>{<ExampleText>Your Message</ExampleText>}</FieldLabel>
        <Textarea
          id={exampleId("textarea-with-label")}
          placeholder={copyExample("Type your message here…")}
          rows={6}
        />
      </Field>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
