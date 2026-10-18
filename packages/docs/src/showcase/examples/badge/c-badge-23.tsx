
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Badge } from "@exre/exui"

  function OriginalPattern() {
  return (
    <Badge variant="outline" asChild>
      <a onClick={(event) => event.preventDefault()} href="#">{<ExampleText>Badge</ExampleText>}</a>
    </Badge>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
