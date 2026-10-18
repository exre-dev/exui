
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Field, FieldLabel, FieldTitle } from "@exre/exui"
import {
  RadioGroup,
  RadioGroupItem,
} from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <RadioGroup defaultValue="emma" className="w-full max-w-xs">
      <FieldLabel htmlFor={exampleId("emma-wilson")} className="p-0!">
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
          <RadioGroupItem value="emma" id={exampleId("emma-wilson")} />
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor={exampleId("john-doe")} className="p-0!">
        <Field orientation="horizontal">
          <FieldTitle className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src="/examples/reui/photos/198127895366e0296d.jpg"
                alt={copyExample("John Doe")}
              />
              <AvatarFallback>{<ExampleText>JD</ExampleText>}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold">{<ExampleText>John Doe</ExampleText>}</span>
              <span className="text-muted-foreground text-xs">{<ExampleText>@johndoe</ExampleText>}</span>
            </div>
          </FieldTitle>
          <RadioGroupItem value="john" id={exampleId("john-doe")} />
        </Field>
      </FieldLabel>
    </RadioGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
