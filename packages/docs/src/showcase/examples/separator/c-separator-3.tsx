
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Separator } from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center gap-4 text-sm">
        <div className="flex flex-col gap-1">
          <span className="font-medium">{<ExampleText>Settings</ExampleText>}</span>
          <span className="text-muted-foreground text-xs">
            {<ExampleText>Manage preferences </ExampleText>}</span>
        </div>
        <Separator orientation="vertical" className="h-8 [&]:self-auto!" />
        <div className="flex flex-col gap-1">
          <span className="font-medium">{<ExampleText>Account</ExampleText>}</span>
          <span className="text-muted-foreground text-xs">
            {<ExampleText>Profile &amp; security </ExampleText>}</span>
        </div>
        <Separator orientation="vertical" className="h-8 [&]:self-auto!" />
        <div className="flex flex-col gap-1">
          <span className="font-medium">{<ExampleText>Help</ExampleText>}</span>
          <span className="text-muted-foreground text-xs">{<ExampleText>Support &amp; docs</ExampleText>}</span>
        </div>
      </div>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
