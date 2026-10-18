
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { UserPlusIcon } from "lucide-react"

import { Button } from "@exre/exui"
import {
  ButtonGroup,
  ButtonGroupText,
} from "@exre/exui"


  function OriginalPattern() {
  return (
    <ButtonGroup>
      <Button size="sm" variant="outline">
        <UserPlusIcon aria-hidden="true" />
        {<ExampleText>Follow </ExampleText>}</Button>
      <ButtonGroupText className="text-muted-foreground">
        {<ExampleText>2.4k followers </ExampleText>}</ButtonGroupText>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
