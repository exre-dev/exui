
import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { Columns2Icon, Columns3Icon, LayoutGridIcon, SquareIcon } from "lucide-react"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <ToggleGroup type="single" defaultValue="2" variant="outline">
        <ToggleGroupItem value="1" aria-label={copyExample("1 column")}>
          <SquareIcon  />
        </ToggleGroupItem>
        <ToggleGroupItem value="2" aria-label={copyExample("2 columns")}>
          <Columns2Icon  />
        </ToggleGroupItem>
        <ToggleGroupItem value="3" aria-label={copyExample("3 columns")}>
          <Columns3Icon  />
        </ToggleGroupItem>
        <ToggleGroupItem value="4" aria-label={copyExample("4 columns")}>
          <LayoutGridIcon  />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
