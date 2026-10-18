
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Checkbox } from "@exre/exui"
import { Field, FieldLabel } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <div className="flex flex-col gap-4">
      <Field orientation="horizontal" className="w-auto">
        <Checkbox
          id={exampleId("color-1")}
          defaultChecked
          className="data-checked:border-blue-500 data-checked:bg-blue-500 dark:data-checked:border-blue-500 dark:data-checked:bg-blue-500"
        />
        <FieldLabel htmlFor={exampleId("color-1")}>{<ExampleText>Blue checkbox</ExampleText>}</FieldLabel>
      </Field>
      <Field orientation="horizontal" className="w-auto">
        <Checkbox
          id={exampleId("color-2")}
          defaultChecked
          className="data-checked:border-green-500 data-checked:bg-green-500 dark:data-checked:border-green-500 dark:data-checked:bg-green-500"
        />
        <FieldLabel htmlFor={exampleId("color-2")}>{<ExampleText>Green checkbox</ExampleText>}</FieldLabel>
      </Field>
      <Field orientation="horizontal" className="w-auto">
        <Checkbox
          id={exampleId("color-3")}
          defaultChecked
          className="data-checked:border-yellow-500 data-checked:bg-yellow-500 dark:data-checked:border-yellow-500 dark:data-checked:bg-yellow-500"
        />
        <FieldLabel htmlFor={exampleId("color-3")}>{<ExampleText>Yellow checkbox</ExampleText>}</FieldLabel>
      </Field>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
