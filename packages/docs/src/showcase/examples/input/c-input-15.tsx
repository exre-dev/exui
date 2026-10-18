
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import { Field, FieldGroup, FieldLabel } from "@exre/exui"
import { Input } from "@exre/exui"
import {
  SelectField as Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <form className="w-full">
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor={exampleId("form-phone")}>{<ExampleText>Phone</ExampleText>}</FieldLabel>
            <Input id={exampleId("form-phone")} type="tel" placeholder={copyExample("+1 (555) 123-4567")} />
          </Field>
          <Field>
            <FieldLabel htmlFor={exampleId("form-country")}>{<ExampleText>Country</ExampleText>}</FieldLabel>
            <Select defaultValue="us">
              <SelectTrigger id={exampleId("form-country")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">{<ExampleText>United States</ExampleText>}</SelectItem>
                <SelectItem value="uk">{<ExampleText>United Kingdom</ExampleText>}</SelectItem>
                <SelectItem value="ca">{<ExampleText>Canada</ExampleText>}</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor={exampleId("form-address")}>{<ExampleText>Address</ExampleText>}</FieldLabel>
          <Input id={exampleId("form-address")} type="text" placeholder={copyExample("123 Main St")} />
        </Field>
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline">
            {<ExampleText>Cancel </ExampleText>}</Button>
          <Button type="submit">{<ExampleText>Submit</ExampleText>}</Button>
        </div>
      </FieldGroup>
    </form>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
