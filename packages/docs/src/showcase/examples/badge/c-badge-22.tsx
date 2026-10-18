
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Badge } from "@exre/exui"

  function OriginalPattern() {
  return (
    <Badge variant="info-light">
      <span className="ms-0.25 size-1.25 rounded-full! bg-[currentColor]" />{<ExampleText>{" "}</ExampleText>}
      {<ExampleText>Badge </ExampleText>}</Badge>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
