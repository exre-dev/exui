
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { HeartIcon } from "lucide-react"

import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"


  function OriginalPattern() {
  return (
    <ButtonGroup>
      <Button variant="outline">
        <HeartIcon aria-hidden="true" />
        {<ExampleText>Like </ExampleText>}</Button>
      <Button variant="outline" className="w-12" asChild>
        <span>{<ExampleText>1.2K</ExampleText>}</span>
      </Button>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
