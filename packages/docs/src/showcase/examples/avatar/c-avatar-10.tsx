
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <AvatarGroup>
      <Avatar>
        <AvatarImage
          src="/examples/reui/photos/e93553df2422635515.jpg"
          alt={copyExample("Alex Johnson (away)")}
        />
        <AvatarFallback>{<ExampleText>CN</ExampleText>}</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage
          src="/examples/reui/photos/dfed3098ae0011e5a5.jpg"
          alt={copyExample("Sarah Chen")}
        />
        <AvatarFallback>{<ExampleText>ML</ExampleText>}</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage
          src="/examples/reui/photos/4349381d8a8476edbc.jpg"
          alt={copyExample("Michael Rodriguez")}
        />
        <AvatarFallback>{<ExampleText>ER</ExampleText>}</AvatarFallback>
      </Avatar>
    </AvatarGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
