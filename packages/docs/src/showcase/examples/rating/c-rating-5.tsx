
import { ExampleRuntimeProvider } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Rating } from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Rating rating={4} size="sm" />
      <Rating rating={4} />
      <Rating rating={4} size="lg" />
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
