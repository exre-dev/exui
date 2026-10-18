
import { ExampleRuntimeProvider } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Slider } from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center gap-12">
      <Slider
        defaultValue={[50]}
        max={100}
        step={1}
        orientation="vertical"
        className="h-40"
      />
      <Slider
        defaultValue={[25, 75]}
        max={100}
        step={5}
        orientation="vertical"
        className="h-40"
      />
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
