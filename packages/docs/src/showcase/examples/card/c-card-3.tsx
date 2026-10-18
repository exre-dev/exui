
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@exre/exui"

  function OriginalPattern() {
  return (
    <Card className="w-full max-w-xs gap-0 p-0">
      <CardHeader className="flex items-center justify-between px-4 py-2">
        <CardTitle>{<ExampleText>Header</ExampleText>}</CardTitle>
        <CardAction>
          <Button variant="outline" className="w-full">
            {<ExampleText>Action </ExampleText>}</Button>
        </CardAction>
      </CardHeader>
      <CardContent className="border-y px-4 py-3">
        <p>
          {<ExampleText>The footer has a border-t class applied, creating a visual separation between the content and footer sections. </ExampleText>}</p>
      </CardContent>
      <CardFooter className="border-none px-4 py-3">
        <Button variant="outline" className="w-full">
          {<ExampleText>Action </ExampleText>}</Button>
      </CardFooter>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
