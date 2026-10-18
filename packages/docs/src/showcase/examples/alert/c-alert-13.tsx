
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { AlertTriangleIcon, CircleCheckIcon } from "lucide-react"

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
        <FramePanel className="p-0!">
          <Alert
            variant="success"
            className="rounded-none border-0 shadow-none"
          >
            <CircleCheckIcon  />
            <AlertTitle>{<ExampleText>Deployment Successful</ExampleText>}</AlertTitle>
            <AlertDescription>
              {<ExampleText>Your application has been successfully deployed to the production environment. </ExampleText>}</AlertDescription>
          </Alert>
        </FramePanel>
        <FramePanel className="p-0!">
          <Alert
            variant="warning"
            className="rounded-none border-0 shadow-none"
          >
            <AlertTriangleIcon className="text-yellow-500" />
            <AlertTitle>{<ExampleText>Resource Limit Reached</ExampleText>}</AlertTitle>
            <AlertAction>
              <ActionButton size="xs">{<ExampleText>Verify</ExampleText>}</ActionButton>
            </AlertAction>
            <AlertDescription>
              {<ExampleText>Your current plan has reached its resource limits. Consider upgrading to a higher tier. </ExampleText>}</AlertDescription>
          </Alert>
        </FramePanel>
      </Frame>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
