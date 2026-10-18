
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Button } from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Button>
      <Avatar className="size-5">
        <AvatarImage src="/examples/reui/photos/0a10b9bc070f3bdf60.jpg" alt={copyExample("@shadcn")} />
        <AvatarFallback>{<ExampleText>CH</ExampleText>}</AvatarFallback>
      </Avatar>
      <span className="text-xs">{<ExampleText>@shadcn</ExampleText>}</span>
    </Button>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
