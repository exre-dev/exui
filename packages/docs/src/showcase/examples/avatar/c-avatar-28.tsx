
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { UserPlusIcon } from "lucide-react"

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
    <div className="flex flex-col items-center gap-4 text-center">
      <AvatarGroup>
        <Avatar>
          <AvatarImage
            src="/examples/reui/photos/dfed3098ae0011e5a5.jpg"
            alt={copyExample("sarah@example.com")}
            className="grayscale"
          />
          <AvatarFallback>{<ExampleText>CN</ExampleText>}</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            src="/examples/reui/photos/96b8bd25ab6ed38fc5.png"
            alt={copyExample("@maxleiter")}
            className="grayscale"
          />
          <AvatarFallback>{<ExampleText>LR</ExampleText>}</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            src="/examples/reui/photos/eb59b55e1933bc432a.png"
            alt={copyExample("@evilrabbit")}
            className="grayscale"
          />
          <AvatarFallback>{<ExampleText>ER</ExampleText>}</AvatarFallback>
        </Avatar>
        <AvatarGroupCount aria-label={copyExample("Add collaborator")}>
          <UserPlusIcon aria-hidden="true" />
        </AvatarGroupCount>
      </AvatarGroup>
      <div className="space-y-0.5">
        <h3 className="text-sm font-medium">{<ExampleText>No active collaborators</ExampleText>}</h3>
        <p className="text-muted-foreground text-xs">
          {<ExampleText>Invite teammates to start working together. </ExampleText>}</p>
      </div>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
