
import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { PlayIcon, SkipBackIcon, SkipForwardIcon } from "lucide-react"

import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <ButtonGroup>
      <Button variant="outline" size="icon" aria-label={copyExample("Skip back")}>
        <SkipBackIcon aria-hidden="true" />
      </Button>
      <Button variant="outline" size="icon" aria-label={copyExample("Play")}>
        <PlayIcon aria-hidden="true" />
      </Button>
      <Button variant="outline" size="icon" aria-label={copyExample("Skip forward")}>
        <SkipForwardIcon aria-hidden="true" />
      </Button>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
