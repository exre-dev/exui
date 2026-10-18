
import { ExampleRuntimeProvider } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Spinner } from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center gap-4">
      <Spinner className="size-4 text-blue-500" />
      <Spinner className="size-4 text-green-500" />
      <Spinner className="size-4 text-red-500" />
      <Spinner className="size-4 text-yellow-500" />
      <Spinner className="size-4 text-purple-500" />
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
