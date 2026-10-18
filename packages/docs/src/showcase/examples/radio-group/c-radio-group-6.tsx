
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@exre/exui"
import {
  RadioGroup,
  RadioGroupItem,
} from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <FieldSet className="w-full max-w-xs">
      <FieldLegend>{<ExampleText>Battery Level</ExampleText>}</FieldLegend>
      <FieldDescription>{<ExampleText>Choose your preferred battery level.</ExampleText>}</FieldDescription>
      <RadioGroup defaultValue="medium">
        <Field orientation="horizontal">
          <RadioGroupItem value="high" id={exampleId("battery-high")} />
          <FieldLabel htmlFor={exampleId("battery-high")}>{<ExampleText>High</ExampleText>}</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="medium" id={exampleId("battery-medium")} />
          <FieldLabel htmlFor={exampleId("battery-medium")}>{<ExampleText>Medium</ExampleText>}</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="low" id={exampleId("battery-low")} />
          <FieldLabel htmlFor={exampleId("battery-low")}>{<ExampleText>Low</ExampleText>}</FieldLabel>
        </Field>
      </RadioGroup>
    </FieldSet>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
