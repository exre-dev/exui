
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import { Spinner } from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Button>
        <Spinner data-icon="inline-start" /> {<ExampleText> Processing… </ExampleText>}</Button>
      <Button variant="outline" disabled>
        <Spinner data-icon="inline-start" /> {<ExampleText> Loading… </ExampleText>}</Button>
      <Button variant="outline" size="icon" disabled aria-label={copyExample("Loading")}>
        <Spinner />
      </Button>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
