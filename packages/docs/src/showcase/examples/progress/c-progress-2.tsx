
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Progress } from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="mx-auto w-full max-w-xs space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{<ExampleText>Small progress</ExampleText>}</span>
        <span className="text-muted-foreground text-sm">30%</span>
      </div>
      <Progress value={30} className="h-1" />
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
