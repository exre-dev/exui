
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CreditCardIcon } from "lucide-react"

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
          <Alert
            variant="destructive"
            className="bg-destructive/5 border-0 shadow-none"
          >
            <CreditCardIcon  />
            <AlertTitle>{<ExampleText>Subscription Expiring</ExampleText>}</AlertTitle>
            <AlertAction>
              <ActionButton size="xs" variant="destructive">
                {<ExampleText>Renew Now </ExampleText>}</ActionButton>
            </AlertAction>
            <AlertDescription>
              {<ExampleText>Your annual subscription will expire in 3 days. Renew now to avoid service interruption and data loss. </ExampleText>}</AlertDescription>
          </Alert>
        </FramePanel>
      </Frame>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
