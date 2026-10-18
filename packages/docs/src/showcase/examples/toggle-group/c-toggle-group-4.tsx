
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
        variant="outline"
        spacing={2}
        defaultValue="week"
      >
        <ToggleGroupItem value="day">{<ExampleText>Day</ExampleText>}</ToggleGroupItem>
        <ToggleGroupItem value="week">{<ExampleText>Week</ExampleText>}</ToggleGroupItem>
        <ToggleGroupItem value="month">{<ExampleText>Month</ExampleText>}</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
