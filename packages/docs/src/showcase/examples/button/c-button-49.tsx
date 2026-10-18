
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronLeftIcon } from "lucide-react"

import { Button } from "@exre/exui"


  function OriginalPattern() {
  return (
    <Button variant="link" asChild>
      <a onClick={(event) => event.preventDefault()} href="#">
        <ChevronLeftIcon data-icon="inline-start" aria-hidden="true" />
        {<ExampleText>Go back </ExampleText>}</a>
    </Button>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
