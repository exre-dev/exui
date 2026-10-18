
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Card, CardContent } from "@exre/exui"
import { Spinner } from "@exre/exui"

  function OriginalPattern() {
  return (
    <Card className="relative w-full max-w-xs">
      <CardContent className="space-y-3 p-4">
        <h3 className="text-sm font-semibold">{<ExampleText>Dashboard Overview</ExampleText>}</h3>
        <p className="text-muted-foreground text-sm">
          {<ExampleText>Monthly revenue and user statistics for the current period. </ExampleText>}</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-md border p-3">
            <p className="text-muted-foreground text-xs">{<ExampleText>Revenue</ExampleText>}</p>
            <p className="text-lg font-bold">$12,450</p>
          </div>
          <div className="rounded-md border p-3">
            <p className="text-muted-foreground text-xs">{<ExampleText>Users</ExampleText>}</p>
            <p className="text-lg font-bold">1,234</p>
          </div>
        </div>
      </CardContent>

      {/* Overlay */}
      <Card className="bg-background/80 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-xs">
        <CardContent className="flex grow flex-col items-center justify-center gap-2">
          <Spinner className="size-4 opacity-60" />
        </CardContent>
      </Card>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
