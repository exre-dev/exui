
import { ExampleRuntimeProvider } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <span className="bg-primary size-2 animate-bounce rounded-full [animation-delay:-0.3s]" />
      <span className="bg-primary size-2 animate-bounce rounded-full [animation-delay:-0.15s]" />
      <span className="bg-primary size-2 animate-bounce rounded-full" />
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
