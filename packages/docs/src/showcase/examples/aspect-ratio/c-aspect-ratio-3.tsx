
import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { AspectRatio } from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="w-full max-w-xs">
      <AspectRatio
        ratio={1 / 1}
        className="bg-muted rounded-xl overflow-hidden border"
      >
        <img
          src="/examples/reui/photos/2f95edd007f2710283.jpg"
          alt={copyExample("1:1")}
          width={1000}
          height={800}
          className="h-full w-full object-cover"
        />
      </AspectRatio>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
