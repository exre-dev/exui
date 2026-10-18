
import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon, MenuIcon } from "lucide-react"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <ToggleGroup type="single" defaultValue="left" spacing={1}>
        <ToggleGroupItem value="left" aria-label={copyExample("Align left")}>
          <AlignLeftIcon  />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label={copyExample("Align center")}>
          <AlignCenterIcon  />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label={copyExample("Align right")}>
          <AlignRightIcon  />
        </ToggleGroupItem>
        <ToggleGroupItem value="justify" aria-label={copyExample("Justify")}>
          <MenuIcon  />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
