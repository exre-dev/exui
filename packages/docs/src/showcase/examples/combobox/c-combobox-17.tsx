"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"


import { Button } from "@exre/exui"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@exre/exui"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@exre/exui"
import { Field, FieldLabel } from "@exre/exui"

const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"]

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample, toast } = useExampleRuntime()

  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
      <DialogTrigger asChild>
        <Button className="w-full max-w-xs">{<ExampleText>Open Dialog</ExampleText>}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{<ExampleText>Select Framework</ExampleText>}</DialogTitle>
          <DialogDescription>
            {<ExampleText>Choose your preferred framework from the list below. </ExampleText>}</DialogDescription>
        </DialogHeader>
        <Field className="pt-4">
          <FieldLabel htmlFor={exampleId("framework-dialog")} className="sr-only">
            {<ExampleText>Framework </ExampleText>}</FieldLabel>
          <Combobox items={frameworks}>
            <ComboboxInput
              id={exampleId("framework-dialog")}
              placeholder={copyExample("Select a framework")}
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
        <DialogFooter className="pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            {<ExampleText>Cancel </ExampleText>}</Button>
          <Button
            type="button"
            onClick={() => {
              toast("Framework selected.")
              setOpen(false)
            }}
          >
            {<ExampleText>Confirm </ExampleText>}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
