
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CircleAlertIcon } from "lucide-react"

import { Field, FieldError, FieldLabel } from "@exre/exui"
import { Input } from "@exre/exui"


  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor={exampleId("security-code")}>{<ExampleText>Security Code</ExampleText>}</FieldLabel>
      <Input
        id={exampleId("security-code")}
        placeholder={copyExample("Enter your security code")}
        aria-invalid="true"
      />
      <FieldError className="mt-2 space-y-1.5 text-xs">
        <div className="flex items-center gap-1.5">
          <CircleAlertIcon className="size-3.5" />
          <span>{<ExampleText>Code must be at least 12 characters long</ExampleText>}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CircleAlertIcon className="size-3.5" />
          <span>{<ExampleText>Code must contain at least one uppercase letter</ExampleText>}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CircleAlertIcon className="size-3.5" />
          <span>{<ExampleText>Code cannot include common words or patterns</ExampleText>}</span>
        </div>
      </FieldError>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
