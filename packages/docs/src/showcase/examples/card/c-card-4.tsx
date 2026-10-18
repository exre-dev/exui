
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

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
    <Card className="w-full max-w-xs">
      <CardHeader className="border-b">
        <CardTitle>{<ExampleText>Header with Border</ExampleText>}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          {<ExampleText>The footer has a border-t class applied, creating a visual separation between the content and footer sections. </ExampleText>}</p>
      </CardContent>
      <CardFooter className="border-t">
        <Button variant="outline" className="w-full">
          {<ExampleText>Action </ExampleText>}</Button>
      </CardFooter>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
