
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ArrowUpRightIcon } from "lucide-react"

import { Button } from "@exre/exui"


  function OriginalPattern() {
  return (
    <Button variant="link" className="group/link-button">
      {<ExampleText>View Documentation </ExampleText>}<ArrowUpRightIcon aria-hidden="true" className="transition-transform group-hover/link-button:rotate-45" />
    </Button>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
