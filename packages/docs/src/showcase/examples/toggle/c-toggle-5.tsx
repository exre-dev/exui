
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Toggle } from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Toggle aria-label={copyExample("Disabled toggle")} disabled>
        {<ExampleText>Disabled </ExampleText>}</Toggle>
      <Toggle variant="outline" aria-label={copyExample("Disabled outline toggle")} disabled>
        {<ExampleText>Disabled </ExampleText>}</Toggle>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
