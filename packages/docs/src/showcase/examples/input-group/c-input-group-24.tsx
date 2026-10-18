
import { ExampleRuntimeProvider } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon } from "lucide-react"

import { Field } from "@exre/exui"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@exre/exui"


  function OriginalPattern() {
  return (
    <Field className="max-w-xs">
      <InputGroup>
        <InputGroupInput defaultValue="reui_dev" />
        <InputGroupAddon align="inline-end">
          <div className="flex size-4 items-center justify-center rounded-full bg-emerald-500">
            <CheckIcon className="size-3 text-white" />
          </div>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
