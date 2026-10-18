
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
    <Alert variant="info">
      <CircleAlertIcon  />
      <AlertTitle>{<ExampleText>Info! Something important</ExampleText>}</AlertTitle>
      <AlertDescription>
        {<ExampleText>This is an important message. Please read it carefully. </ExampleText>}</AlertDescription>
    </Alert>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
