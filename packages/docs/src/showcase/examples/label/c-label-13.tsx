
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Field } from "@exre/exui"
import { Input } from "@exre/exui"
import { Label } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <Field className="w-full max-w-xs">
      <Label htmlFor={exampleId("label-status")} className="gap-1.5">
        {<ExampleText>Server Status </ExampleText>}<span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-green-500" />
        </span>
      </Label>
      <Input id={exampleId("label-status")} defaultValue="Online" disabled />
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
