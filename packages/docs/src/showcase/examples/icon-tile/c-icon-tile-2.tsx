
import { ExampleRuntimeProvider } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { PackageIcon } from "lucide-react"

import { IconTile } from "@exre/exui"



  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <IconTile variant="elevated" aria-hidden="true">
        <PackageIcon  />
      </IconTile>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
