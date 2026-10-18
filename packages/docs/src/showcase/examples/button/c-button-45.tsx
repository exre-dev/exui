
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Badge } from "@exre/exui"

import { Button } from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Button variant="outline" className="gap-2" aria-label={copyExample("Messages (12)")}>
      {<ExampleText>Messages </ExampleText>}<Badge variant="destructive-outline" size="sm" aria-hidden="true">
        12
      </Badge>
    </Button>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
