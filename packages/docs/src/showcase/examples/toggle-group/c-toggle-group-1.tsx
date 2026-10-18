
import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <ToggleGroup type="multiple" spacing={1}>
        <ToggleGroupItem value="bold" aria-label={copyExample("Toggle bold")}>
          <BoldIcon  />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label={copyExample("Toggle italic")}>
          <ItalicIcon  />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label={copyExample("Toggle underline")}>
          <UnderlineIcon  />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
