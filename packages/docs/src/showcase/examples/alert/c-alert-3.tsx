
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ShieldCheckIcon } from "lucide-react"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@exre/exui"

import { ActionButton } from "@exre/exui"


  function OriginalPattern() {
  return (
    <Alert>
      <ShieldCheckIcon  />
      <AlertTitle>{<ExampleText>Security Update</ExampleText>}</AlertTitle>
      <AlertDescription>{<ExampleText>Update your password and enable 2FA.</ExampleText>}</AlertDescription>
      <AlertAction>
        <ActionButton variant="outline" size="xs">
          {<ExampleText>Dismiss </ExampleText>}</ActionButton>
        <ActionButton size="xs">{<ExampleText>Update</ExampleText>}</ActionButton>
      </AlertAction>
    </Alert>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
