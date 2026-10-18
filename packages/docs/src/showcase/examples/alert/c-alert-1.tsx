
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@exre/exui"

  function OriginalPattern() {
  return (
    <Alert>
      <AlertTitle>{<ExampleText>Alert!</ExampleText>}</AlertTitle>
      <AlertDescription>
        {<ExampleText>This is an alert with a title and description. </ExampleText>}</AlertDescription>
    </Alert>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
