
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Rating } from "@exre/exui"

import { Progress } from "@exre/exui"
import { Separator } from "@exre/exui"

const distribution = [
  { stars: 5, count: 124, percentage: 62 },
  { stars: 4, count: 45, percentage: 22 },
  { stars: 3, count: 18, percentage: 9 },
  { stars: 2, count: 8, percentage: 4 },
  { stars: 1, count: 5, percentage: 3 },
]

  function OriginalPattern() {
  return (
    <div className="mx-auto w-full max-w-xs space-y-4">
      <div className="flex flex-col items-center gap-2">
        <span className="text-3xl font-semibold">4.6</span>
        <Rating rating={4.6} size="sm" />
        <span className="text-muted-foreground text-xs">
          {<ExampleText>Based on 200 reviews </ExampleText>}</span>
      </div>
      <Separator />
      <div className="space-y-2">
        {<ExampleText>{distribution.map((row) => (
          <div key={row.stars} className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground w-3 text-right text-xs">
              {<ExampleText>{row.stars}</ExampleText>}
            </span>
            <Progress
              value={row.percentage}
              className="h-1.5 flex-1 **:data-[slot=progress-indicator]:bg-yellow-400"
            />
            <span className="text-muted-foreground w-7 text-right text-xs">
              {<ExampleText>{row.count}</ExampleText>}
            </span>
          </div>
        ))}</ExampleText>}
      </div>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
