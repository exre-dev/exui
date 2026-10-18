"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"
import { Rating } from "@exre/exui"

import { Button } from "@exre/exui"
import { Card, CardContent } from "@exre/exui"
import { Label } from "@exre/exui"
import { Textarea } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")

  return (
    <Card className="mx-auto w-full max-w-xs">
      <CardContent className="space-y-5">
        <div className="flex flex-col items-center gap-3">
          <h3 className="text-sm font-semibold">{<ExampleText>Write a Review</ExampleText>}</h3>
          <Rating rating={rating} onRatingChange={setRating} editable />
          {<ExampleText>{rating > 0 && (
            <p className="text-muted-foreground text-xs">
              {<ExampleText>{rating <= 2
                ? "We're sorry to hear that"
                : rating <= 3
                  ? "Thanks for your feedback"
                  : "Glad you enjoyed it!"}</ExampleText>}
            </p>
          )}</ExampleText>}
        </div>

        <div className="space-y-2">
          <Label htmlFor={exampleId("review-text")} className="text-sm">
            {<ExampleText>Your review </ExampleText>}</Label>
          <Textarea
            id={exampleId("review-text")}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder={copyExample("Tell us what you think...")}
            rows={3}
          />
        </div>

        <Button disabled={rating === 0} size="sm" className="w-full">
          {<ExampleText>Submit Review </ExampleText>}</Button>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
