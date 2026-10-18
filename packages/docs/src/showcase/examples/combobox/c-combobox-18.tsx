"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronsUpDownIcon } from "lucide-react"

import { useState } from "react"
import { ComboboxTrigger } from "@exre/exui"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@exre/exui"
import { Field } from "@exre/exui"


const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [value, setValue] = useState<string | null>(null)

  return (
    <Field className="max-w-xs">
      <Combobox value={value} onValueChange={setValue} items={frameworks}>
        <ComboboxInput
          placeholder={copyExample("Select framework")}
          showTrigger={false}
          showClear={true}
        >
          {<ExampleText>{!value && (
            <ComboboxTrigger data-slot="combobox-trigger">
              <ChevronsUpDownIcon className="text-muted-foreground pointer-events-none size-4" />
            </ComboboxTrigger>
          )}</ExampleText>}
        </ComboboxInput>
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
