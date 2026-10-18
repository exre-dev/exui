
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { PackageIcon } from "lucide-react"

import { IconTile } from "@exre/exui"



const sizes = ["xs", "sm", "default", "lg", "xl"] as const

  function OriginalPattern() {
  return (
    <div className="flex items-end justify-center gap-4">
      {<ExampleText>{sizes.map((size) => (
        <IconTile key={size} variant="elevated" size={size} aria-hidden="true">
          <PackageIcon  />
        </IconTile>
      ))}</ExampleText>}
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
