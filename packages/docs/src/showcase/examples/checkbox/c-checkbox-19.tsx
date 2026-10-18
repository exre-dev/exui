
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Badge } from "@exre/exui"

import { Checkbox } from "@exre/exui"
import { Field, FieldLabel } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <Field className="w-auto">
      <Field orientation="horizontal">
        <Checkbox id={exampleId("checkbox-badge-1")} />
        <div className="flex items-center gap-3">
          <FieldLabel htmlFor={exampleId("checkbox-badge-1")}>
            {<ExampleText>AI-powered suggestions </ExampleText>}</FieldLabel>
          <Badge className="rounded-full uppercase" size="sm">
            {<ExampleText>New </ExampleText>}</Badge>
        </div>
      </Field>
      <Field orientation="horizontal" defaultChecked>
        <Checkbox id={exampleId("checkbox-badge-2")} />
        <div className="flex items-center gap-3">
          <FieldLabel htmlFor={exampleId("checkbox-badge-2")}>
            {<ExampleText>Beta feature access </ExampleText>}</FieldLabel>
          <Badge
            variant="secondary"
            className="rounded-full uppercase"
            size="sm"
          >
            {<ExampleText>Beta </ExampleText>}</Badge>
        </div>
      </Field>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
