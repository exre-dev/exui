
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Spinner } from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-full max-w-xs flex-col gap-3">
      <div className="flex items-center gap-2">
        <Spinner className="size-3.5" />
        <span className="text-muted-foreground text-sm">
          {<ExampleText>Checking availability... </ExampleText>}</span>
      </div>
      <div className="flex items-center gap-2">
        <Spinner className="text-success size-3.5" />
        <span className="text-sm">
          <span className="text-success font-medium">{<ExampleText>Connected</ExampleText>}</span>
          <span className="text-muted-foreground"> {<ExampleText> — syncing data</ExampleText>}</span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Spinner className="text-warning size-3.5" />
        <span className="text-sm">
          <span className="text-warning font-medium">{<ExampleText>Reconnecting</ExampleText>}</span>
          <span className="text-muted-foreground"> {<ExampleText> — attempt 3 of 5</ExampleText>}</span>
        </span>
      </div>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
