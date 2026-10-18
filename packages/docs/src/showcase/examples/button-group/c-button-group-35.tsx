
import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()
  return (
    <ButtonGroup>
      <Button aria-label={copyExample("Previous")} variant="outline" size="icon">
        <ChevronLeftIcon aria-hidden="true" />
      </Button>
      <Button variant="outline" size="icon">
        1
      </Button>
      <Button variant="outline" size="icon">
        2
      </Button>
      <Button variant="default" size="icon" className="border-primary border">
        3
      </Button>
      <Button variant="outline" size="icon">
        4
      </Button>
      <Button variant="outline" size="icon">
        5
      </Button>
      <Button aria-label={copyExample("Next")} variant="outline" size="icon">
        <ChevronRightIcon aria-hidden="true" />
      </Button>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
