
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { LightbulbIcon, XIcon } from "lucide-react"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@exre/exui"
import { Frame, FramePanel } from "@exre/exui"

import { ActionButton } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()
  return (
    <div className="mx-auto mb-auto w-full max-w-lg">
      <Frame variant="ghost">
        <FramePanel className="overflow-hidden p-0!">
          <Alert variant="info" className="border-0 shadow-none">
            <LightbulbIcon  />
            <AlertTitle>{<ExampleText>New: Advanced Analytics</ExampleText>}</AlertTitle>
            <AlertAction>
              <ActionButton aria-label={copyExample("Dismiss alert")}
                size="xs"
                variant="ghost"
                className="text-muted-foreground hover:text-foreground -mt-1 -mr-2 size-7 p-0 hover:bg-transparent"
              >
                <XIcon className="size-3.5" />
              </ActionButton>
            </AlertAction>
            <AlertDescription>
              {<ExampleText>We've just released a new dashboard for tracking your team's performance. </ExampleText>}<ActionButton
                variant="link"
                size="sm"
                className="text-info h-auto p-0 underline"
              >
                {<ExampleText>Explore features </ExampleText>}</ActionButton>
            </AlertDescription>
          </Alert>
        </FramePanel>
      </Frame>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
