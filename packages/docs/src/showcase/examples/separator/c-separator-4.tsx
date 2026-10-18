
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Separator } from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-full max-w-xs flex-col gap-2 text-sm">
      <dl className="flex items-center justify-between">
        <dt className="font-medium">{<ExampleText>Item 1</ExampleText>}</dt>
        <dd className="text-muted-foreground">{<ExampleText>Value 1</ExampleText>}</dd>
      </dl>
      <Separator />
      <dl className="flex items-center justify-between">
        <dt className="font-medium">{<ExampleText>Item 2</ExampleText>}</dt>
        <dd className="text-muted-foreground">{<ExampleText>Value 2</ExampleText>}</dd>
      </dl>
      <Separator />
      <dl className="flex items-center justify-between">
        <dt className="font-medium">{<ExampleText>Item 3</ExampleText>}</dt>
        <dd className="text-muted-foreground">{<ExampleText>Value 3</ExampleText>}</dd>
      </dl>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
