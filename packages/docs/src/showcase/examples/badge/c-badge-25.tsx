
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Badge } from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Badge variant="outline">
      <img
        src="/examples/reui/flags/us.svg"
        alt={copyExample("US")}
        width={18}
        height={18}
        className="rounded-xs"
      />
      {<ExampleText>USA </ExampleText>}</Badge>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
