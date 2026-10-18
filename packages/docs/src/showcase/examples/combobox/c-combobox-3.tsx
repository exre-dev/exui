
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
import { Field, FieldError, FieldLabel } from "@exre/exui"

const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"]

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs" data-invalid>
      <FieldLabel htmlFor={exampleId("combobox-framework-invalid")}>{<ExampleText>Framework</ExampleText>}</FieldLabel>
      <Combobox items={frameworks}>
        <ComboboxInput
          id={exampleId("combobox-framework-invalid")}
          placeholder={copyExample("Select a framework")}
          aria-invalid
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
      <FieldError errors={[{ message: "This field is required." }]} />
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
