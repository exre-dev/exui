"use client"

import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { MoreHorizontalIcon, TriangleAlertIcon } from "lucide-react"

import * as React from "react"

import { cn } from "@exre/exui"
import { Button } from "@exre/exui"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@exre/exui"
import { Field } from "@exre/exui"


const priorityOptions = [
  { value: "none", label: "No Priority", tone: "none" },
  { value: "low", label: "Low", tone: "low" },
  { value: "medium", label: "Medium", tone: "medium" },
  { value: "high", label: "High", tone: "high" },
  { value: "urgent", label: "Urgent", tone: "urgent" },
] as const

type PriorityOption = (typeof priorityOptions)[number]

function LowPriorityIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className={cn("size-4 shrink-0", className)}
    >
      <rect x="3" y="9" width="2.5" height="4" rx="1" fill="currentColor" />
      <rect
        x="7"
        y="6"
        width="2.5"
        height="7"
        rx="1"
        fill="currentColor"
        opacity="0.28"
      />
      <rect
        x="11"
        y="3"
        width="2.5"
        height="10"
        rx="1"
        fill="currentColor"
        opacity="0.28"
      />
    </svg>
  )
}

function MediumPriorityIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className={cn("size-4 shrink-0", className)}
    >
      <rect x="3" y="9" width="2.5" height="4" rx="1" fill="currentColor" />
      <rect x="7" y="6" width="2.5" height="7" rx="1" fill="currentColor" />
      <rect
        x="11"
        y="3"
        width="2.5"
        height="10"
        rx="1"
        fill="currentColor"
        opacity="0.28"
      />
    </svg>
  )
}

function HighPriorityIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className={cn("size-4 shrink-0", className)}
    >
      <rect x="3" y="9" width="2.5" height="4" rx="1" fill="currentColor" />
      <rect x="7" y="6" width="2.5" height="7" rx="1" fill="currentColor" />
      <rect x="11" y="3" width="2.5" height="10" rx="1" fill="currentColor" />
    </svg>
  )
}

function PriorityGlyph({
  tone,
  className,
}: {
  tone: PriorityOption["tone"]
  className?: string
}) {
  switch (tone) {
    case "none":
      return (
        <MoreHorizontalIcon className={cn(
            "text-muted-foreground! [&_*]:text-muted-foreground! size-4 shrink-0",
            className
          )} />
      )
    case "low":
      return (
        <LowPriorityIcon
          className={cn("text-foreground! [&_*]:text-foreground!", className)}
        />
      )
    case "medium":
      return (
        <MediumPriorityIcon
          className={cn("text-foreground! [&_*]:text-foreground!", className)}
        />
      )
    case "high":
      return (
        <HighPriorityIcon
          className={cn("text-foreground! [&_*]:text-foreground!", className)}
        />
      )
    case "urgent":
      return (
        <TriangleAlertIcon className={cn(
            "size-4 shrink-0 text-yellow-500! [&_*]:text-yellow-500!",
            className
          )} />
      )
  }
}

function PriorityLabel({
  priority,
  className,
}: {
  priority: PriorityOption
  className?: string
}) {
  const labelClassName =
    priority.tone === "urgent" ? "text-yellow-500!" : "text-foreground!"

  return (
    <span
      className={cn(
        "text-foreground! flex min-w-0 items-center gap-2",
        priority.tone === "urgent" && "text-yellow-500!",
        className
      )}
    >
      <PriorityGlyph tone={priority.tone} />
      <span className={cn("truncate", labelClassName)}>{<ExampleText>{priority.label}</ExampleText>}</span>
    </span>
  )
}

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [priority, setPriority] = React.useState<PriorityOption | null>(
    priorityOptions[0]
  )

  return (
    <Field className="max-w-xs">
      <Combobox
        items={priorityOptions}
        value={priority}
        onValueChange={setPriority}
        itemToStringValue={(item: PriorityOption) => item.label}
        autoHighlight
      >
        <ComboboxTrigger
          render={
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between font-normal"
            />
          }
        >
          <ComboboxValue placeholder={copyExample("Set priority")}>
            {(selectedPriority: PriorityOption | null) =>
              selectedPriority ? (
                <PriorityLabel priority={selectedPriority} />
              ) : (
                <span className="text-muted-foreground">{<ExampleText>Set priority</ExampleText>}</span>
              )
            }
          </ComboboxValue>
        </ComboboxTrigger>

        <ComboboxContent className="max-w-(--anchor-width) min-w-(--anchor-width)">
          <ComboboxInput
            showTrigger={false}
            placeholder={copyExample("Change priority")}
            className="mb-1"
          />
          <ComboboxEmpty>{<ExampleText>No priorities found.</ExampleText>}</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.value} value={item}>
                <PriorityLabel priority={item} />
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
