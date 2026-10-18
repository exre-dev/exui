
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
    <Frame className="w-full max-w-sm [--frame-radius:var(--radius-md)]">
      <FrameHeader>
        <FrameTitle>{<ExampleText>Media Library</ExampleText>}</FrameTitle>
        <FrameDescription>{<ExampleText>Manage your assets and downloads</ExampleText>}</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className="text-sm font-semibold">{<ExampleText>Storage Capacity</ExampleText>}</h2>
        <p className="text-muted-foreground text-sm">
          {<ExampleText>Medium radius is a versatile middle ground between sharp and rounded aesthetics. </ExampleText>}</p>
      </FramePanel>
      <FrameFooter>
        <p className="text-muted-foreground text-sm">{<ExampleText>75% of 100GB used</ExampleText>}</p>
      </FrameFooter>
    </Frame>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
