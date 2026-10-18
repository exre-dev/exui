
import { ExampleRuntimeProvider } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { LayersIcon } from "lucide-react"

import { IconStack } from "@exre/exui"



  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <IconStack aria-hidden="true">
        <LayersIcon className="size-4" />
      </IconStack>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
