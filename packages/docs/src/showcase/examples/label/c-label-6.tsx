
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Field } from "@exre/exui"
import { Input } from "@exre/exui"
import { Label } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <Field className="w-full max-w-xs">
      <Label htmlFor={exampleId("label-optional")}>
        {<ExampleText>Phone number </ExampleText>}<span className="text-muted-foreground">{<ExampleText>(optional)</ExampleText>}</span>
      </Label>
      <Input id={exampleId("label-optional")} type="tel" placeholder={copyExample("+1 (555) 000-0000")} />
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
