
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  ColorPicker,
  ColorPickerContent,
  ColorPickerInput,
} from "@exre/exui"

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
        <FieldLabel htmlFor={exampleId("canvas-background")}>{<ExampleText>Canvas background</ExampleText>}</FieldLabel>
        {/* The input reads any CSS color on blur or Enter and writes it back
            as hex; the swatch button opens the full picker. */}
        <ColorPicker i18n={exampleLocales.colorPicker} id={exampleId("canvas-background")} defaultValue="#f8fafc">
          <ColorPickerInput aria-describedby={exampleId("canvas-background-description")} />
          <ColorPickerContent />
        </ColorPicker>
        <FieldDescription id={exampleId("canvas-background-description")}>
          {<ExampleText>Type a hex code, rgb(), hsl(), oklch() or a name like tomato. </ExampleText>}</FieldDescription>
      </Field>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
