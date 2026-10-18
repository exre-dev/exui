
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { ColorPicker } from "@exre/exui"

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, locales: exampleLocales } = useExampleRuntime()

  return (
    <div className="w-full max-w-xs">
      <Field>
        <FieldLabel id={exampleId("accent-color-label")} htmlFor={exampleId("accent-color")}>
          {<ExampleText>Accent color </ExampleText>}</FieldLabel>
        {/* With no children the picker renders its own trigger and popover.
            `aria-labelledby` keeps the value in the trigger's name, so it
            reads "Accent color #0EA5E9" rather than the label alone. */}
        <ColorPicker i18n={exampleLocales.colorPicker}
          id={exampleId("accent-color")}
          defaultValue="#0ea5e9"
          aria-labelledby={exampleId("accent-color-label")}
          aria-describedby={exampleId("accent-color-description")}
        />
        <FieldDescription id={exampleId("accent-color-description")}>
          {<ExampleText>Used for links, focus rings and primary buttons. </ExampleText>}</FieldDescription>
      </Field>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
