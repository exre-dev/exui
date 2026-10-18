
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import { Spinner } from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center gap-3">
      <Button disabled>
        <Spinner />
        {<ExampleText>Saving... </ExampleText>}</Button>
      <Button variant="outline" disabled>
        <Spinner />
        {<ExampleText>Loading </ExampleText>}</Button>
      <Button variant="secondary" disabled>
        <Spinner />
        {<ExampleText>Processing </ExampleText>}</Button>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
