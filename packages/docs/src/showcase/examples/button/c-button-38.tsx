
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { StarIcon } from "lucide-react"

import { Button } from "@exre/exui"


  function OriginalPattern() {
  return (
    <Button className="pe-0" variant="outline">
      <StarIcon aria-hidden="true" />
      {<ExampleText>Star </ExampleText>}<span className="text-muted-foreground before:bg-border relative ms-1 px-2 text-xs font-medium before:absolute before:inset-0 before:left-0 before:w-px">
        589
      </span>
    </Button>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
