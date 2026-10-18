
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Badge } from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex items-center gap-2.5">
      <Badge size="sm">{<ExampleText>Small</ExampleText>}</Badge>
      <Badge size="default">{<ExampleText>Default</ExampleText>}</Badge>
      <Badge size="lg">{<ExampleText>Large</ExampleText>}</Badge>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
