
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
    <RadioGroup defaultValue="blue" className="w-fit">
      <Field orientation="horizontal">
        <RadioGroupItem
          value="blue"
          id={exampleId("color-blue")}
          className="border-blue-500 data-checked:border-blue-500 [&_[data-slot=radio-group-indicator]]:text-blue-500"
        />
        <FieldLabel htmlFor={exampleId("color-blue")}>{<ExampleText>Blue</ExampleText>}</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem
          value="green"
          id={exampleId("color-green")}
          className="border-green-500 data-checked:border-green-500 [&_[data-slot=radio-group-indicator]]:text-green-500"
        />
        <FieldLabel htmlFor={exampleId("color-green")}>{<ExampleText>Green</ExampleText>}</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem
          value="yellow"
          id={exampleId("color-yellow")}
          className="border-yellow-500 data-checked:border-yellow-500 [&_[data-slot=radio-group-indicator]]:text-yellow-500"
        />
        <FieldLabel htmlFor={exampleId("color-yellow")}>{<ExampleText>Yellow</ExampleText>}</FieldLabel>
      </Field>
    </RadioGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
