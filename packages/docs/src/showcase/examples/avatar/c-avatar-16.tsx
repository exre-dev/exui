
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Badge } from "@exre/exui"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex items-center gap-1.5">
      <Avatar>
        <AvatarImage
          src="/examples/reui/photos/e93553df2422635515.jpg"
          alt={copyExample("Alex Johnson")}
        />
        <AvatarFallback>{<ExampleText>AJ</ExampleText>}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold">{<ExampleText>Alex Johnson</ExampleText>}</span>
          <Badge variant="default" size="xs">
            {<ExampleText>Pro </ExampleText>}</Badge>
        </div>
        <span className="text-muted-foreground text-xs">{<ExampleText>Founder &amp; CEO</ExampleText>}</span>
      </div>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
