"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { MinusIcon, PlusIcon } from "lucide-react"

import { useState } from "react"

import { Button } from "@exre/exui"
import {
  ButtonGroup,
  ButtonGroupText,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [zoom, setZoom] = useState(100)

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 10))
  }

  return (
    <ButtonGroup>
      <Button
        variant="outline"
        size="icon"
        aria-label={copyExample("Zoom out")}
        onClick={handleZoomOut}
      >
        <MinusIcon aria-hidden="true" />
      </Button>
      <ButtonGroupText className="w-16 justify-center">{<ExampleText>{zoom}</ExampleText>}%</ButtonGroupText>
      <Button
        variant="outline"
        size="icon"
        aria-label={copyExample("Zoom in")}
        onClick={handleZoomIn}
      >
        <PlusIcon aria-hidden="true" />
      </Button>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
