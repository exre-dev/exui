
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
    <Frame spacing="sm" className="w-full max-w-sm">
      <FrameHeader>
        <FrameTitle>{<ExampleText>Database Overview</ExampleText>}</FrameTitle>
        <FrameDescription>
          {<ExampleText>Monitoring system health and performance </ExampleText>}</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className="text-sm font-semibold">{<ExampleText>Live Connections</ExampleText>}</h2>
        <p className="text-muted-foreground text-sm">
          {<ExampleText>Small spacing provides a balanced layout for sidebar widgets and secondary dashboards. </ExampleText>}</p>
      </FramePanel>
      <FrameFooter>
        <p className="text-muted-foreground text-sm">{<ExampleText>Status: Operational</ExampleText>}</p>
      </FrameFooter>
    </Frame>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
