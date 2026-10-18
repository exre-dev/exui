
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Marker, MarkerContent } from "@exre/exui"

// The rows sit on a wide gap because the border variant already draws its own
// pb-2 under itself. On a tight gap the three shapes stop reading as three
// separate variants and read as one block.
  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
      <Marker>
        <MarkerContent>{<ExampleText>Read 14 files under src/billing</ExampleText>}</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>{<ExampleText>Planning</ExampleText>}</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerContent>{<ExampleText>Wrote 3 files, 128 lines changed</ExampleText>}</MarkerContent>
      </Marker>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
