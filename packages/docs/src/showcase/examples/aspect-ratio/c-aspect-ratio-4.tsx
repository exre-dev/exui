
import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { AspectRatio } from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="w-full max-w-md">
      <AspectRatio
        ratio={21 / 9}
        className="bg-muted rounded-xl overflow-hidden border"
      >
        <img
          src="/examples/reui/photos/d00a8e2f9bec60abb1.jpg"
          alt={copyExample("21:9")}
          width={1000}
          height={800}
          className="h-full w-full object-cover"
        />
      </AspectRatio>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
