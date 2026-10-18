
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <ToggleGroup
        type="single"
        defaultValue="active"
        variant="outline"
        size="sm"
      >
        <ToggleGroupItem value="all">{<ExampleText>All</ExampleText>}</ToggleGroupItem>
        <ToggleGroupItem value="active">{<ExampleText>Active</ExampleText>}</ToggleGroupItem>
        <ToggleGroupItem value="completed">{<ExampleText>Completed</ExampleText>}</ToggleGroupItem>
        <ToggleGroupItem value="archived">{<ExampleText>Archived</ExampleText>}</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
