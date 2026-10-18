
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@exre/exui"
import { Input } from "@exre/exui"
import { Textarea } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <div className="mx-auto w-full max-w-xs">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={exampleId("ticket-subject")}>{<ExampleText>Subject</ExampleText>}</FieldLabel>
          <Input id={exampleId("ticket-subject")} placeholder={copyExample("Briefly describe the issue")} />
          <FieldDescription>
            {<ExampleText>Use a clear and descriptive subject line. </ExampleText>}</FieldDescription>
        </Field>
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor={exampleId("ticket-message")}>{<ExampleText>Message</ExampleText>}</FieldLabel>
            <span className="text-muted-foreground text-xs">0/500</span>
          </div>
          <Textarea
            id={exampleId("ticket-message")}
            placeholder={copyExample("Tell us more about your problem…")}
            className="min-h-[120px]"
          />
          <FieldDescription>
            {<ExampleText>Include any relevant details to help us resolve your issue. </ExampleText>}</FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
