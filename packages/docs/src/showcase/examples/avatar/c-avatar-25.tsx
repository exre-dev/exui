
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
    <div className="border-border flex items-center gap-1.5 rounded-full border p-0.5 shadow-sm shadow-black/5">
      <div className="flex -space-x-1.5">
        <Avatar className="border-background size-7 border-2">
          <AvatarImage
            src="/examples/reui/photos/e93553df2422635515.jpg"
            alt={copyExample("Alex Johnson")}
          />
          <AvatarFallback>{<ExampleText>AJ</ExampleText>}</AvatarFallback>
        </Avatar>
        <Avatar className="border-background size-7 border-2">
          <AvatarImage
            src="/examples/reui/photos/dfed3098ae0011e5a5.jpg"
            alt={copyExample("Sarah Chen")}
          />
          <AvatarFallback>{<ExampleText>SC</ExampleText>}</AvatarFallback>
        </Avatar>
        <Avatar className="border-background size-7 border-2">
          <AvatarImage
            src="/examples/reui/photos/4349381d8a8476edbc.jpg"
            alt={copyExample("Michael Rodriguez")}
          />
          <AvatarFallback>{<ExampleText>MR</ExampleText>}</AvatarFallback>
        </Avatar>
        <Avatar className="border-background size-7 border-2">
          <AvatarImage
            src="/examples/reui/photos/046af0b7d159f9f4fd.jpg"
            alt={copyExample("Emma Wilson")}
          />
          <AvatarFallback>{<ExampleText>EW</ExampleText>}</AvatarFallback>
        </Avatar>
      </div>

      <p className="text-muted-foreground me-1.5 text-xs">+3</p>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
