
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
      <Avatar className="rounded-md relative">
        <AvatarImage
          src="/examples/reui/photos/e93553df2422635515.jpg"
          alt={copyExample("Alex Johnson (away)")}
          className="rounded-md"
        />
        <AvatarFallback>{<ExampleText>AJ</ExampleText>}</AvatarFallback>
        <AvatarBadge className="-top-1 -right-1 bg-green-500" />
      </Avatar>
      <Avatar className="rounded-md relative">
        <AvatarImage
          src="/examples/reui/photos/dfed3098ae0011e5a5.jpg"
          alt={copyExample("Sarah Chen")}
          className="rounded-md"
        />
        <AvatarFallback>{<ExampleText>SC</ExampleText>}</AvatarFallback>
        <AvatarBadge className="-right-1 -bottom-1 bg-yellow-500" />
      </Avatar>
      <Avatar className="rounded-md relative">
        <AvatarImage
          src="/examples/reui/photos/4349381d8a8476edbc.jpg"
          alt={copyExample("Michael Rodriguez")}
          className="rounded-md"
        />
        <AvatarFallback>{<ExampleText>MR</ExampleText>}</AvatarFallback>
        <AvatarBadge className="bg-destructive -top-1 right-auto bottom-auto -left-1" />
      </Avatar>
      <Avatar className="rounded-md relative">
        <AvatarImage
          src="/examples/reui/photos/046af0b7d159f9f4fd.jpg"
          alt={copyExample("Emma Wilson")}
          className="rounded-md"
        />
        <AvatarFallback>{<ExampleText>EW</ExampleText>}</AvatarFallback>
        <AvatarBadge className="right-auto -bottom-1 -left-1 bg-blue-500" />
      </Avatar>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
