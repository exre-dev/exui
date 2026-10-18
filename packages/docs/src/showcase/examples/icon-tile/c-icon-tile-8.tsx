
import { ExampleRuntimeProvider } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CircleAlertIcon, CircleCheckIcon, ClockIcon, StarIcon } from "lucide-react"

import { IconTile } from "@exre/exui"



  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center gap-3">
      <IconTile
        aria-hidden="true"
        className="border-primary/10 bg-primary/10 text-primary dark:border-primary/25 dark:bg-primary/15"
      >
        <StarIcon  />
      </IconTile>
      <IconTile
        aria-hidden="true"
        className="border-success/15 bg-success/10 text-success-foreground dark:border-success/25 dark:bg-success/15 dark:text-success"
      >
        <CircleCheckIcon  />
      </IconTile>
      <IconTile
        aria-hidden="true"
        className="border-warning/15 bg-warning/10 text-warning-foreground dark:border-warning/25 dark:bg-warning/15 dark:text-warning"
      >
        <ClockIcon  />
      </IconTile>
      <IconTile
        aria-hidden="true"
        className="border-destructive/15 bg-destructive/10 text-destructive-foreground dark:border-destructive/25 dark:bg-destructive/15 dark:text-destructive"
      >
        <CircleAlertIcon  />
      </IconTile>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
