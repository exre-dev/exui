
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Separator } from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-full max-w-xs flex-col gap-2 text-sm">
      <div className="flex flex-col gap-1">
        <div className="text-sm leading-none font-medium">{<ExampleText>Design System</ExampleText>}</div>
        <div className="text-muted-foreground text-xs">
          {<ExampleText>The Foundation for your UI. </ExampleText>}</div>
      </div>
      <Separator />
      <div className="text-muted-foreground">
        {<ExampleText>A set of beautifully designed components that you can customize, extend, and build on. </ExampleText>}</div>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
