"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { type FormEvent } from "react"


import { Button } from "@exre/exui"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@exre/exui"
import { Field, FieldLabel } from "@exre/exui"

const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"]

  function OriginalPattern() {
  const {format: formatExample,  id: exampleId, copy: copyExample, toast } = useExampleRuntime()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const framework = formData.get("framework") as string
    toast(formatExample("You selected {framework} as your framework.", { framework: framework }))
  }

  return (
    <form
      id={exampleId("form-with-combobox")}
      onSubmit={handleSubmit}
      className="w-full max-w-xs space-y-4"
    >
      <Field>
        <FieldLabel htmlFor={exampleId("framework")}>{<ExampleText>Framework</ExampleText>}</FieldLabel>
        <Combobox items={frameworks}>
          <ComboboxInput
            id={exampleId("framework")}
            name="framework"
            placeholder={copyExample("Select a framework")}
            required
          />
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
      <Button type="submit" form="form-with-combobox" className="w-full">
        {<ExampleText>Submit </ExampleText>}</Button>
    </form>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
