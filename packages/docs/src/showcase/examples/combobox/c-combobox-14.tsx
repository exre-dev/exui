"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
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
import { Field, FieldError, FieldLabel } from "@exre/exui"

const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"]

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  const anchor = useComboboxAnchor()

  return (
    <Field className="max-w-xs" data-invalid>
      <FieldLabel htmlFor={exampleId("combobox-multiple-invalid")}>{<ExampleText>Frameworks</ExampleText>}</FieldLabel>
      <Combobox
        multiple
        autoHighlight
        items={frameworks}
        defaultValue={[frameworks[0], frameworks[1]]}
      >
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values) => (
              <ExampleRuntimeConsumer render={({id: exampleId, copy: copyExample}) => (<Fragment>
                {<ExampleText>{values.map((value: string) => (
                  <ComboboxChip key={value} showRemove={true}>
                    {<ExampleText>{value}</ExampleText>}
                  </ComboboxChip>
                ))}</ExampleText>}
                <ComboboxChipsInput
                  id={exampleId("combobox-multiple-invalid")}
                  placeholder={copyExample("Select frameworks...")}
                  aria-invalid
                />
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
      <FieldError errors={[{ message: "This field is required." }]} />
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
