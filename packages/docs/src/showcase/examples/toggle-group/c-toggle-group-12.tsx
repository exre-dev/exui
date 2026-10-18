
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <ToggleGroup type="single" defaultValue="24h" variant="outline" size="sm">
        <ToggleGroupItem value="1h">{<ExampleText>1H</ExampleText>}</ToggleGroupItem>
        <ToggleGroupItem value="6h">{<ExampleText>6H</ExampleText>}</ToggleGroupItem>
        <ToggleGroupItem value="24h">{<ExampleText>24H</ExampleText>}</ToggleGroupItem>
        <ToggleGroupItem value="7d">{<ExampleText>7D</ExampleText>}</ToggleGroupItem>
        <ToggleGroupItem value="30d">{<ExampleText>30D</ExampleText>}</ToggleGroupItem>
        <ToggleGroupItem value="all">{<ExampleText>All</ExampleText>}</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
