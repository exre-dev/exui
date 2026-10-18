
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronLeftIcon } from "lucide-react"

import { Button } from "@exre/exui"


  function OriginalPattern() {
  return (
    <Button variant="link" className="group/back-button" asChild>
      <a onClick={(event) => event.preventDefault()} href="#">
        <ChevronLeftIcon data-icon="inline-start" aria-hidden="true" className="transition-transform duration-200 group-hover/back-button:-translate-x-1" />
        {<ExampleText>Go back </ExampleText>}</a>
    </Button>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
