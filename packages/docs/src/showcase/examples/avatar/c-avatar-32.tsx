
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="relative w-fit">
      <Avatar className="ring-offset-background animate-pulse ring-2 ring-green-500 ring-offset-2">
        <AvatarImage src="/examples/reui/photos/0a10b9bc070f3bdf60.jpg" alt={copyExample("@shadcn")} />
        <AvatarFallback>{<ExampleText>CN</ExampleText>}</AvatarFallback>
      </Avatar>
      <span className="border-background absolute -right-1 -bottom-1 size-3 rounded-full border-2 bg-green-500" />
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
