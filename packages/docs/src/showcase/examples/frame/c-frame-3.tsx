
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
    <Frame className="w-full" stacked>
      <FrameHeader>
        <FrameTitle>{<ExampleText>Section header</ExampleText>}</FrameTitle>
        <FrameDescription>{<ExampleText>Description for the section</ExampleText>}</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className="text-sm font-semibold">{<ExampleText>Stacked panel</ExampleText>}</h2>
        <p className="text-muted-foreground text-sm">{<ExampleText>Section description</ExampleText>}</p>
      </FramePanel>
      <FramePanel>
        <h2 className="text-sm font-semibold">{<ExampleText>Stacked panel</ExampleText>}</h2>
        <p className="text-muted-foreground text-sm">{<ExampleText>Section description</ExampleText>}</p>
      </FramePanel>
    </Frame>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
