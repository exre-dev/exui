
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <ToggleGroup type="single" defaultValue="asc" variant="outline" size="sm">
        <ToggleGroupItem value="asc" aria-label={copyExample("Sort ascending")}>
          <ArrowUpIcon  />
          {<ExampleText>Ascending </ExampleText>}</ToggleGroupItem>
        <ToggleGroupItem value="desc" aria-label={copyExample("Sort descending")}>
          <ArrowDownIcon  />
          {<ExampleText>Descending </ExampleText>}</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
