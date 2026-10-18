"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BookmarkIcon, HeartIcon, Repeat2Icon, Share2Icon } from "lucide-react"

import { useState } from "react"

import { Toggle } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [liked, setLiked] = useState(false)
  const [retweeted, setRetweeted] = useState(false)
  const [shared, setShared] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Toggle
        variant="outline"
        aria-label={copyExample("Like")}
        pressed={liked}
        onPressedChange={setLiked}
      >
        <HeartIcon  />
        {<ExampleText>{liked ? 13 : 12}</ExampleText>}
      </Toggle>
      <Toggle
        variant="outline"
        aria-label={copyExample("Retweet")}
        pressed={retweeted}
        onPressedChange={setRetweeted}
      >
        <Repeat2Icon  />
        {<ExampleText>{retweeted ? 6 : 5}</ExampleText>}
      </Toggle>
      <Toggle
        variant="outline"
        aria-label={copyExample("Share")}
        pressed={shared}
        onPressedChange={setShared}
      >
        <Share2Icon  />
        {<ExampleText>{shared ? 4 : 3}</ExampleText>}
      </Toggle>
      <Toggle
        variant="outline"
        aria-label={copyExample("Bookmark")}
        pressed={bookmarked}
        onPressedChange={setBookmarked}
      >
        <BookmarkIcon  />
        {<ExampleText>{bookmarked ? 9 : 8}</ExampleText>}
      </Toggle>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
