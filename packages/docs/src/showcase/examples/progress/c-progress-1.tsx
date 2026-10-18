
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Progress } from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="mx-auto w-full max-w-xs space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{<ExampleText>Upload progress</ExampleText>}</span>
        <span className="text-muted-foreground text-sm">56%</span>
      </div>
      <Progress value={56} />
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
