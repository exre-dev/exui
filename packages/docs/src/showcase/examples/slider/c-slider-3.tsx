
import { ExampleRuntimeProvider } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Slider } from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex w-full max-w-xs items-center justify-center">
      <Slider defaultValue={[10, 40, 80]} max={100} step={10} />
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
