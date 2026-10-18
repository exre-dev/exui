
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { AlertTriangleIcon } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@exre/exui"



  function OriginalPattern() {
  return (
    <Alert variant="warning">
      <AlertTriangleIcon  />
      <AlertTitle>{<ExampleText>Warning! Something is wrong</ExampleText>}</AlertTitle>
      <AlertDescription>
        {<ExampleText>Please check your settings. If the problem persists, contact support. </ExampleText>}</AlertDescription>
    </Alert>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
