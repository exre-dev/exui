
import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { Columns2Icon, LayoutGridIcon, ListIcon } from "lucide-react"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <ToggleGroup type="single" defaultValue="list" variant="outline">
        <ToggleGroupItem value="list" aria-label={copyExample("List view")}>
          <ListIcon  />
        </ToggleGroupItem>
        <ToggleGroupItem value="grid" aria-label={copyExample("Grid view")}>
          <LayoutGridIcon  />
        </ToggleGroupItem>
        <ToggleGroupItem value="kanban" aria-label={copyExample("Kanban view")}>
          <Columns2Icon  />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
