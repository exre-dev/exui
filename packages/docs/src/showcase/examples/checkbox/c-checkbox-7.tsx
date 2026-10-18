
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Checkbox } from "@exre/exui"
import { Field, FieldLabel } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <Field orientation="horizontal" className="relative w-auto">
      <Checkbox id={exampleId("circle")} className="rounded-full" defaultChecked />
      <FieldLabel
        htmlFor={exampleId("circle")}
        className="peer-data-checked:text-muted-foreground relative transition-colors after:absolute after:inset-x-0 after:top-1/2 after:h-px after:-translate-y-1/2 after:scale-x-0 after:bg-current after:transition-transform peer-data-checked:after:scale-x-100"
      >
        {<ExampleText>Circle checkbox </ExampleText>}</FieldLabel>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
