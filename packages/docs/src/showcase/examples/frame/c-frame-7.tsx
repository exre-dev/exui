
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
    <Frame dense className="w-full max-w-sm">
      <FrameHeader>
        <FrameTitle>{<ExampleText>Inventory Check</ExampleText>}</FrameTitle>
        <FrameDescription>{<ExampleText>Real-time stock monitoring</ExampleText>}</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className="text-sm font-semibold">{<ExampleText>Warehouse A</ExampleText>}</h2>
        <p className="text-muted-foreground text-sm">
          {<ExampleText>Dense mode removes outer padding for a more compact appearance. </ExampleText>}</p>
      </FramePanel>
    </Frame>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
