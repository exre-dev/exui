
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Checkbox } from "@exre/exui"
import { Field, FieldLabel } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <Field className="w-auto">
      <FieldLabel>{<ExampleText>Notification Settings</ExampleText>}</FieldLabel>
      <Field orientation="horizontal">
        <Checkbox id={exampleId("group-1")} defaultChecked />
        <FieldLabel htmlFor={exampleId("group-1")}>{<ExampleText>Email notifications</ExampleText>}</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Checkbox id={exampleId("group-2")} />
        <FieldLabel htmlFor={exampleId("group-2")}>{<ExampleText>SMS notifications</ExampleText>}</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Checkbox id={exampleId("group-3")} defaultChecked />
        <FieldLabel htmlFor={exampleId("group-3")}>{<ExampleText>Push notifications</ExampleText>}</FieldLabel>
      </Field>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
