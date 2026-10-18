
import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { AspectRatio } from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="w-full max-w-md">
      <AspectRatio
        ratio={3 / 2}
        className="bg-muted rounded-xl overflow-hidden border"
      >
        <img
          src="/examples/reui/photos/c27612d0e011078f3a.jpg"
          alt={copyExample("3:2")}
          width={1000}
          height={800}
          className="h-full w-full object-cover"
        />
      </AspectRatio>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
