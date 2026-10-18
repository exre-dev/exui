
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
    <div className="flex items-center gap-2">
      <Avatar className="rounded-md after:rounded-md">
        <AvatarImage
          src="/examples/reui/photos/046af0b7d159f9f4fd.jpg"
          alt={copyExample("Emma Wilson")}
          className="rounded-md"
        />
        <AvatarFallback>{<ExampleText>EW</ExampleText>}</AvatarFallback>
      </Avatar>
      <Avatar className="rounded-lg after:rounded-lg">
        <AvatarImage
          src="/examples/reui/photos/046af0b7d159f9f4fd.jpg"
          alt={copyExample("Emma Wilson")}
          className="rounded-lg"
        />
        <AvatarFallback>{<ExampleText>EW</ExampleText>}</AvatarFallback>
      </Avatar>
      <Avatar className="rounded-lg after:rounded-xl">
        <AvatarImage
          src="/examples/reui/photos/046af0b7d159f9f4fd.jpg"
          alt={copyExample("Emma Wilson")}
          className="rounded-xl"
        />
        <AvatarFallback>{<ExampleText>EW</ExampleText>}</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage
          src="/examples/reui/photos/046af0b7d159f9f4fd.jpg"
          alt={copyExample("Emma Wilson")}
        />
        <AvatarFallback>{<ExampleText>EW</ExampleText>}</AvatarFallback>
      </Avatar>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
