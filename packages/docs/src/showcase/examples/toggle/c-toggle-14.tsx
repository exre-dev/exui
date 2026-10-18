"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { Volume2Icon, VolumeOffIcon } from "lucide-react"

import { useState } from "react"

import { Toggle } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [muted, setMuted] = useState(false)

  return (
    <div className="flex items-center justify-center">
      <Toggle
        size="lg"
        variant="outline"
        aria-label={copyExample("Toggle mute")}
        pressed={muted}
        onPressedChange={setMuted}
      >
        {<ExampleText>{muted ? (
          <VolumeOffIcon  />
        ) : (
          <Volume2Icon  />
        )}</ExampleText>}
        {<ExampleText>{muted ? "Muted" : "Sound"}</ExampleText>}
      </Toggle>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
