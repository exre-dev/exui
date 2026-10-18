
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { SendIcon } from "lucide-react"

import { Button } from "@exre/exui"


  function OriginalPattern() {
  return (
    <Button size="lg">
      {<ExampleText>Send Message </ExampleText>}<SendIcon aria-hidden="true" />
    </Button>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
