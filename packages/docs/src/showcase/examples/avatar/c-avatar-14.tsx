
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Avatar, AvatarFallback } from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="after:border-primary/10">
        <AvatarFallback className="bg-primary/10 text-primary">
          {<ExampleText>AB </ExampleText>}</AvatarFallback>
      </Avatar>
      <Avatar className="after:border-destructive/10">
        <AvatarFallback className="bg-destructive/10 text-destructive">
          {<ExampleText>DV </ExampleText>}</AvatarFallback>
      </Avatar>
      <Avatar className="after:border-green-200 dark:after:border-green-600">
        <AvatarFallback className="bg-green-50 text-green-600 dark:bg-green-900">
          {<ExampleText>SB </ExampleText>}</AvatarFallback>
      </Avatar>
      <Avatar className="after:border-fuchsia-200 dark:after:border-fuchsia-600">
        <AvatarFallback className="bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-900">
          {<ExampleText>DB </ExampleText>}</AvatarFallback>
      </Avatar>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
