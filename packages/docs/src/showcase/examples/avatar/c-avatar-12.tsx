
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { PlusIcon } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <AvatarGroup>
      <Avatar>
        <AvatarImage
          src="/examples/reui/photos/f1d4253436738aaf8f.jpg"
          alt={copyExample("Nick Johnson")}
        />
        <AvatarFallback>{<ExampleText>NJ</ExampleText>}</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage
          src="/examples/reui/photos/e93553df2422635515.jpg"
          alt={copyExample("Alex Johnson (away)")}
        />
        <AvatarFallback>{<ExampleText>AJ</ExampleText>}</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage
          src="/examples/reui/photos/dfed3098ae0011e5a5.jpg"
          alt={copyExample("Sarah Chen")}
        />
        <AvatarFallback>{<ExampleText>SC</ExampleText>}</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>
        <PlusIcon aria-hidden="true" />
      </AvatarGroupCount>
    </AvatarGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
