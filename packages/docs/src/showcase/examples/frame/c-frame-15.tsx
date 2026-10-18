
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
    <Frame className="w-full max-w-sm [--frame-radius:var(--radius-lg)]">
      <FrameHeader>
        <FrameTitle>{<ExampleText>Team Collaboration</ExampleText>}</FrameTitle>
        <FrameDescription>{<ExampleText>Invite and manage workspace members</ExampleText>}</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className="text-sm font-semibold">{<ExampleText>Active Members</ExampleText>}</h2>
        <p className="text-muted-foreground text-sm">
          {<ExampleText>Large radius offers a modern, friendly appearance for social and collaborative interfaces. </ExampleText>}</p>
      </FramePanel>
      <FrameFooter>
        <p className="text-muted-foreground text-sm">{<ExampleText>3 members online</ExampleText>}</p>
      </FrameFooter>
    </Frame>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
