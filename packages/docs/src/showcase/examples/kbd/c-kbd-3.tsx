
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ArrowLeftIcon, CircleDashedIcon } from "lucide-react"

import { Kbd, KbdGroup } from "@exre/exui"


  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <KbdGroup>
        <Kbd>
          <ArrowLeftIcon  />
          {<ExampleText>Left </ExampleText>}</Kbd>
        <Kbd>
          <CircleDashedIcon  />
          {<ExampleText>Voice Enabled </ExampleText>}</Kbd>
      </KbdGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
