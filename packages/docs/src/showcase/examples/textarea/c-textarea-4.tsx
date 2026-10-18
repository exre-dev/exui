
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@exre/exui"
import { Textarea } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <div className="mx-auto w-full max-w-xs">
      <Field className="w-full">
        <FieldLabel htmlFor={exampleId("textarea-with-desc")}>{<ExampleText>Feedback</ExampleText>}</FieldLabel>
        <Textarea
          id={exampleId("textarea-with-desc")}
          placeholder={copyExample("Type your message here…")}
          rows={6}
        />
        <FieldDescription>
          {<ExampleText>Type your message and press enter to send. </ExampleText>}</FieldDescription>
      </Field>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
