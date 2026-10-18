
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ZapIcon } from "lucide-react"

import { Button } from "@exre/exui"


  function OriginalPattern() {
  return (
    <Button size="lg">
      <ZapIcon aria-hidden="true" />
      {<ExampleText>Upgrade Now </ExampleText>}</Button>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
