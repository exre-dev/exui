
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
    <div className="border-border rounded-full flex items-center gap-1.5 border p-1 shadow-sm shadow-black/5">
      <AvatarGroup>
        <Avatar className="size-7">
          <AvatarImage
            src="/examples/reui/photos/a3afee2f77d259ce6a.jpg"
            alt={copyExample("Liam Thompson")}
          />
          <AvatarFallback>{<ExampleText>LT</ExampleText>}</AvatarFallback>
        </Avatar>
        <Avatar className="size-7">
          <AvatarImage
            src="/examples/reui/photos/f1d4253436738aaf8f.jpg"
            alt={copyExample("Nick Johnson")}
          />
          <AvatarFallback>{<ExampleText>NJ</ExampleText>}</AvatarFallback>
        </Avatar>
        <Avatar className="size-7">
          <AvatarImage
            src="/examples/reui/photos/067c566cd567259bb9.jpg"
            alt={copyExample("Maria Garcia")}
          />
          <AvatarFallback>{<ExampleText>MG</ExampleText>}</AvatarFallback>
        </Avatar>
        <Avatar className="size-7">
          <AvatarImage src="/examples/reui/photos/f51fb1d8b3e4cbbd47.png" alt={copyExample("@leerob")} />
          <AvatarFallback>{<ExampleText>CH</ExampleText>}</AvatarFallback>
        </Avatar>
      </AvatarGroup>

      <p className="text-muted-foreground me-1.5 text-xs">
        {<ExampleText>Trusted by </ExampleText>}<span className="text-foreground font-semibold">{<ExampleText>100K+</ExampleText>}</span>{<ExampleText>{" "}</ExampleText>}
        {<ExampleText>users. </ExampleText>}</p>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
