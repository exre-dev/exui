
import { ExampleRuntimeProvider } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { LayoutDashboardIcon } from "lucide-react"

import { IconTile } from "@exre/exui"



  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <IconTile variant="frame" aria-hidden="true">
        <LayoutDashboardIcon  />
      </IconTile>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
