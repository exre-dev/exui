"use client"


import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"
import { Rating } from "@exre/exui"


  function OriginalPattern() {
  const {format: formatExample,  toast } = useExampleRuntime()

  const [productRating, setProductRating] = useState(0)

  const handleRatingChange = (rating: number) => {
    setProductRating(rating)

    toast.success("Rated {rating} out of 5", {
      description: formatExample("Rated {rating} out of 5", { rating: rating }),
    })
  }

  return (
    <div className="space-y-8">
      <Rating
        rating={productRating}
        editable={true}
        onRatingChange={handleRatingChange}
        showValue={true}
      />
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
