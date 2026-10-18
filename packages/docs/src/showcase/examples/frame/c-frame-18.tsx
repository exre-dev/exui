
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Frame, FramePanel } from "@exre/exui"

  function OriginalPattern() {
  return (
    <Frame className="w-full max-w-sm">
      <FramePanel>
        <h2 className="text-sm font-semibold">{<ExampleText>Account Snapshot</ExampleText>}</h2>
        <p className="text-muted-foreground text-sm">
          {<ExampleText>Active seats, usage limits, and billing status are ready for review. </ExampleText>}</p>
      </FramePanel>
      <FramePanel>
        <h2 className="text-sm font-semibold">{<ExampleText>Team Activity</ExampleText>}</h2>
        <p className="text-muted-foreground text-sm">
          {<ExampleText>24 members signed in this week with no unresolved security alerts. </ExampleText>}</p>
      </FramePanel>
    </Frame>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
