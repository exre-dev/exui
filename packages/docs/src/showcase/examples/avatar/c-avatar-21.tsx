
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Frame, FramePanel } from "@exre/exui"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Frame>
      <FramePanel className="flex items-center gap-2 p-2!">
        <AvatarGroup>
          <Avatar className="size-7">
            <AvatarImage src="/examples/reui/photos/0a10b9bc070f3bdf60.jpg" alt={copyExample("@shadcn")} />
            <AvatarFallback>{<ExampleText>CH</ExampleText>}</AvatarFallback>
          </Avatar>
          <Avatar className="size-7">
            <AvatarImage
              src="/examples/reui/photos/96b8bd25ab6ed38fc5.png"
              alt={copyExample("@maxleiter")}
            />
            <AvatarFallback>{<ExampleText>CH</ExampleText>}</AvatarFallback>
          </Avatar>
          <Avatar className="size-7">
            <AvatarImage
              src="/examples/reui/photos/eb59b55e1933bc432a.png"
              alt={copyExample("@evilrabbit")}
            />
            <AvatarFallback>{<ExampleText>CH</ExampleText>}</AvatarFallback>
          </Avatar>
          <Avatar className="size-7">
            <AvatarImage src="/examples/reui/photos/f51fb1d8b3e4cbbd47.png" alt={copyExample("@leerob")} />
            <AvatarFallback>{<ExampleText>CH</ExampleText>}</AvatarFallback>
          </Avatar>
        </AvatarGroup>

        <p className="text-muted-foreground me-1.5 text-xs">
          {<ExampleText>Joined by </ExampleText>}<span className="text-foreground font-semibold">500+</span>{<ExampleText>{" "}</ExampleText>}
          {<ExampleText>developers. </ExampleText>}</p>
      </FramePanel>
    </Frame>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
