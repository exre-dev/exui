
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@exre/exui"
import { Input } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor={exampleId("input-demo-username")}>{<ExampleText>Username</ExampleText>}</FieldLabel>
      <Input
        id={exampleId("input-demo-username")}
        type="text"
        placeholder={copyExample("Enter your username")}
      />
      <FieldDescription>
        {<ExampleText>Choose a unique username for your account. </ExampleText>}</FieldDescription>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
