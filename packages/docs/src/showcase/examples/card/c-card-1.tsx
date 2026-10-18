
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@exre/exui"

  function OriginalPattern() {
  return (
    <Card className="w-full max-w-xs">
      <CardHeader>
        <CardTitle>{<ExampleText>Default Card</ExampleText>}</CardTitle>
        <CardDescription>
          {<ExampleText>This card uses the default size variant. </ExampleText>}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          {<ExampleText>The card component supports a size prop that defaults to "default" for standard spacing and sizing. </ExampleText>}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          {<ExampleText>Action </ExampleText>}</Button>
      </CardFooter>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
