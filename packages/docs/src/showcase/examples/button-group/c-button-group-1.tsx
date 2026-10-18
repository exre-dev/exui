
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"

  function OriginalPattern() {
  return (
    <ButtonGroup>
      <Button variant="outline">{<ExampleText>Button</ExampleText>}</Button>
      <Button variant="outline">{<ExampleText>Another Button</ExampleText>}</Button>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
