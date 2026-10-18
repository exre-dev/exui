"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { HeartIcon } from "lucide-react"

import { useState } from "react"

import { Toggle } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [pressed, setPressed] = useState(false)

  return (
    <div className="flex items-center justify-center">
      <Toggle
        aria-label={copyExample("Toggle favorite")}
        pressed={pressed}
        onPressedChange={setPressed}
      >
        {<ExampleText>{pressed ? (
          <HeartIcon className="fill-current" />
        ) : (
          <HeartIcon  />
        )}</ExampleText>}
      </Toggle>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
