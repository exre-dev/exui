
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Label } from "@exre/exui"
import { Switch } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <div className="flex flex-col items-start justify-start gap-3">
      <div className="flex items-center gap-2">
        <Switch id={exampleId("switch-disabled-unchecked")} disabled />
        <Label htmlFor={exampleId("switch-disabled-unchecked")}>{<ExampleText>Disabled (Unchecked)</ExampleText>}</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id={exampleId("switch-disabled-checked")} defaultChecked disabled />
        <Label htmlFor={exampleId("switch-disabled-checked")}>{<ExampleText>Disabled (Checked)</ExampleText>}</Label>
      </div>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
