
import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()
  return (
    <ButtonGroup>
      <ButtonGroup>
        <Button aria-label={copyExample("Previous page")} variant="outline" size="icon-sm">
          <ArrowLeftIcon aria-hidden="true" />
        </Button>
        <Button variant="outline" size="sm">
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          3
        </Button>
        <Button aria-label={copyExample("Next page")} variant="outline" size="icon-sm">
          <ArrowRightIcon aria-hidden="true" />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
