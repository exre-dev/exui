
import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CopyIcon } from "lucide-react"



import { Field } from "@exre/exui"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()
  const { toast } = useExampleRuntime()

  return (
    <Field className="w-full max-w-xs">
      <InputGroup>
        <InputGroupInput defaultValue="https://reui.com/share" readOnly />
        <InputGroupAddon align="inline-end">
          <InputGroupButton aria-label={copyExample("Copy")}
            variant="ghost"
            size="icon-xs"
            onClick={() => toast.success("Copied to clipboard")}
          >
            <CopyIcon className="size-4" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
