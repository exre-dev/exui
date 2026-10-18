
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Field, FieldLabel } from "@exre/exui"
import {
  RadioGroup,
  RadioGroupItem,
} from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <RadioGroup defaultValue="email" className="w-fit">
      <Field orientation="horizontal" data-invalid>
        <RadioGroupItem value="email" id={exampleId("invalid-r1")} aria-invalid />
        <FieldLabel htmlFor={exampleId("invalid-r1")}>{<ExampleText>Email only</ExampleText>}</FieldLabel>
      </Field>
      <Field orientation="horizontal" data-invalid>
        <RadioGroupItem value="sms" id={exampleId("invalid-r2")} aria-invalid />
        <FieldLabel htmlFor={exampleId("invalid-r2")}>{<ExampleText>SMS only</ExampleText>}</FieldLabel>
      </Field>
    </RadioGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
