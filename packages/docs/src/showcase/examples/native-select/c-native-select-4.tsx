
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@exre/exui"
import {
  NativeSelect,
  NativeSelectOption,
} from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor={exampleId("native-select-country")}>{<ExampleText>Country</ExampleText>}</FieldLabel>
      <NativeSelect id={exampleId("native-select-country")}>
        <NativeSelectOption value="">{<ExampleText>Select a country</ExampleText>}</NativeSelectOption>
        <NativeSelectOption value="us">{<ExampleText>United States</ExampleText>}</NativeSelectOption>
        <NativeSelectOption value="uk">{<ExampleText>United Kingdom</ExampleText>}</NativeSelectOption>
        <NativeSelectOption value="ca">{<ExampleText>Canada</ExampleText>}</NativeSelectOption>
      </NativeSelect>
      <FieldDescription>{<ExampleText>Select your country of residence.</ExampleText>}</FieldDescription>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
