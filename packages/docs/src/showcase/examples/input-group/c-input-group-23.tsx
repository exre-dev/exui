
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CommandIcon, SparklesIcon } from "lucide-react"

import { Field } from "@exre/exui"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@exre/exui"
import { Kbd, KbdGroup } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <InputGroup>
        <InputGroupAddon>
          <SparklesIcon className="text-emerald-500" />
        </InputGroupAddon>
        <InputGroupInput placeholder={copyExample("Ask AI to generate...")} />
        <InputGroupAddon align="inline-end">
          <KbdGroup>
            <Kbd>
              <CommandIcon className="size-3" />
            </Kbd>
            <Kbd>{<ExampleText>Enter</ExampleText>}</Kbd>
          </KbdGroup>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
