
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { PackageIcon } from "lucide-react"

import { IconTile } from "@exre/exui"



const variants = ["outline", "elevated", "soft", "solid", "frame"] as const

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center gap-4">
      {<ExampleText>{variants.map((variant) => (
        <IconTile key={variant} variant={variant} aria-hidden="true">
          <PackageIcon  />
        </IconTile>
      ))}</ExampleText>}
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
