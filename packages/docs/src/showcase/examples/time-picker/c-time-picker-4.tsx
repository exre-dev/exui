
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { TimePicker } from "@exre/exui"

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
        <FieldLabel id={exampleId("stream-live-label")} htmlFor={exampleId("stream-live")}>
          {<ExampleText>Stream goes live </ExampleText>}</FieldLabel>
        {/* Only the display is 12-hour: the trigger shows 02:45:30 PM while
            the value stays 24-hour `HH:mm:ss`, "14:45:30". The popover
            gets 4 columns, hour, minute, second and AM/PM. */}
        <TimePicker i18n={exampleLocales.timePicker}
          id={exampleId("stream-live")}
          hourCycle={12}
          granularity="second"
          defaultValue="14:45:30"
          aria-labelledby={exampleId("stream-live-label")}
          aria-describedby={exampleId("stream-live-description")}
        />
        <FieldDescription id={exampleId("stream-live-description")}>
          {<ExampleText>Pick the exact second the broadcast starts. </ExampleText>}</FieldDescription>
      </Field>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
