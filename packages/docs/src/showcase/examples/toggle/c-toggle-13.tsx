
import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BoldIcon, ItalicIcon, StrikethroughIcon, UnderlineIcon } from "lucide-react"

import { Toggle } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Toggle aria-label={copyExample("Enabled default")}>
        <BoldIcon  />
      </Toggle>
      <Toggle variant="outline" aria-label={copyExample("Enabled outline")}>
        <ItalicIcon  />
      </Toggle>
      <Toggle disabled aria-label={copyExample("Disabled default")}>
        <UnderlineIcon  />
      </Toggle>
      <Toggle variant="outline" disabled aria-label={copyExample("Disabled outline")}>
        <StrikethroughIcon  />
      </Toggle>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
