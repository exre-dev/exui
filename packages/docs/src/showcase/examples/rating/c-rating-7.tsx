"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"
import { Rating } from "@exre/exui"

  function OriginalPattern() {
  const [rating, setRating] = useState(3.5)

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col items-center gap-4">
      <Rating rating={rating} onRatingChange={setRating} editable />
      <p className="text-muted-foreground text-sm">
        {<ExampleText>Your rating:</ExampleText>}{<ExampleText>{" "}</ExampleText>}
        <span className="text-foreground font-semibold">
          {<ExampleText>{rating.toFixed(1)}</ExampleText>}
        </span>{<ExampleText>{" "}</ExampleText>}
        / 5
      </p>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
