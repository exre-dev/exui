
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <NativeSelect className="w-full max-w-xs">
      <NativeSelectOption value="">{<ExampleText>Select a food</ExampleText>}</NativeSelectOption>
      <NativeSelectOptGroup label={copyExample("Fruits")}>
        <NativeSelectOption value="apple">{<ExampleText>Apple</ExampleText>}</NativeSelectOption>
        <NativeSelectOption value="banana">{<ExampleText>Banana</ExampleText>}</NativeSelectOption>
        <NativeSelectOption value="blueberry">{<ExampleText>Blueberry</ExampleText>}</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label={copyExample("Vegetables")}>
        <NativeSelectOption value="carrot">{<ExampleText>Carrot</ExampleText>}</NativeSelectOption>
        <NativeSelectOption value="broccoli">{<ExampleText>Broccoli</ExampleText>}</NativeSelectOption>
        <NativeSelectOption value="spinach">{<ExampleText>Spinach</ExampleText>}</NativeSelectOption>
      </NativeSelectOptGroup>
    </NativeSelect>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
