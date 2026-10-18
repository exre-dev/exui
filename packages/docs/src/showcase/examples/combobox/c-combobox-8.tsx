
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@exre/exui"
import { Field } from "@exre/exui"

const largeListItems = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`)

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <Combobox items={largeListItems}>
        <ComboboxInput placeholder={copyExample("Search from 100 items")} />
        <ComboboxContent>
          <ComboboxEmpty>{<ExampleText>No items found.</ExampleText>}</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {<ExampleText>{item}</ExampleText>}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
