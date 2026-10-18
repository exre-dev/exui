
import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@exre/exui"
import { Field } from "@exre/exui"

const countries = [
  { code: "af", label: "Afghanistan" },
  { code: "al", label: "Albania" },
  { code: "dz", label: "Algeria" },
  { code: "as", label: "American Samoa" },
  { code: "ad", label: "Andorra" },
  { code: "ao", label: "Angola" },
]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <Combobox
        items={countries}
        defaultValue={countries[0]}
        itemToStringValue={(item: (typeof countries)[number]) => item.label}
      >
        <ComboboxTrigger
          render={
            <Button variant="outline" className="justify-between font-normal" />
          }
        >
          <ComboboxValue>
            {(item: (typeof countries)[number]) => (
              <ExampleRuntimeConsumer render={({copy: copyExample}) => (<span className="flex items-center gap-2">
                <img
                  src={`/examples/reui/flags/${item.code.toLowerCase()}.svg`}
                  alt={copyExample("")}
                  width={16}
                  height={16}
                  className="rounded-xs"
                />
                <span>{<ExampleText>{item.label}</ExampleText>}</span>
              </span>)} />
            )}
          </ComboboxValue>
        </ComboboxTrigger>
        <ComboboxContent className="max-w-(--anchor-width) min-w-(--anchor-width)">
          <ComboboxInput showTrigger={false} placeholder={copyExample("Search")} />
          <ComboboxEmpty>{<ExampleText>No items found.</ExampleText>}</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ExampleRuntimeConsumer key={item.code} render={({copy: copyExample}) => (<ComboboxItem key={item.code} value={item}>
                <img
                  src={`/examples/reui/flags/${item.code.toLowerCase()}.svg`}
                  alt={copyExample("")}
                  width={16}
                  height={12}
                  className="rounded-xs"
                />
                {<ExampleText>{item.label}</ExampleText>}
              </ComboboxItem>)} />
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
