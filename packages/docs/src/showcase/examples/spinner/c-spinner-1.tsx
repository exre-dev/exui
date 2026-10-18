
import { ExampleRuntimeProvider } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Spinner } from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center gap-6">
      <Spinner />
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
