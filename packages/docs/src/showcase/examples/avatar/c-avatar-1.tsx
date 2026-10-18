
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
        src="/examples/reui/photos/4349381d8a8476edbc.jpg"
        alt={copyExample("Michael Rodriguez")}
      />
      <AvatarFallback>{<ExampleText>MR</ExampleText>}</AvatarFallback>
    </Avatar>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
