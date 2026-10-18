
import { ExampleRuntimeProvider } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Card, CardContent, CardHeader } from "@exre/exui"
import { Skeleton } from "@exre/exui"

  function OriginalPattern() {
  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="gap-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-video w-full rounded-md" />
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
