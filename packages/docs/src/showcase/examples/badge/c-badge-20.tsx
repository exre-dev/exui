
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon } from "lucide-react"

import { Badge } from "@exre/exui"



  function OriginalPattern() {
  return (
    <Badge variant="outline">
      <CheckIcon  />
      {<ExampleText>Badge </ExampleText>}</Badge>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
