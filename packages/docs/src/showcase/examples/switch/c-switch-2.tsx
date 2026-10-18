
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@exre/exui"
import { Switch } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <FieldLabel htmlFor={exampleId("switch-with-desc")} className="w-full max-w-xs">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>{<ExampleText>Share across devices</ExampleText>}</FieldTitle>
            <FieldDescription>
              {<ExampleText>Focus is shared across devices, and turns off when you leave the app. </ExampleText>}</FieldDescription>
          </FieldContent>
          <Switch id={exampleId("switch-with-desc")} />
        </Field>
      </FieldLabel>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
