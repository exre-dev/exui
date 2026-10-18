
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@exre/exui"
import { Kbd } from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <InputGroup className="max-w-xs">
        <InputGroupInput placeholder={copyExample("Search…")} />
        <InputGroupAddon>
          <Kbd>{<ExampleText>Space</ExampleText>}</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
