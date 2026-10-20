"use client"

import * as React from "react"
import { CircleAlertIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/reui/alert"
import { FormContext, getInternal } from "@/lib/forms/context"
import type { FormErrorNode, FormErrorSummaryProps, FormInstance, FormPath, FormValues } from "@/lib/forms/types"
import { cn } from "@/lib/utils"

export function FormErrorSummary<I extends FormValues, O>({ form: providedForm, className, title = "请检查以下问题" }: FormErrorSummaryProps<I, O>) {
  const context = React.useContext(FormContext)
  const form = providedForm ?? context?.form as FormInstance<I, O> | undefined
  if (!form) throw new Error("ExUI FormErrorSummary: render inside a Form.")
  if (!context || context.form !== form) throw new Error("ExUI FormErrorSummary: the nearest Form must use the same instance.")
  const internal = getInternal(form)
  const state = React.useSyncExternalStore(internal.subscribe, internal.getSnapshot, internal.getServerSnapshot)
  const fields = (Object.entries(state.errors.fields) as [string, FormErrorNode | undefined][]).filter((entry): entry is [string, FormErrorNode] => Boolean(entry[1]?.issues.length))
  const roots = Object.entries(state.errors.root).filter(([, node]) => node.issues.length)
  const message = (source: string) => context.formatIssue?.(source) ?? source
  const separator = context.issueSeparator ?? "；"
  if (!fields.length && !roots.length) return null
  return <Alert variant="destructive" className={cn("ex-form-summary", className)} data-span="full">
    <CircleAlertIcon aria-hidden="true" />
    <AlertTitle>{title}</AlertTitle>
    <AlertDescription>
      <ul className="mt-1 list-inside list-disc space-y-0.5 text-sm">{fields.map(([name, node]) => <li key={name}>
        <button type="button" onClick={() => internal.navigateToField(name as FormPath<I>)} className="ex-form-summary-link">
          {internal.getFieldMetadata(name)?.label ?? name}: {[...new Set(node!.issues.map((issue) => message(issue.message)))].join(separator)}
        </button>
      </li>)}{roots.map(([key, node]) => <li key={`root:${key}`}>{[...new Set(node.issues.map((issue) => message(issue.message)))].join(separator)}</li>)}</ul>
    </AlertDescription>
  </Alert>
}
