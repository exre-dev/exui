
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Field } from "@exre/exui"
import {
  SelectField as Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@exre/exui"

const americas = [
  { value: "est", label: "EST", offset: "UTC-5" },
  { value: "cst", label: "CST", offset: "UTC-6" },
  { value: "pst", label: "PST", offset: "UTC-8" },
]

const europe = [
  { value: "gmt", label: "GMT", offset: "UTC+0" },
  { value: "cet", label: "CET", offset: "UTC+1" },
]

const asia = [
  { value: "ist", label: "IST", offset: "UTC+5:30" },
  { value: "jst", label: "JST", offset: "UTC+9" },
]



  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder={copyExample("Select a timezone")} />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            <SelectLabel>{<ExampleText>Americas</ExampleText>}</SelectLabel>
            {<ExampleText>{americas.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                <span className="flex items-center justify-between gap-3">
                  <span>{<ExampleText>{tz.label}</ExampleText>}</span>
                  <span className="text-muted-foreground text-xs">
                    {<ExampleText>{tz.offset}</ExampleText>}
                  </span>
                </span>
              </SelectItem>
            ))}</ExampleText>}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>{<ExampleText>Europe</ExampleText>}</SelectLabel>
            {<ExampleText>{europe.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                <span className="flex items-center justify-between gap-3">
                  <span>{<ExampleText>{tz.label}</ExampleText>}</span>
                  <span className="text-muted-foreground text-xs">
                    {<ExampleText>{tz.offset}</ExampleText>}
                  </span>
                </span>
              </SelectItem>
            ))}</ExampleText>}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>{<ExampleText>Asia</ExampleText>}</SelectLabel>
            {<ExampleText>{asia.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                <span className="flex items-center justify-between gap-3">
                  <span>{<ExampleText>{tz.label}</ExampleText>}</span>
                  <span className="text-muted-foreground text-xs">
                    {<ExampleText>{tz.offset}</ExampleText>}
                  </span>
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
