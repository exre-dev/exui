
import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { AspectRatio } from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="w-full max-w-xs">
      <AspectRatio
        ratio={9 / 16}
        className="bg-muted rounded-xl overflow-hidden border"
      >
        <img
          src="/examples/reui/photos/e18fa64c931e89f480.jpg"
          alt={copyExample("9:16")}
          width={1000}
          height={800}
          className="h-full w-full object-cover"
        />
      </AspectRatio>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
