
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Avatar, AvatarFallback } from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="after:border-primary">
        <AvatarFallback className="bg-primary text-primary-foreground">
          {<ExampleText>AB </ExampleText>}</AvatarFallback>
      </Avatar>
      <Avatar className="after:border-destructive">
        <AvatarFallback className="bg-destructive text-white">
          {<ExampleText>AB </ExampleText>}</AvatarFallback>
      </Avatar>
      <Avatar className="after:border-green-500">
        <AvatarFallback className="bg-green-500 text-white">{<ExampleText>AB</ExampleText>}</AvatarFallback>
      </Avatar>
      <Avatar className="after:border-blue-500">
        <AvatarFallback className="bg-blue-500 text-white">{<ExampleText>CB</ExampleText>}</AvatarFallback>
      </Avatar>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
