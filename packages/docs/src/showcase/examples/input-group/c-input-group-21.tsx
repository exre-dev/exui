
import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CopyIcon, StarIcon } from "lucide-react"



import { Field } from "@exre/exui"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample, toast } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <InputGroup>
        <InputGroupInput placeholder={copyExample("Component name...")} />
        <InputGroupAddon align="inline-end">
          <StarIcon className="text-muted-foreground size-4" />
          <InputGroupButton aria-label={copyExample("Copy")}
            size="icon-xs"
            variant="ghost"
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
