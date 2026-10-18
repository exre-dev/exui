
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@exre/exui"
import {
  RadioGroup,
  RadioGroupItem,
} from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <RadioGroup defaultValue="comfortable" className="w-fit">
      <Field orientation="horizontal">
        <RadioGroupItem value="default" id={exampleId("desc-r1")} />
        <FieldContent>
          <FieldLabel htmlFor={exampleId("desc-r1")}>{<ExampleText>Default</ExampleText>}</FieldLabel>
          <FieldDescription>
            {<ExampleText>Standard spacing for most use cases. </ExampleText>}</FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="comfortable" id={exampleId("desc-r2")} />
        <FieldContent>
          <FieldLabel htmlFor={exampleId("desc-r2")}>{<ExampleText>Comfortable</ExampleText>}</FieldLabel>
          <FieldDescription>{<ExampleText>More space between elements.</ExampleText>}</FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="compact" id={exampleId("desc-r3")} />
        <FieldContent>
          <FieldLabel htmlFor={exampleId("desc-r3")}>{<ExampleText>Compact</ExampleText>}</FieldLabel>
          <FieldDescription>
            {<ExampleText>Minimal spacing for dense layouts. </ExampleText>}</FieldDescription>
        </FieldContent>
      </Field>
    </RadioGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
