
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
    <Frame className="w-full max-w-sm">
      <FrameHeader>
        <FrameTitle>{<ExampleText>User Profile</ExampleText>}</FrameTitle>
        <FrameDescription>
          {<ExampleText>Manage your personal account details </ExampleText>}</FrameDescription>
      </FrameHeader>
      <FramePanel>
        <h2 className="text-sm font-semibold">{<ExampleText>Account Security</ExampleText>}</h2>
        <p className="text-muted-foreground text-sm">
          {<ExampleText>Default spacing is the standard for primary application content and main dialogs. </ExampleText>}</p>
      </FramePanel>
      <FrameFooter>
        <p className="text-muted-foreground text-sm">
          {<ExampleText>Last login: Today at 4:30 PM </ExampleText>}</p>
      </FrameFooter>
    </Frame>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
