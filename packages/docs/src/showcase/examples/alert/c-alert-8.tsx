
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CircleAlertIcon } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@exre/exui"



  function OriginalPattern() {
  return (
    <Alert variant="destructive">
      <CircleAlertIcon  />
      <AlertTitle>{<ExampleText>Error! Something went wrong</ExampleText>}</AlertTitle>
      <AlertDescription>
        {<ExampleText>Please try again. If the problem persists, contact support. </ExampleText>}</AlertDescription>
    </Alert>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
