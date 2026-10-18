
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Badge } from "@exre/exui"

import { Button } from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Button aria-label={copyExample("Updates (new)")}>
      {<ExampleText>Updates </ExampleText>}<Badge variant="success" size="xs" aria-hidden="true">
        {<ExampleText>New </ExampleText>}</Badge>
    </Button>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
