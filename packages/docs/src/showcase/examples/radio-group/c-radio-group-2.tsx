
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
    <RadioGroup defaultValue="comfortable" className="w-fit">
      <Field orientation="horizontal">
        <RadioGroupItem value="default" id={exampleId("disabled-r1")} />
        <FieldLabel htmlFor={exampleId("disabled-r1")}>{<ExampleText>Default</ExampleText>}</FieldLabel>
      </Field>
      <Field orientation="horizontal" data-disabled>
        <RadioGroupItem value="comfortable" disabled id={exampleId("disabled-r2")} />
        <FieldLabel htmlFor={exampleId("disabled-r2")}>{<ExampleText>Comfortable</ExampleText>}</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="compact" id={exampleId("disabled-r3")} />
        <FieldLabel htmlFor={exampleId("disabled-r3")}>{<ExampleText>Compact</ExampleText>}</FieldLabel>
      </Field>
    </RadioGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
