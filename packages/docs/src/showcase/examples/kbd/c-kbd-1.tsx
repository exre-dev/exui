
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Kbd } from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center gap-2">
      <Kbd>{<ExampleText>Ctrl</ExampleText>}</Kbd>
      <Kbd>{<ExampleText>⌘K</ExampleText>}</Kbd>
      <Kbd>{<ExampleText>Ctrl + B</ExampleText>}</Kbd>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
