
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Badge } from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="flex items-center gap-2.5">
        <Badge size="sm" radius="full">
          3
        </Badge>
        <Badge size="default" radius="full">
          3
        </Badge>
        <Badge size="lg" radius="full">
          3
        </Badge>
      </div>
      <div className="flex items-center gap-2.5">
        <Badge size="sm" radius="full">
          {<ExampleText>New </ExampleText>}</Badge>
        <Badge radius="full">{<ExampleText>New</ExampleText>}</Badge>
        <Badge size="lg" radius="full">
          {<ExampleText>New </ExampleText>}</Badge>
      </div>
      <div className="flex items-center gap-2.5">
        <Badge size="sm" radius="full" variant="outline">
          {<ExampleText>New </ExampleText>}</Badge>
        <Badge radius="full" variant="secondary">
          {<ExampleText>New </ExampleText>}</Badge>
        <Badge size="lg" radius="full" variant="success-light">
          {<ExampleText>New </ExampleText>}</Badge>
      </div>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
