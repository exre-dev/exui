
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ShieldCheckIcon } from "lucide-react"

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
          <Alert className="border-0 shadow-none">
            <ShieldCheckIcon className="text-emerald-500" />
            <AlertTitle>{<ExampleText>Security Update</ExampleText>}</AlertTitle>
            <AlertAction>
              <ActionButton variant="outline" size="xs">
                {<ExampleText>Dismiss </ExampleText>}</ActionButton>
              <ActionButton size="xs">{<ExampleText>Update</ExampleText>}</ActionButton>
            </AlertAction>
            <AlertDescription>
              {<ExampleText>Update your password and enable 2FA to improve your account security. </ExampleText>}</AlertDescription>
          </Alert>
        </FramePanel>
      </Frame>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
