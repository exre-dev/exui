
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Badge } from "@exre/exui"
import { Checkbox } from "@exre/exui"
import { Field, FieldLabel } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <div className="flex flex-col gap-4">
      <Field orientation="horizontal" className="w-auto">
        <Checkbox id={exampleId("badge-1")} defaultChecked />
        <div className="flex items-center gap-2">
          <FieldLabel htmlFor={exampleId("badge-1")}>{<ExampleText>AI-powered suggestions</ExampleText>}</FieldLabel>
          <Badge className="h-4.5 rounded-full px-1.5 text-[10px] tracking-wider uppercase">
            {<ExampleText>New </ExampleText>}</Badge>
        </div>
      </Field>

      <Field orientation="horizontal" className="w-auto">
        <Checkbox id={exampleId("badge-2")} />
        <div className="flex items-center gap-2">
          <FieldLabel htmlFor={exampleId("badge-2")}>{<ExampleText>Beta feature access</ExampleText>}</FieldLabel>
          <Badge
            variant="secondary"
            className="h-4.5 rounded-full px-1.5 text-[10px] tracking-wider uppercase"
          >
            {<ExampleText>Beta </ExampleText>}</Badge>
        </div>
      </Field>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
