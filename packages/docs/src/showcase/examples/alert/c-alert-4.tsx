
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
      <AlertTitle>{<ExampleText>Payment Failed</ExampleText>}</AlertTitle>
      <AlertDescription>
        <p>{<ExampleText>Please check your payment details:</ExampleText>}</p>
        <ul className="mt-1 list-inside list-disc space-y-0.5 text-sm">
          <li>{<ExampleText>Card number and expiry</ExampleText>}</li>
          <li>{<ExampleText>Billing address</ExampleText>}</li>
          <li>{<ExampleText>Available funds</ExampleText>}</li>
        </ul>
      </AlertDescription>
    </Alert>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
