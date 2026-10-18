
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { DatabaseIcon, GlobeIcon, RefreshCwIcon } from "lucide-react"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@exre/exui"
import { Frame, FramePanel } from "@exre/exui"

import { ActionButton } from "@exre/exui"


  function OriginalPattern() {
  return (
    <div className="mx-auto mb-auto w-full max-w-lg">
      <Frame stacked>
        <FramePanel className="overflow-hidden p-0!">
          <Alert
            variant="success"
            className="border-0 bg-transparent shadow-none"
          >
            <DatabaseIcon  />
            <AlertTitle>{<ExampleText>Database Connected</ExampleText>}</AlertTitle>
            <AlertDescription>
              {<ExampleText>All systems operational. Last sync: 2 minutes ago. </ExampleText>}</AlertDescription>
          </Alert>
        </FramePanel>
        <FramePanel className="overflow-hidden p-0!">
          <Alert
            variant="warning"
            className="border-0 bg-transparent shadow-none"
          >
            <GlobeIcon  />
            <AlertTitle>{<ExampleText>API Latency Warning</ExampleText>}</AlertTitle>
            <AlertAction>
              <ActionButton size="xs" variant="outline" className="h-7">
                <RefreshCwIcon className="mr-1 size-3" />
                {<ExampleText>Retry </ExampleText>}</ActionButton>
            </AlertAction>
            <AlertDescription>
              {<ExampleText>Increased latency detected in US-East regions. Our engineers are investigating. </ExampleText>}</AlertDescription>
          </Alert>
        </FramePanel>
      </Frame>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
