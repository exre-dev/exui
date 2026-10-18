
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Toggle } from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Toggle variant="outline" size="sm" aria-label={copyExample("Small toggle")}>
        {<ExampleText>Small </ExampleText>}</Toggle>
      <Toggle variant="outline" size="default" aria-label={copyExample("Default toggle")}>
        {<ExampleText>Default </ExampleText>}</Toggle>
      <Toggle variant="outline" size="lg" aria-label={copyExample("Large toggle")}>
        {<ExampleText>Large </ExampleText>}</Toggle>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
