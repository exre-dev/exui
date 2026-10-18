
import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"

import { Toggle } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Toggle aria-label={copyExample("Toggle bold")} defaultPressed>
        <BoldIcon  />
      </Toggle>
      <Toggle aria-label={copyExample("Toggle italic")}>
        <ItalicIcon  />
      </Toggle>
      <Toggle aria-label={copyExample("Toggle underline")}>
        <UnderlineIcon  />
      </Toggle>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
