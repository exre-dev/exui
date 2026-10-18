
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { InfoIcon } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@exre/exui"
import { Frame, FramePanel } from "@exre/exui"



  function OriginalPattern() {
  return (
    <div className="mx-auto mb-auto w-full max-w-lg">
      <Frame>
        <FramePanel className="overflow-hidden p-0!">
          <Alert className="border-0 shadow-none">
            <InfoIcon className="text-destructive" />
            <AlertTitle>{<ExampleText>System Update</ExampleText>}</AlertTitle>
            <AlertDescription>
              {<ExampleText>A new system update is available. Please restart your application to apply the changes. </ExampleText>}</AlertDescription>
          </Alert>
        </FramePanel>
      </Frame>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
