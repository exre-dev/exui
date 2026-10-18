
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <ToggleGroup type="single" size="sm" defaultValue="top" variant="outline">
        <ToggleGroupItem value="top">{<ExampleText>Top</ExampleText>}</ToggleGroupItem>
        <ToggleGroupItem value="bottom">{<ExampleText>Bottom</ExampleText>}</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" defaultValue="top" variant="outline">
        <ToggleGroupItem value="top">{<ExampleText>Top</ExampleText>}</ToggleGroupItem>
        <ToggleGroupItem value="bottom">{<ExampleText>Bottom</ExampleText>}</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
