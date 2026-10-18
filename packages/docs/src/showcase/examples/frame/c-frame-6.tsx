
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@exre/exui"

  function OriginalPattern() {
  return (
    <Frame className="w-full" variant="ghost">
      <FrameHeader>
        <FrameTitle>{<ExampleText>No Outer Border</ExampleText>}</FrameTitle>
        <FrameDescription>
          {<ExampleText>This frame uses variant="ghost" to remove the outer border. </ExampleText>}</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <p className="text-muted-foreground text-sm">
          {<ExampleText>The outer container of this frame has no border, only the background and panels are visible. </ExampleText>}</p>
      </FramePanel>
    </Frame>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
