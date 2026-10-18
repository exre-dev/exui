
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Checkbox } from "@exre/exui"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <FieldGroup className="w-full max-w-xs">
      <FieldLabel className="relative p-0">
        <Field orientation="horizontal">
          <FieldTitle className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src="/examples/reui/photos/e53b6c9adff882773a.jpg"
                alt={copyExample("Emma Wilson")}
              />
              <AvatarFallback>{<ExampleText>EW</ExampleText>}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold">{<ExampleText>Emma Wilson</ExampleText>}</span>
              <span className="text-muted-foreground text-xs">{<ExampleText>@emmawilson</ExampleText>}</span>
            </div>
          </FieldTitle>
          <Checkbox defaultChecked />
        </Field>
      </FieldLabel>
    </FieldGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
