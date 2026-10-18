
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
        <InputGroupAddon className="pr-0 pl-3">
          <InputGroupText className="text-muted-foreground">€</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          placeholder={copyExample("0.00")}
          className="border-border border-r"
        />
        <InputGroupAddon align="inline-end" className="pl-2">
          <InputGroupText>{<ExampleText>EUR</ExampleText>}</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
