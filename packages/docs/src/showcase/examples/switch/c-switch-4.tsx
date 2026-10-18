
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Label } from "@exre/exui"
import { Switch } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <div className="flex flex-col items-start justify-start gap-3">
      <div className="flex items-center gap-2">
        <Switch id={exampleId("switch-sm")} size="sm" />
        <Label htmlFor={exampleId("switch-sm")}>{<ExampleText>Small Switch</ExampleText>}</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id={exampleId("switch-default")} size="default" />
        <Label htmlFor={exampleId("switch-default")}>{<ExampleText>Default Switch</ExampleText>}</Label>
      </div>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
