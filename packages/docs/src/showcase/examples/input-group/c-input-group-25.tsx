
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { SearchIcon } from "lucide-react"

import { Field } from "@exre/exui"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon className="text-muted-foreground size-4" />
        </InputGroupAddon>
        <InputGroupInput placeholder={copyExample("Search logs...")} />
        <InputGroupAddon align="inline-end">
          <InputGroupText className="text-muted-foreground text-xs">
            {<ExampleText>12 results </ExampleText>}</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
