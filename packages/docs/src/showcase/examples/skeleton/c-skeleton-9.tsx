
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Card, CardContent, CardHeader } from "@exre/exui"
import { Separator } from "@exre/exui"
import { Skeleton } from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="mx-auto w-full max-w-xs space-y-6">
      {/* Profile header */}
      <Card>
        <CardHeader className="items-center gap-3">
          <Skeleton className="size-20 rounded-full" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-48" />
        </CardHeader>
        <CardContent className="flex justify-center gap-8">
          {<ExampleText>{Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <Skeleton className="h-5 w-10" />
              <Skeleton className="h-3 w-14" />
            </div>
          ))}</ExampleText>}
        </CardContent>
      </Card>

      {/* Details section */}
      <Card>
        <CardContent className="space-y-4 pt-4">
          <Skeleton className="h-4 w-24" />
          <Separator />
          {<ExampleText>{Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}</ExampleText>}
        </CardContent>
      </Card>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
