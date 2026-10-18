"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BookmarkCheckIcon, BookmarkIcon } from "lucide-react"

import { useState } from "react"

import { Toggle } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [pressed, setPressed] = useState(false)

  return (
    <div className="flex items-center justify-center">
      <Toggle
        variant="outline"
        aria-label={copyExample("Toggle bookmark")}
        pressed={pressed}
        onPressedChange={setPressed}
      >
        {<ExampleText>{pressed ? (
          <BookmarkCheckIcon className="fill-current" />
        ) : (
          <BookmarkIcon  />
        )}</ExampleText>}
        {<ExampleText>{pressed ? "Bookmarked" : "Bookmark"}</ExampleText>}
      </Toggle>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
