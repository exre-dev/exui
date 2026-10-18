
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@exre/exui"

  function OriginalPattern() {
  return (
    <Frame className="w-full max-w-sm [--frame-radius:var(--radius-sm)]">
      <FrameHeader>
        <FrameTitle>{<ExampleText>Network Diagnostics</ExampleText>}</FrameTitle>
        <FrameDescription>
          {<ExampleText>Analyzing real-time socket connections </ExampleText>}</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className="text-sm font-semibold">{<ExampleText>Port Status</ExampleText>}</h2>
        <p className="text-muted-foreground text-sm">
          {<ExampleText>Small radius gives a sharp, precise look, perfect for technical dashboards and data grids. </ExampleText>}</p>
      </FramePanel>
      <FrameFooter>
        <p className="text-muted-foreground text-sm">{<ExampleText>Scan completed</ExampleText>}</p>
      </FrameFooter>
    </Frame>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
