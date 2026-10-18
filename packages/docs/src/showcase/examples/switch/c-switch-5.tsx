
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Field, FieldLabel } from "@exre/exui"
import { Switch } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <Field className="w-auto">
      <FieldLabel>{<ExampleText>Notification Settings</ExampleText>}</FieldLabel>
      <Field orientation="horizontal">
        <Switch id={exampleId("sg-email")} defaultChecked />
        <FieldLabel htmlFor={exampleId("sg-email")}>{<ExampleText>Email notifications</ExampleText>}</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Switch id={exampleId("sg-sms")} />
        <FieldLabel htmlFor={exampleId("sg-sms")}>{<ExampleText>SMS notifications</ExampleText>}</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Switch id={exampleId("sg-push")} defaultChecked />
        <FieldLabel htmlFor={exampleId("sg-push")}>{<ExampleText>Push notifications</ExampleText>}</FieldLabel>
      </Field>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
