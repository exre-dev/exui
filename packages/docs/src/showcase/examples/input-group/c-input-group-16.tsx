
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { InfoIcon } from "lucide-react"

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
    <Field className="w-full max-w-xs">
      <InputGroup className="h-auto">
        <InputGroupInput placeholder={copyExample("First name")} />
        <InputGroupAddon align="block-start">
          <InputGroupText className="font-medium">{<ExampleText>User Profile</ExampleText>}</InputGroupText>
          <InfoIcon className="ml-auto" />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
