
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { XIcon } from "lucide-react"

import { Badge } from "@exre/exui"

import { Button } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()
  return (
    <Badge variant="outline" className="gap-0.5">
      {<ExampleText>Badge </ExampleText>}<Button aria-label={copyExample("Remove badge")}
        variant="ghost"
        size="icon"
        className="size-3 hover:bg-transparent"
      >
        <XIcon  />
      </Button>
    </Badge>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
