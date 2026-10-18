
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
    <Avatar>
      <AvatarImage
        src="/examples/reui/photos/0a10b9bc070f3bdf60.jpg"
        alt={copyExample("@shadcn")}
        className="grayscale"
      />
      <AvatarFallback>{<ExampleText>CN</ExampleText>}</AvatarFallback>
    </Avatar>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
