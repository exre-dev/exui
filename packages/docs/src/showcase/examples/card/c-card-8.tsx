
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Card } from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Card className="group/card relative h-96 w-full max-w-xs overflow-hidden border-0 p-0">
      <img
        src="/examples/reui/photos/9f4ac34c03d6835b1d.jpg"
        alt={copyExample("Background")}
        width={1000}
        height={800}
        className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover/card:scale-110"
      />

      {/* Background fade effects */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/60 to-transparent transition-opacity duration-500 group-hover/card:from-black/70" />

      {/* Content */}
      <div className="relative flex h-full flex-col justify-end p-4">
        <h3 className="text-2xl font-bold text-white">{<ExampleText>Image Scale Effect</ExampleText>}</h3>
        <p className="mt-2 text-sm text-white/90">
          {<ExampleText>This card features a smooth image scaling effect and background overlay on hover. </ExampleText>}</p>
      </div>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
