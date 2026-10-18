
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
    <div className="mx-auto w-full max-w-xs">
      <FieldLabel htmlFor={exampleId("sw-danger")}>
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle className="text-destructive">
              {<ExampleText>Delete all data on sign out </ExampleText>}</FieldTitle>
            <FieldDescription>
              {<ExampleText>When enabled, all local data will be permanently removed when you sign out. This action cannot be undone. </ExampleText>}</FieldDescription>
          </FieldContent>
          <Switch id={exampleId("sw-danger")} className="data-checked:bg-destructive" />
        </Field>
      </FieldLabel>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
