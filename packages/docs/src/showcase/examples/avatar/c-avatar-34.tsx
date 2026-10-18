
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Avatar className="relative">
      <AvatarImage
        src="/examples/reui/photos/e93553df2422635515.jpg"
        alt={copyExample("Alex Johnson")}
      />
      <AvatarFallback>{<ExampleText>JB</ExampleText>}</AvatarFallback>
      <AvatarBadge className="bg-green-500" />
      <span className="border-background absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full border-2 bg-red-500 text-xs font-medium text-white">
        3
      </span>
    </Avatar>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
