
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BoldIcon, ItalicIcon } from "lucide-react"

import { Toggle } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Toggle variant="outline" aria-label={copyExample("Toggle italic")}>
        <ItalicIcon  />
        {<ExampleText>Italic </ExampleText>}</Toggle>
      <Toggle variant="outline" aria-label={copyExample("Toggle bold")}>
        <BoldIcon  />
        {<ExampleText>Bold </ExampleText>}</Toggle>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
