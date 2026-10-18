
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@exre/exui"
import {
  RadioGroup,
  RadioGroupItem,
} from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <RadioGroup defaultValue="plus" className="w-full max-w-xs">
      <FieldLabel htmlFor={exampleId("plus-plan")}>
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>{<ExampleText>Plus</ExampleText>}</FieldTitle>
            <FieldDescription>
              {<ExampleText>For individuals and small teams. </ExampleText>}</FieldDescription>
          </FieldContent>
          <RadioGroupItem value="plus" id={exampleId("plus-plan")} />
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor={exampleId("pro-plan")}>
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>{<ExampleText>Pro</ExampleText>}</FieldTitle>
            <FieldDescription>{<ExampleText>For growing businesses.</ExampleText>}</FieldDescription>
          </FieldContent>
          <RadioGroupItem value="pro" id={exampleId("pro-plan")} />
        </Field>
      </FieldLabel>
    </RadioGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
