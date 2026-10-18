
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Separator } from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex h-5 items-center gap-4 text-sm">
        <div>{<ExampleText>Blog</ExampleText>}</div>
        <Separator orientation="vertical" />
        <div>{<ExampleText>Docs</ExampleText>}</div>
        <Separator orientation="vertical" />
        <div>{<ExampleText>Source</ExampleText>}</div>
      </div>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
