
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <ToggleGroup type="single" variant="outline" defaultValue="all">
        <ToggleGroupItem value="all" aria-label={copyExample("Toggle all")}>
          {<ExampleText>All </ExampleText>}</ToggleGroupItem>
        <ToggleGroupItem value="missed" aria-label={copyExample("Toggle missed")}>
          {<ExampleText>Missed </ExampleText>}</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
