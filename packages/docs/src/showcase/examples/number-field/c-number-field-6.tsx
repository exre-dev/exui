"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CircleAlertIcon } from "lucide-react"

import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@exre/exui"
import { Form, FormField, useForm } from "@exre/exui"

import { z } from "zod"

import { Alert, AlertDescription } from "@exre/exui"
import { Button } from "@exre/exui"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@exre/exui"


const FormSchema = z.object({
  amount: z
    .number({
      message: "Amount must be a number.",
    })
    .min(10, {
      message: "Amount must be at least 10.",
    })
    .max(100, {
      message: "Amount must be at most 100.",
    }),
})

  function OriginalPattern() {
  const { toast } = useExampleRuntime()

  const form = useForm({
    schema: FormSchema,
    defaultValues: {
      amount: 5,
    },
    mode: "onChange",
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.success("Form submitted", {
      description: (
        <Alert variant="default">
          <CircleAlertIcon  />
          <AlertDescription>
            {<ExampleText>Your form has successfully submitted with amount: </ExampleText>}{<ExampleText>{data.amount}</ExampleText>}
          </AlertDescription>
        </Alert>
      ),
    })

    form.reset()
  }

  return (
    <div className="w-full max-w-68">
      <Form form={form} onSubmit={onSubmit}>
        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <FormField form={form} noStyle
                name="amount"

                render={({ field, state: fieldState }) => (
                  <ExampleRuntimeConsumer render={({id: exampleId}) => (<Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={exampleId("number-field-amount")}>
                      {<ExampleText>Amount </ExampleText>}</FieldLabel>
                    <NumberField
                      id={exampleId("number-field-amount")}
                      value={Number.isNaN(field.value) ? null : field.value}
                      onValueChange={(value) => field.onChange(value ?? Number.NaN)}
                      min={0}
                      max={100}
                    >
                      <NumberFieldGroup
                        aria-invalid={form.getFieldState("amount").invalid}
                      >
                        <NumberFieldDecrement />
                        <NumberFieldInput />
                        <NumberFieldIncrement />
                      </NumberFieldGroup>
                    </NumberField>
                    <FieldDescription>
                      {<ExampleText>Enter an amount between 10 and 100. </ExampleText>}</FieldDescription>
                    {<ExampleText>{fieldState.issues.length > 0 && (
                      <FieldError>{<ExampleText>{fieldState.issues[0]?.message}</ExampleText>}</FieldError>
                    )}</ExampleText>}
                  </Field>)} />
                )}
              />
            </FieldGroup>
          </FieldSet>
          <Field orientation="horizontal">
            <Button
              variant="outline"
              type="button"
              onClick={() => form.reset()}
              className="flex-1"
            >
              {<ExampleText>Cancel </ExampleText>}</Button>
            <Button type="submit" className="flex-1">
              {<ExampleText>Submit </ExampleText>}</Button>
          </Field>
        </FieldGroup>
      </Form>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
