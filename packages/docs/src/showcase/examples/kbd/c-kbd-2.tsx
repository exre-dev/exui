
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Kbd, KbdGroup } from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <KbdGroup>
        <Kbd>{<ExampleText>Ctrl</ExampleText>}</Kbd>
        <Kbd>{<ExampleText>Shift</ExampleText>}</Kbd>
        <Kbd>{<ExampleText>P</ExampleText>}</Kbd>
      </KbdGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
