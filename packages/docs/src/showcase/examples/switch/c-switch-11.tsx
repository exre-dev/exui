
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Field, FieldLabel } from "@exre/exui"
import { Switch } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <div className="flex flex-col gap-4">
      <Field orientation="horizontal" className="w-auto">
        <Switch
          id={exampleId("sw-blue")}
          defaultChecked
          className="data-checked:bg-blue-500"
        />
        <FieldLabel htmlFor={exampleId("sw-blue")}>{<ExampleText>Blue</ExampleText>}</FieldLabel>
      </Field>
      <Field orientation="horizontal" className="w-auto">
        <Switch
          id={exampleId("sw-green")}
          defaultChecked
          className="data-checked:bg-green-500"
        />
        <FieldLabel htmlFor={exampleId("sw-green")}>{<ExampleText>Green</ExampleText>}</FieldLabel>
      </Field>
      <Field orientation="horizontal" className="w-auto">
        <Switch
          id={exampleId("sw-yellow")}
          defaultChecked
          className="data-checked:bg-yellow-500"
        />
        <FieldLabel htmlFor={exampleId("sw-yellow")}>{<ExampleText>Yellow</ExampleText>}</FieldLabel>
      </Field>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
