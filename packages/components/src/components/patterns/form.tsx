"use client"

import * as React from "react"
import { getInternal } from "@/lib/forms/context"
import type { FormComposedProps, FormConfiguredInstanceProps, FormConfiguredSchemaProps, FormSchema, FormValues } from "@/lib/forms/types"
import { FormConfigured } from "./form-configured"
import { FormShell } from "./form-shell"

const configurationProps = ["steps", "currentStep", "onStepChange", "footer", "submitLabel", "resetLabel", "backLabel", "nextLabel", "stepsAriaLabel"] as const
const sourceProps = ["schema", "defaultValues", "mode", "reValidateMode"] as const

function assertEntry(props: Record<string, unknown>, configured: boolean) {
  const fail = (message: string): never => { throw new Error(`ExUI Form: ${message}`) }
  if (typeof props.onSubmit !== "function") fail("onSubmit must be a function.")
  if (props.onReset !== undefined || props.noValidate !== undefined) fail("onReset and noValidate are managed by Form.")
  if (configured && !Array.isArray(props.fields)) fail("fields must be an array.")
  if (props.form !== undefined) {
    if (sourceProps.some((name) => props[name] !== undefined)) fail("an existing form cannot receive schema, defaultValues or validation modes.")
    try { getInternal(props.form as FormComposedProps<FormValues, unknown>["form"]) }
    catch { fail("form must be an instance created by ExUI useForm.") }
  } else if (configured) {
    const schema = props.schema as FormSchema | null | undefined
    if (!schema || (typeof schema !== "object" && typeof schema !== "function") || schema["~standard"]?.version !== 1 || typeof schema["~standard"].validate !== "function") fail("configured forms require an ExUI form instance or a Standard Schema.")
    if (!props.defaultValues || typeof props.defaultValues !== "object" || Array.isArray(props.defaultValues)) fail("schema forms require defaultValues.")
  } else {
    fail("composed forms require an ExUI form instance; schema forms require fields.")
  }
  if (!configured && configurationProps.some((name) => props[name] !== undefined)) fail("configured props require fields.")
}

export function Form<const S extends FormSchema>(props: FormConfiguredSchemaProps<S>): React.ReactElement
export function Form<I extends FormValues, O>(props: FormConfiguredInstanceProps<I, O>): React.ReactElement
export function Form<I extends FormValues, O>(props: FormComposedProps<I, O>): React.ReactElement
export function Form(props: unknown): React.ReactElement {
  const runtime = props as Record<string, unknown>
  const configured = runtime.fields !== undefined
  const initialBranch = React.useRef(configured)
  if (initialBranch.current !== configured) throw new Error("ExUI Form: changing composed/configured mode requires a new key.")
  assertEntry(runtime, configured)
  return configured
    ? <FormConfigured {...props as FormConfiguredSchemaProps<FormSchema> | FormConfiguredInstanceProps<FormValues, unknown>} />
    : <FormShell {...props as FormComposedProps<FormValues, unknown>} />
}
