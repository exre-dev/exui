
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Field } from "@exre/exui"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <InputGroup>
        <InputGroupTextarea
          placeholder={copyExample("Share your thoughts...")}
          className="min-h-24"
        />
        <InputGroupAddon align="block-end">
          <InputGroupButton variant="secondary" size="sm">
            {<ExampleText>Cancel </ExampleText>}</InputGroupButton>
          <InputGroupButton variant="default" size="sm" className="ml-auto">
            {<ExampleText>Post Comment </ExampleText>}</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
