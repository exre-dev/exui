
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
    <div className="flex items-center gap-2">
      <Avatar className="relative">
        <AvatarImage
          src="/examples/reui/photos/e93553df2422635515.jpg"
          alt={copyExample("Alex Johnson (away)")}
        />
        <AvatarFallback>{<ExampleText>AJ</ExampleText>}</AvatarFallback>
        <AvatarBadge className="top-0 right-0 bg-green-500" />
      </Avatar>
      <Avatar className="relative">
        <AvatarImage
          src="/examples/reui/photos/dfed3098ae0011e5a5.jpg"
          alt={copyExample("Sarah Chen")}
        />
        <AvatarFallback>{<ExampleText>SC</ExampleText>}</AvatarFallback>
        <AvatarBadge className="bg-yellow-500" />
      </Avatar>
      <Avatar className="relative">
        <AvatarImage
          src="/examples/reui/photos/4349381d8a8476edbc.jpg"
          alt={copyExample("Michael Rodriguez")}
        />
        <AvatarFallback>{<ExampleText>MR</ExampleText>}</AvatarFallback>
        <AvatarBadge className="bg-destructive top-0 right-auto left-0" />
      </Avatar>
      <Avatar className="relative">
        <AvatarImage
          src="/examples/reui/photos/046af0b7d159f9f4fd.jpg"
          alt={copyExample("Emma Wilson")}
        />
        <AvatarFallback>{<ExampleText>EW</ExampleText>}</AvatarFallback>
        <AvatarBadge className="right-auto left-0 bg-blue-500" />
      </Avatar>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
