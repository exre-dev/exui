
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ExternalLinkIcon } from "lucide-react"

import { Button } from "@exre/exui"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@exre/exui"


  function OriginalPattern() {
  return (
    <Card className="w-full max-w-xs gap-2 pt-5">
      <CardHeader>
        <CardTitle>{<ExampleText>Need a help in Claim?</ExampleText>}</CardTitle>
      </CardHeader>
      <CardContent className="mb-2">
        <p>
          {<ExampleText>Go to this step by step guideline process on how to certify for your weekly benefits: </ExampleText>}</p>
      </CardContent>
      <CardFooter className="py-2">
        <Button variant="link" className="px-0">
          {<ExampleText>See our guideline </ExampleText>}<ExternalLinkIcon aria-hidden="true" />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
