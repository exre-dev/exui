
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
    <Frame stacked className="w-full max-w-sm">
      <FrameHeader>
        <FrameTitle>{<ExampleText>Server Logs</ExampleText>}</FrameTitle>
        <FrameDescription>{<ExampleText>Recent activity and errors</ExampleText>}</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className="text-sm font-semibold">{<ExampleText>Auth Service</ExampleText>}</h2>
        <p className="text-muted-foreground text-sm">
          {<ExampleText>Successfully logged in user: admin </ExampleText>}</p>
      </FramePanel>
      <FramePanel>
        <h2 className="text-sm font-semibold">{<ExampleText>Database</ExampleText>}</h2>
        <p className="text-muted-foreground text-sm">
          {<ExampleText>Query execution time: 12ms </ExampleText>}</p>
      </FramePanel>
      <FramePanel>
        <h2 className="text-sm font-semibold">{<ExampleText>Storage</ExampleText>}</h2>
        <p className="text-muted-foreground text-sm">
          {<ExampleText>Upload complete: image.png </ExampleText>}</p>
      </FramePanel>
    </Frame>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
