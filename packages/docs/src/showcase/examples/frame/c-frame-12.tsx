
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
    <Frame spacing="lg" className="w-full max-w-sm">
      <FrameHeader>
        <FrameTitle>{<ExampleText>System Analytics</ExampleText>}</FrameTitle>
        <FrameDescription>{<ExampleText>Global traffic and usage patterns</ExampleText>}</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className="text-sm font-semibold">{<ExampleText>Performance Metrics</ExampleText>}</h2>
        <p className="text-muted-foreground text-sm">
          {<ExampleText>Large spacing creates a focused, airy feel suitable for marketing pages or empty states. </ExampleText>}</p>
      </FramePanel>
      <FrameFooter>
        <p className="text-muted-foreground text-sm">{<ExampleText>View full report</ExampleText>}</p>
      </FrameFooter>
    </Frame>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
