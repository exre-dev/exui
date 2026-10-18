
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@exre/exui"
import { Spinner } from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="relative w-full max-w-xs overflow-hidden">
      {/* Card */}
      <Card>
        <CardHeader>
          <CardTitle>{<ExampleText>Monthly Report</ExampleText>}</CardTitle>
          <CardDescription>{<ExampleText>Revenue and growth metrics.</ExampleText>}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{<ExampleText>Revenue</ExampleText>}</span>
            <span className="font-medium">$12,450</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{<ExampleText>Growth</ExampleText>}</span>
            <span className="font-medium">+18.2%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{<ExampleText>Users</ExampleText>}</span>
            <span className="font-medium">1,248</span>
          </div>
        </CardContent>
      </Card>

      {/* Overlay */}
      <Card className="bg-background/80 absolute inset-0 z-10 backdrop-blur-xs">
        <CardContent className="flex grow flex-col items-center justify-center gap-2">
          <Spinner className="size-5 opacity-60" />
          <span className="text-muted-foreground text-sm">
            {<ExampleText>Refreshing data... </ExampleText>}</span>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
