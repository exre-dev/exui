
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <ToggleGroup type="single" defaultValue="m" size="sm" variant="outline">
        <ToggleGroupItem value="s">{<ExampleText>S</ExampleText>}</ToggleGroupItem>
        <ToggleGroupItem value="m">{<ExampleText>M</ExampleText>}</ToggleGroupItem>
        <ToggleGroupItem value="l">{<ExampleText>L</ExampleText>}</ToggleGroupItem>
        <ToggleGroupItem value="xl">{<ExampleText>XL</ExampleText>}</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
