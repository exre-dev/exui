
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Avatar,
  AvatarBadge,
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
          src="/examples/reui/photos/dfed3098ae0011e5a5.jpg"
          alt={copyExample("Sarah Chen")}
        />
        <AvatarFallback>{<ExampleText>SC</ExampleText>}</AvatarFallback>
        <AvatarBadge className="bg-success" />
      </Avatar>
      <Avatar>
        <AvatarImage
          src="/examples/reui/photos/4349381d8a8476edbc.jpg"
          alt={copyExample("Michael Rodriguez")}
        />
        <AvatarFallback>{<ExampleText>MR</ExampleText>}</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage
          src="/examples/reui/photos/046af0b7d159f9f4fd.jpg"
          alt={copyExample("Emma Wilson")}
        />
        <AvatarFallback>{<ExampleText>EW</ExampleText>}</AvatarFallback>
      </Avatar>
    </AvatarGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
