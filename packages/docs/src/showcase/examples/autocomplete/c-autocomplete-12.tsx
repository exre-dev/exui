"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CircleAlertIcon } from "lucide-react"

import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@exre/exui"
import { Form, FormItem, useForm } from "@exre/exui"

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
  feature: z
    .string()
    .min(1, "Please select an item.")
    .refine(
      (val) => items.some((item) => item.value === val),
      "Please select a valid item."
    ),
})

  function OriginalPattern() {
  const { toast } = useExampleRuntime()

  const form = useForm({
    schema: FormSchema,
    defaultValues: { feature: "" },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.success("Form submitted", {
      description: (
        <Alert variant="default">
          <CircleAlertIcon  />
          <AlertDescription>
            {<ExampleText>Your form has successfully submitted with feature: </ExampleText>}{<ExampleText>{data.feature}</ExampleText>}
          </AlertDescription>
        </Alert>
      ),
    })

    form.reset()
  }

  return (
    <div className="w-full max-w-xs">
      <Form form={form} onSubmit={onSubmit}>
        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <FormItem form={form} noStyle
                name="feature"

                render={({ field, state: fieldState }) => (
                  <ExampleRuntimeConsumer render={({id: exampleId, copy: copyExample}) => (<Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor={exampleId("autocomplete-feature")}>
                      {<ExampleText>Select Feature </ExampleText>}</FieldLabel>
                    <Autocomplete
                      items={items}
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value)
                      }}
                    >
                      <AutocompleteInput
                        id={exampleId("autocomplete-feature")}
                        placeholder={copyExample("e.g. feature")}
                        aria-invalid={form.getFieldState("feature").invalid}
                      />
                      <AutocompleteContent>
                        <AutocompleteEmpty>{<ExampleText>No items found.</ExampleText>}</AutocompleteEmpty>
                        <AutocompleteList>
                          {(item) => (
                            <AutocompleteItem key={item.id} value={item.value}>
                              {<ExampleText>{item.value}</ExampleText>}
                            </AutocompleteItem>
                          )}
                        </AutocompleteList>
                      </AutocompleteContent>
                    </Autocomplete>
                    <FieldDescription>
                      {<ExampleText>Search and select a component feature. </ExampleText>}</FieldDescription>
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

interface Item {
  id: string
  value: string
}

const items: Item[] = [
  { id: "t1", value: "feature" },
  { id: "t2", value: "fix" },
  { id: "t3", value: "bug" },
  { id: "t4", value: "docs" },
  { id: "t5", value: "internal" },
  { id: "t6", value: "mobile" },
  { id: "c-accordion", value: "component: accordion" },
  { id: "c-alert-dialog", value: "component: alert dialog" },
  { id: "c-autocomplete", value: "component: autocomplete" },
  { id: "c-avatar", value: "component: avatar" },
  { id: "c-checkbox", value: "component: checkbox" },
  { id: "c-checkbox-group", value: "component: checkbox group" },
  { id: "c-collapsible", value: "component: collapsible" },
  { id: "c-combobox", value: "component: combobox" },
  { id: "c-context-menu", value: "component: context menu" },
  { id: "c-dialog", value: "component: dialog" },
  { id: "c-field", value: "component: field" },
  { id: "c-fieldset", value: "component: fieldset" },
  { id: "c-filterable-menu", value: "component: filterable menu" },
  { id: "c-form", value: "component: form" },
  { id: "c-input", value: "component: input" },
  { id: "c-menu", value: "component: menu" },
  { id: "c-menubar", value: "component: menubar" },
  { id: "c-meter", value: "component: meter" },
  { id: "c-navigation-menu", value: "component: navigation menu" },
  { id: "c-number-field", value: "component: number field" },
  { id: "c-popover", value: "component: popover" },
  { id: "c-preview-card", value: "component: preview card" },
  { id: "c-progress", value: "component: progress" },
  { id: "c-radio", value: "component: radio" },
  { id: "c-scroll-area", value: "component: scroll area" },
  { id: "c-select", value: "component: select" },
  { id: "c-separator", value: "component: separator" },
  { id: "c-slider", value: "component: slider" },
  { id: "c-switch", value: "component: switch" },
  { id: "c-tabs", value: "component: tabs" },
  { id: "c-toast", value: "component: toast" },
  { id: "c-toggle", value: "component: toggle" },
  { id: "c-toggle-group", value: "component: toggle group" },
  { id: "c-toolbar", value: "component: toolbar" },
  { id: "c-tooltip", value: "component: tooltip" },
]

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
