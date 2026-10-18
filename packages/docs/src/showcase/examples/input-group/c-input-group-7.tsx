
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

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
          <InputGroupText>{<ExampleText>https://</ExampleText>}</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder={copyExample("example.com")} />
      </InputGroup>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
