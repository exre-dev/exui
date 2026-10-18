
import { ExampleRuntimeProvider } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CircleCheckIcon, GlobeIcon, StarIcon } from "lucide-react"

import { IconTile } from "@exre/exui"



  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center gap-4">
      <IconTile variant="outline" size="lg" radius="full" aria-hidden="true">
        <GlobeIcon  />
      </IconTile>
      <IconTile variant="elevated" size="lg" radius="full" aria-hidden="true">
        <StarIcon  />
      </IconTile>
      <IconTile variant="frame" size="lg" radius="full" aria-hidden="true">
        <CircleCheckIcon  />
      </IconTile>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
