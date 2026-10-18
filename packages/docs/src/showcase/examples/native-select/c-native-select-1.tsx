
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  NativeSelect,
  NativeSelectOption,
} from "@exre/exui"

  function OriginalPattern() {
  return (
    <NativeSelect className="w-full max-w-xs">
      <NativeSelectOption value="">{<ExampleText>Select a fruit</ExampleText>}</NativeSelectOption>
      <NativeSelectOption value="apple">{<ExampleText>Apple</ExampleText>}</NativeSelectOption>
      <NativeSelectOption value="banana">{<ExampleText>Banana</ExampleText>}</NativeSelectOption>
      <NativeSelectOption value="blueberry">{<ExampleText>Blueberry</ExampleText>}</NativeSelectOption>
      <NativeSelectOption value="grapes" disabled>
        {<ExampleText>Grapes </ExampleText>}</NativeSelectOption>
      <NativeSelectOption value="pineapple">{<ExampleText>Pineapple</ExampleText>}</NativeSelectOption>
    </NativeSelect>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
