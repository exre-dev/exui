
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
    <Alert variant="invert">
      <CircleAlertIcon className="text-success" />
      <AlertTitle>{<ExampleText>Notification! All good</ExampleText>}</AlertTitle>
      <AlertDescription>
        {<ExampleText>This is a notification alert with a title and description. </ExampleText>}</AlertDescription>
    </Alert>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
