
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { InfoIcon } from "lucide-react"

import {
  ButtonGroup,
  ButtonGroupText,
} from "@exre/exui"
import { Field } from "@exre/exui"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <ButtonGroup>
        <ButtonGroupText>{<ExampleText>https://</ExampleText>}</ButtonGroupText>
        <InputGroup>
          <InputGroupInput placeholder={copyExample("example")} />
          <InputGroupAddon align="inline-end">
            <InfoIcon className="text-muted-foreground size-4" />
          </InputGroupAddon>
        </InputGroup>
        <ButtonGroupText>{<ExampleText>.com</ExampleText>}</ButtonGroupText>
      </ButtonGroup>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
