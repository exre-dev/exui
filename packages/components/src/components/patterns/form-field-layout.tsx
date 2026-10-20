"use client"

import * as React from "react"
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/components/ui/field"
import type { FormFieldLayout as FieldLayout, FormFieldSpan } from "@/lib/forms/types"
import { cn } from "@/lib/utils"

interface FieldLayoutProps extends Omit<React.ComponentProps<"div">, "title" | "children"> {
  title?: React.ReactNode
  desc?: React.ReactNode
  layout?: FieldLayout
  /** Maximum content width in horizontal rows; numbers are CSS pixels. */
  contentMaxWidth?: React.CSSProperties["maxWidth"]
  contentAlign?: "left" | "right"
  span?: FormFieldSpan
  controlId?: string
  children: React.ReactNode
}

// FormShell supplies only presentation layout, never form state or field binding.
type ItemPresentation = Pick<FieldLayoutProps, "layout" | "contentMaxWidth" | "contentAlign">
const FormFieldLayoutContext = React.createContext<ItemPresentation>({})

export function FormFieldLayoutProvider({ layout, contentMaxWidth, contentAlign, children }: ItemPresentation & { children: React.ReactNode }) {
  const value = React.useMemo(() => ({ layout, contentMaxWidth, contentAlign }), [layout, contentMaxWidth, contentAlign])
  return <FormFieldLayoutContext.Provider value={value}>{children}</FormFieldLayoutContext.Provider>
}

function hasContent(value: React.ReactNode): boolean {
  return value !== null && value !== undefined && value !== false && value !== ""
}

export function FormFieldLayout({ title, desc, layout, contentMaxWidth, contentAlign, span = 1, controlId, children, className, style, ref, ...rootProps }: FieldLayoutProps) {
  const inherited = React.useContext(FormFieldLayoutContext)
  const effectiveLayout = layout ?? inherited.layout ?? "vertical"
  const maxWidth = contentMaxWidth ?? inherited.contentMaxWidth
  const contentStyle = { "--ex-item-content-max-width": typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth ?? "100%" } as React.CSSProperties
  const effectiveId = controlId
  const descriptionId = effectiveId && hasContent(desc) ? `${effectiveId}-description` : undefined
  const hasTitle = hasContent(title)
  const hasDescription = hasContent(desc)

  return <Field {...rootProps} ref={ref} className={cn("ex-item", className)} style={style}
    data-span={span} data-item-layout={effectiveLayout} orientation="vertical">
    {(hasTitle || hasDescription) && <div className="ex-item-heading">
      {hasTitle && (effectiveId
        ? <FieldLabel id={`${effectiveId}-label`} htmlFor={effectiveId} className="ex-item-title">{title}</FieldLabel>
        : <FieldTitle className="ex-item-title">{title}</FieldTitle>)}
      {hasDescription && <FieldDescription id={descriptionId} className="ex-item-description">{desc}</FieldDescription>}
    </div>}
    <FieldContent className="ex-item-content" data-item-layout={effectiveLayout} data-content-align={contentAlign ?? inherited.contentAlign ?? "left"}>
      <div className="ex-item-body" style={contentStyle}>{children}</div>
    </FieldContent>
  </Field>
}
