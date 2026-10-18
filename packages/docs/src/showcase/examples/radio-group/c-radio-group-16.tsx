
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Field, FieldLabel } from "@exre/exui"
import {
  RadioGroup,
  RadioGroupItem,
} from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <RadioGroup
      defaultValue="viewer"
      className="mx-auto flex w-auto flex-wrap items-center gap-6"
    >
      <Field orientation="horizontal" className="w-auto">
        <RadioGroupItem value="admin" id={exampleId("role-admin")} />
        <FieldLabel htmlFor={exampleId("role-admin")} className="cursor-pointer">
          {<ExampleText>Admin </ExampleText>}</FieldLabel>
      </Field>
      <Field orientation="horizontal" className="w-auto">
        <RadioGroupItem value="editor" id={exampleId("role-editor")} />
        <FieldLabel htmlFor={exampleId("role-editor")} className="cursor-pointer">
          {<ExampleText>Editor </ExampleText>}</FieldLabel>
      </Field>
      <Field orientation="horizontal" className="w-auto">
        <RadioGroupItem value="viewer" id={exampleId("role-viewer")} />
        <FieldLabel htmlFor={exampleId("role-viewer")} className="cursor-pointer">
          {<ExampleText>Viewer </ExampleText>}</FieldLabel>
      </Field>
    </RadioGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
