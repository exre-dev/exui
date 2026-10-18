
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Card, CardContent, CardHeader } from "@exre/exui"
import { Skeleton } from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="mx-auto grid w-full max-w-lg grid-cols-3 gap-4">
      {<ExampleText>{Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-3 w-16" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      ))}</ExampleText>}
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
