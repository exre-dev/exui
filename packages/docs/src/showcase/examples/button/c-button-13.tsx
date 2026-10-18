
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import { Spinner } from "@exre/exui"

  function OriginalPattern() {
  return (
    <Button disabled>
      <Spinner aria-hidden="true" />
      {<ExampleText>Please wait </ExampleText>}</Button>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
