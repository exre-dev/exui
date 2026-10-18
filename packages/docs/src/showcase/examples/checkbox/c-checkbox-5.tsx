
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Checkbox } from "@exre/exui"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <Field orientation="horizontal" className="w-auto max-w-xs">
      <Checkbox id={exampleId("terms-2")} defaultChecked />
      <FieldContent>
        <FieldLabel htmlFor={exampleId("terms-2")}>{<ExampleText>Accept terms and conditions</ExampleText>}</FieldLabel>
        <FieldDescription>
          {<ExampleText>This checkbox is used to accept the terms and conditions. </ExampleText>}</FieldDescription>
      </FieldContent>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
