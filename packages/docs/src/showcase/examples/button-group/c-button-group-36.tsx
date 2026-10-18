
import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { LayoutGridIcon, ListIcon, TableIcon } from "lucide-react"

import { cn } from "@exre/exui"
import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <ButtonGroup>
      <Button
        variant="outline"
        size="icon"
        className={cn("bg-muted")}
        aria-label={copyExample("List view")}
      >
        <ListIcon aria-hidden="true" />
      </Button>
      <Button variant="outline" size="icon" aria-label={copyExample("Grid view")}>
        <LayoutGridIcon aria-hidden="true" />
      </Button>
      <Button variant="outline" size="icon" aria-label={copyExample("Table view")}>
        <TableIcon aria-hidden="true" />
      </Button>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
