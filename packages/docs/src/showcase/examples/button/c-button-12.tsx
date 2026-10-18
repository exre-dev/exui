
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@exre/exui"


  function OriginalPattern() {
  return (
    <Button>
      {<ExampleText>Get Started </ExampleText>}<ArrowRightIcon aria-hidden="true" />
    </Button>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
