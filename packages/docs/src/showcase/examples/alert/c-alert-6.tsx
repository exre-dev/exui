
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CircleCheckIcon } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@exre/exui"



  function OriginalPattern() {
  return (
    <Alert variant="success">
      <CircleCheckIcon  />
      <AlertTitle>{<ExampleText>Success! All good</ExampleText>}</AlertTitle>
      <AlertDescription>
        {<ExampleText>Everything is working as expected. You can continue with your task. </ExampleText>}</AlertDescription>
    </Alert>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
