"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BellIcon } from "lucide-react"

import { useState } from "react"
import { Badge } from "@exre/exui"

import { Toggle } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [pressed, setPressed] = useState(false)

  return (
    <div className="flex items-center justify-center">
      <Toggle
        aria-label={copyExample("Toggle notifications")}
        pressed={pressed}
        onPressedChange={setPressed}
      >
        <div className="relative">
          <BellIcon  />
          {<ExampleText>{!pressed && (
            <Badge
              variant="destructive"
              size="xs"
              className="absolute -top-2 -right-2 rounded-full!"
            >
              3
            </Badge>
          )}</ExampleText>}
        </div>
      </Toggle>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
