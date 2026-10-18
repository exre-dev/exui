
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { IconTile } from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center gap-3">
      <IconTile variant="elevated" className="text-xs font-medium">
        {<ExampleText>AK </ExampleText>}</IconTile>
      <IconTile
        variant="outline"
        radius="full"
        className="text-muted-foreground text-xs font-medium"
      >
        12
      </IconTile>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
