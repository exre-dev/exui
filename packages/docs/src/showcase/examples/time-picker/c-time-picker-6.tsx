
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
        <FieldLabel id={exampleId("pickup-time-label")} htmlFor={exampleId("pickup-time")}>
          {<ExampleText>Pickup time </ExampleText>}</FieldLabel>
        {/* Hours outside the window are disabled. With no value the columns
            open on 08:30, the first time that can be chosen, and picking 08
            lands on 08:30 because 08:00 and 08:15 are before opening. */}
        <TimePicker i18n={exampleLocales.timePicker}
          id={exampleId("pickup-time")}
          minuteStep={15}
          min="08:30"
          max="17:30"
          aria-labelledby={exampleId("pickup-time-label")}
          aria-describedby={exampleId("pickup-time-description")}
        />
        <FieldDescription id={exampleId("pickup-time-description")}>
          {<ExampleText>Open 08:30 to 17:30. </ExampleText>}</FieldDescription>
      </Field>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
