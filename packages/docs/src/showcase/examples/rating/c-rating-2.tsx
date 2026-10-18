
import { ExampleRuntimeProvider } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Rating } from "@exre/exui"

  function OriginalPattern() {
  return <Rating rating={3.5} />
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
