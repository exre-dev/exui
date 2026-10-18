
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
    <Frame spacing="xs" className="w-full max-w-xs">
      <FrameHeader>
        <FrameTitle>{<ExampleText>Project Configuration</ExampleText>}</FrameTitle>
        <FrameDescription>{<ExampleText>Adjust your environment settings</ExampleText>}</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className="text-sm font-semibold">{<ExampleText>Environment Variables</ExampleText>}</h2>
        <p className="text-muted-foreground text-sm">
          {<ExampleText>XS spacing is ideal for high-density toolbars and property panels. </ExampleText>}</p>
      </FramePanel>
      <FrameFooter>
        <p className="text-muted-foreground text-sm">{<ExampleText>Updated 2m ago</ExampleText>}</p>
      </FrameFooter>
    </Frame>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
