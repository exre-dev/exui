
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Checkbox } from "@exre/exui"
import { Field, FieldLabel } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <div className="flex flex-wrap items-center gap-6">
      <Field orientation="horizontal" className="w-auto">
        <Checkbox id={exampleId("inline-1")} defaultChecked />
        <FieldLabel htmlFor={exampleId("inline-1")} className="cursor-pointer">
          {<ExampleText>Read </ExampleText>}</FieldLabel>
      </Field>
      <Field orientation="horizontal" className="w-auto">
        <Checkbox id={exampleId("inline-2")} />
        <FieldLabel htmlFor={exampleId("inline-2")} className="cursor-pointer">
          {<ExampleText>Write </ExampleText>}</FieldLabel>
      </Field>
      <Field orientation="horizontal" className="w-auto">
        <Checkbox id={exampleId("inline-4")} defaultChecked />
        <FieldLabel htmlFor={exampleId("inline-4")} className="cursor-pointer">
          {<ExampleText>Delete </ExampleText>}</FieldLabel>
      </Field>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
