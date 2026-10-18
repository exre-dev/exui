
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
        <FieldLabel id={exampleId("standup-time-label")} htmlFor={exampleId("standup-time")}>
          {<ExampleText>Standup time </ExampleText>}</FieldLabel>
        {/* With no children the picker renders its own trigger and popover.
            `aria-labelledby` keeps the value in the trigger's name, so it
            reads "Standup time 09:30" rather than the label alone. */}
        <TimePicker i18n={exampleLocales.timePicker}
          id={exampleId("standup-time")}
          aria-labelledby={exampleId("standup-time-label")}
          aria-describedby={exampleId("standup-time-description")}
        />
        <FieldDescription id={exampleId("standup-time-description")}>
          {<ExampleText>Reminders go out 10 minutes before. </ExampleText>}</FieldDescription>
      </Field>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
