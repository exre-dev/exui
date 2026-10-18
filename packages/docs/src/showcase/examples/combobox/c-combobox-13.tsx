"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Fragment } from "react"

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@exre/exui"
import { Field } from "@exre/exui"

const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"]

  function OriginalPattern() {
  const anchor = useComboboxAnchor()

  return (
    <Field className="max-w-xs">
      <Combobox
        multiple
        autoHighlight
        items={frameworks}
        defaultValue={[frameworks[0], frameworks[1]]}
        disabled
      >
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values) => (
              <ExampleRuntimeConsumer render={({copy: copyExample}) => (<Fragment>
                {<ExampleText>{values.map((value: string) => (
                  <ComboboxChip key={value}>{<ExampleText>{value}</ExampleText>}</ComboboxChip>
                ))}</ExampleText>}
                <ComboboxChipsInput placeholder={copyExample("Select frameworks...")} />
              </Fragment>)} />
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
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
