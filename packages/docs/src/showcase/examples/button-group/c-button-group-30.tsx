
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { StarIcon } from "lucide-react"

import { Button } from "@exre/exui"
import {
  ButtonGroup,
  ButtonGroupText,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <ButtonGroup>
      <Button
        size="sm"
        variant="default"
        aria-label={copyExample("Star")}
        className="border-primary"
      >
        <StarIcon aria-hidden="true" />
        {<ExampleText>Star </ExampleText>}</Button>
      <ButtonGroupText className="border-primary">{<ExampleText>2.4k</ExampleText>}</ButtonGroupText>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
