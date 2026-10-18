
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
    <div className="relative size-fit">
      {/* Card */}
      <Card className="relative z-1 w-full max-w-xs">
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
      {/* Depth effect */}
      <div className="bg-card rounded-4xl absolute inset-4 -bottom-3 z-0 border shadow-md shadow-black/1" />
      <div className="bg-card rounded-4xl absolute inset-2 -bottom-1.5 z-0 border shadow-md shadow-black/1" />
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
