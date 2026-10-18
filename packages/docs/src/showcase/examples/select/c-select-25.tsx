
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Field } from "@exre/exui"
import {
  SelectField as Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@exre/exui"

const countries = [
  { value: "us", label: "United States", flag: "\u{1F1FA}\u{1F1F8}" },
  { value: "gb", label: "United Kingdom", flag: "\u{1F1EC}\u{1F1E7}" },
  { value: "de", label: "Germany", flag: "\u{1F1E9}\u{1F1EA}" },
  { value: "fr", label: "France", flag: "\u{1F1EB}\u{1F1F7}" },
  { value: "jp", label: "Japan", flag: "\u{1F1EF}\u{1F1F5}" },
  { value: "au", label: "Australia", flag: "\u{1F1E6}\u{1F1FA}" },
]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <Select defaultValue={countries[0].value}>
        <SelectTrigger>
          <SelectValue placeholder={copyExample("Select country")} />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {<ExampleText>{countries.map((country) => (
              <SelectItem key={country.value} value={country.value}>
                <span className="flex items-center gap-2">
                  <span>{<ExampleText>{country.flag}</ExampleText>}</span>
                  <span>{<ExampleText>{country.label}</ExampleText>}</span>
                </span>
              </SelectItem>
            ))}</ExampleText>}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
