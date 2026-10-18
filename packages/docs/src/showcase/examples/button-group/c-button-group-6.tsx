
import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { FlipHorizontalIcon, FlipVerticalIcon, RotateCwIcon } from "lucide-react"

import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()
  return (
    <ButtonGroup>
      <Button aria-label={copyExample("Flip horizontal")} variant="outline" size="icon">
        <FlipHorizontalIcon aria-hidden="true" />
      </Button>
      <Button aria-label={copyExample("Flip vertical")} variant="outline" size="icon">
        <FlipVerticalIcon aria-hidden="true" />
      </Button>
      <Button aria-label={copyExample("Rotate clockwise")} variant="outline" size="icon">
        <RotateCwIcon aria-hidden="true" />
      </Button>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
