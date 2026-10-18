
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
    <Frame className="w-full max-w-sm [--frame-radius:var(--radius-2xl)]">
      <FrameHeader>
        <FrameTitle>{<ExampleText>Creative Portfolio</ExampleText>}</FrameTitle>
        <FrameDescription>{<ExampleText>Showcasing visual art and design</ExampleText>}</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className="text-sm font-semibold">{<ExampleText>Gallery View</ExampleText>}</h2>
        <p className="text-muted-foreground text-sm">
          {<ExampleText>2XL radius provides a very soft, organic look suitable for creative portfolios and landing pages. </ExampleText>}</p>
      </FramePanel>
      <FrameFooter>
        <p className="text-muted-foreground text-sm">{<ExampleText>Browse 12 projects</ExampleText>}</p>
      </FrameFooter>
    </Frame>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
