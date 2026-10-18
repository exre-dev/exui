"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"

import { cn } from "@exre/exui"
import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"

  function OriginalPattern() {
  const [rating, setRating] = useState<number | null>(null)

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">{<ExampleText>How likely are you to recommend us?</ExampleText>}</p>
      <ButtonGroup>
        {<ExampleText>{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <Button
            key={n}
            variant="outline"
            size="icon-sm"
            onClick={() => setRating(n)}
            className={cn(
              rating === n &&
                "bg-primary hover:bg-primary hover:text-primary-foreground hover:border-primary text-primary-foreground border-primary"
            )}
          >
            {<ExampleText>{n}</ExampleText>}
          </Button>
        ))}</ExampleText>}
      </ButtonGroup>
      <div className="text-muted-foreground flex justify-between text-xs">
        <span>{<ExampleText>Not likely</ExampleText>}</span>
        <span>{<ExampleText>Very likely</ExampleText>}</span>
      </div>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
