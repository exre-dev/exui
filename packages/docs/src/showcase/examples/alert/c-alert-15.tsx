
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ZapIcon } from "lucide-react"

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
      <Frame>
        <FramePanel className="overflow-hidden p-0!">
          <Alert variant="invert" className="border-0 shadow-none">
            <ZapIcon className="text-yellow-500" />
            <AlertTitle>{<ExampleText>Pro Feature</ExampleText>}</AlertTitle>
            <AlertAction>
              <ActionButton
                variant="outline"
                size="xs"
                className="bg-background/10 border-border/10"
              >
                {<ExampleText>Dismiss </ExampleText>}</ActionButton>
              <ActionButton
                size="xs"
                className="border-blue-800 bg-blue-500 text-white hover:border-blue-900 hover:bg-blue-600"
              >
                {<ExampleText>Upgrade </ExampleText>}</ActionButton>
            </AlertAction>
            <AlertDescription>
              {<ExampleText>This feature is only available for Pro users. Upgrade your plan to get access. </ExampleText>}</AlertDescription>
          </Alert>
        </FramePanel>
      </Frame>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
