
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  NativeSelect,
  NativeSelectOption,
} from "@exre/exui"

  function OriginalPattern() {
  return (
    <NativeSelect size="sm" className="w-full max-w-xs">
      <NativeSelectOption value="">{<ExampleText>Small Select</ExampleText>}</NativeSelectOption>
      <NativeSelectOption value="1">{<ExampleText>Option 1</ExampleText>}</NativeSelectOption>
      <NativeSelectOption value="2">{<ExampleText>Option 2</ExampleText>}</NativeSelectOption>
    </NativeSelect>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
