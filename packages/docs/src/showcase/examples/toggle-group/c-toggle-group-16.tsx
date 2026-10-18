
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
        defaultValue="monthly"
        variant="outline"
        size="lg"
      >
        <ToggleGroupItem value="monthly">{<ExampleText>Monthly</ExampleText>}</ToggleGroupItem>
        <ToggleGroupItem value="yearly" className="gap-2">
          {<ExampleText>Yearly </ExampleText>}<span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-medium">
            {<ExampleText>Save 20% </ExampleText>}</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
