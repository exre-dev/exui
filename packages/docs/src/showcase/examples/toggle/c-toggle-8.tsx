
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { StarIcon } from "lucide-react"

import { Toggle } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground w-16 text-sm">{<ExampleText>Small</ExampleText>}</span>
        <Toggle variant="outline" size="sm" aria-label={copyExample("Toggle star small")}>
          <StarIcon  />
        </Toggle>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground w-16 text-sm">{<ExampleText>Default</ExampleText>}</span>
        <Toggle
          variant="outline"
          size="default"
          aria-label={copyExample("Toggle star default")}
        >
          <StarIcon  />
        </Toggle>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground w-16 text-sm">{<ExampleText>Large</ExampleText>}</span>
        <Toggle variant="outline" size="lg" aria-label={copyExample("Toggle star large")}>
          <StarIcon  />
        </Toggle>
      </div>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
