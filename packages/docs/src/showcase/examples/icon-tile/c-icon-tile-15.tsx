
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { StarIcon } from "lucide-react"

import { IconTile } from "@exre/exui"



// The `soft` variant derives every fill and border from currentColor, so one
// text color class retints the whole tile. An empty class keeps the primary
// default. The tones pair a readable light-mode foreground with the brighter
// dark-mode token, matching the ReUI badge light variants.
const tones = [
  "",
  "text-info-foreground dark:text-info",
  "text-success-foreground dark:text-success",
  "text-warning-foreground dark:text-warning",
  "text-destructive-foreground dark:text-destructive",
]

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center gap-4">
      {<ExampleText>{tones.map((tone) => (
        <IconTile
          key={tone || "primary"}
          variant="soft"
          className={tone}
          aria-hidden="true"
        >
          <StarIcon  />
        </IconTile>
      ))}</ExampleText>}
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
