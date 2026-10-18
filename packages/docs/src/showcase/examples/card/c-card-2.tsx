
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@exre/exui"

  function OriginalPattern() {
  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="border-b">
        <CardTitle>{<ExampleText>Header with Border</ExampleText>}</CardTitle>
        <CardDescription>
          {<ExampleText>This is a card with a header that has a bottom border. </ExampleText>}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          {<ExampleText>The header has a border-b class applied, creating a visual separation between the header and content sections. </ExampleText>}</p>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
