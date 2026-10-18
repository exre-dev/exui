
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BoldIcon } from "lucide-react"

import { Button } from "@exre/exui"
import { Toggle } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline">
          {<ExampleText>Button </ExampleText>}</Button>
        <Toggle variant="outline" size="sm" aria-label={copyExample("Small toggle")}>
          {<ExampleText>Toggle </ExampleText>}</Toggle>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" aria-label={copyExample("Bold")}>
          <BoldIcon  />
        </Button>
        <Toggle variant="outline" aria-label={copyExample("Toggle bold icon")}>
          <BoldIcon  />
        </Toggle>
      </div>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
