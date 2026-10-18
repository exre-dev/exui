
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BookmarkIcon } from "lucide-react"

import { Toggle } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <Toggle variant="outline" aria-label={copyExample("Toggle bookmark")}>
        <BookmarkIcon className="group-aria-pressed/toggle:fill-accent-foreground" />
        {<ExampleText>Bookmark </ExampleText>}</Toggle>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
