
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { LogOutIcon } from "lucide-react"

import { Button } from "@exre/exui"


  function OriginalPattern() {
  return (
    <Button variant="ghost">
      {<ExampleText>Logout </ExampleText>}<LogOutIcon aria-hidden="true" />
    </Button>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
