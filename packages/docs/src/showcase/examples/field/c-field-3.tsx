
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@exre/exui"
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
    <div className="mx-auto w-full max-w-xs">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={exampleId("plan-selection")}>{<ExampleText>Subscription Plan</ExampleText>}</FieldLabel>
          <Select defaultValue="pro">
            <SelectTrigger id={exampleId("plan-selection")}>
              <SelectValue placeholder={copyExample("Select a plan")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">{<ExampleText>Free - Basic features</ExampleText>}</SelectItem>
              <SelectItem value="pro">{<ExampleText>Pro - Advanced tools</ExampleText>}</SelectItem>
              <SelectItem value="enterprise">
                {<ExampleText>Enterprise - Custom solutions </ExampleText>}</SelectItem>
            </SelectContent>
          </Select>
          <FieldDescription>
            {<ExampleText>Choose the plan that best fits your needs. </ExampleText>}</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor={exampleId("billing-cycle")}>{<ExampleText>Billing Cycle</ExampleText>}</FieldLabel>
          <Select defaultValue="yearly">
            <SelectTrigger id={exampleId("billing-cycle")}>
              <SelectValue placeholder={copyExample("Select billing cycle")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">{<ExampleText>Monthly billing</ExampleText>}</SelectItem>
              <SelectItem value="yearly">{<ExampleText>Yearly billing (Save 20%)</ExampleText>}</SelectItem>
            </SelectContent>
          </Select>
          <FieldDescription>
            {<ExampleText>Billing cycles can be changed at any time. </ExampleText>}</FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
