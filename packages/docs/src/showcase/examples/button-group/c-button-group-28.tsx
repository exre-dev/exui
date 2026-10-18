"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { MinusIcon, PlusIcon } from "lucide-react"

import { useState } from "react"

import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [volume, setVolume] = useState(50)
  const [isMuted, setIsMuted] = useState(false)

  const increaseVolume = () => {
    setVolume((prev) => Math.min(prev + 5, 100))
    setIsMuted(false)
  }

  const decreaseVolume = () => {
    setVolume((prev) => {
      const next = Math.max(prev - 5, 0)
      if (next === 0) setIsMuted(true)
      return next
    })
  }

  const toggleMute = () => {
    setIsMuted((prev) => !prev)
  }

  return (
    <ButtonGroup>
      <Button
        onClick={decreaseVolume}
        size="sm"
        variant="outline"
        aria-label={copyExample("Decrease Volume")}
      >
        <MinusIcon aria-hidden="true" />
      </Button>
      <Button
        onClick={toggleMute}
        size="sm"
        variant="outline"
        className="min-w-20"
      >
        {<ExampleText>{isMuted ? "Muted" : `${volume}%`}</ExampleText>}
      </Button>
      <Button
        onClick={increaseVolume}
        size="sm"
        variant="outline"
        aria-label={copyExample("Increase Volume")}
      >
        <PlusIcon aria-hidden="true" />
      </Button>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
