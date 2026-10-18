
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"

  function OriginalPattern() {
  return (
    <Button variant="outline" aria-invalid="true">
      {<ExampleText>Invalid Outline </ExampleText>}</Button>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
