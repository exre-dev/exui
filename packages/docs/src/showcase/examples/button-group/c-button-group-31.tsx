
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { Share2Icon } from "lucide-react"

import { Button } from "@exre/exui"
import {
  ButtonGroup,
  ButtonGroupText,
} from "@exre/exui"


  function OriginalPattern() {
  return (
    <ButtonGroup>
      <Button size="sm" className="border-primary">
        <Share2Icon  />
        {<ExampleText>Share </ExampleText>}</Button>
      <ButtonGroupText className="text-muted-foreground bg-transparent px-2">
        {<ExampleText>128 Shares </ExampleText>}</ButtonGroupText>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
