
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
    <Button variant="outline" size="sm" className="gap-1.5">
      <Avatar className="size-5">
        <AvatarImage
          src="/examples/reui/photos/5e888e99883ac22f08.jpg"
          alt={copyExample("@nick.bold")}
        />
        <AvatarFallback>{<ExampleText>CH</ExampleText>}</AvatarFallback>
      </Avatar>
      <span className="text-xs">{<ExampleText>@nick.bold</ExampleText>}</span>
    </Button>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
