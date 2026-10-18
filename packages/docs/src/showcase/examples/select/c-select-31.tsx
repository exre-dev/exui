
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

const fonts = [
  { value: "sans", label: "Inter", className: "font-sans" },
  { value: "mono", label: "Mono", className: "font-mono" },
  { value: "serif", label: "Serif", className: "font-serif" },
]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <Select defaultValue={fonts[0].value}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={copyExample("Select font")} />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {<ExampleText>{fonts.map((font) => (
              <SelectItem key={font.value} value={font.value}>
                <span className={font.className}>{<ExampleText>{font.label}</ExampleText>}</span>
              </SelectItem>
            ))}</ExampleText>}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
