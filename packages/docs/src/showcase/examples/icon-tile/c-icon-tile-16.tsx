
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CircleCheckIcon } from "lucide-react"

import { IconTile } from "@exre/exui"



// The `solid` variant is a filled tone with a contrasting glyph. Override the
// fill with a `bg-*` class plus a readable text color. An empty class keeps the
// primary default.
const tones = [
  "",
  "bg-info text-white",
  "bg-success text-white",
  "bg-warning text-white",
  "bg-destructive text-white",
]

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center gap-4">
      {<ExampleText>{tones.map((tone) => (
        <IconTile
          key={tone || "primary"}
          variant="solid"
          className={tone}
          aria-hidden="true"
        >
          <CircleCheckIcon  />
        </IconTile>
      ))}</ExampleText>}
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
