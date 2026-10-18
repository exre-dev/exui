
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Label } from "@exre/exui"
import { Slider } from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="mx-auto grid w-full max-w-sm gap-4">
      <Label className="text-sm font-medium">{<ExampleText>Storage</ExampleText>}</Label>
      <Slider defaultValue={[15]} max={35} min={5} />
      <span
        aria-hidden="true"
        className="text-muted-foreground flex w-full items-center justify-between text-xs font-medium"
      >
        <span>{<ExampleText>5 GB</ExampleText>}</span>
        <span>{<ExampleText>20 GB</ExampleText>}</span>
        <span>{<ExampleText>35 GB</ExampleText>}</span>
      </span>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
