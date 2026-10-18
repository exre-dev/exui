"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ActivityIcon, LayoutDashboardIcon, ScanIcon, SettingsIcon, ShieldIcon } from "lucide-react"

import { type ReactElement } from "react"

import { Field } from "@exre/exui"
import {
  SelectField as Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@exre/exui"


interface IconPlaceholderProps {
  lucide: string
  tabler: string
  hugeicons: string
  phosphor: string
  remixicon: string
  className?: string
}

interface Item {
  label: string
  value: string | null
  icon: ReactElement<IconPlaceholderProps>
}

const items: Item[] = [
  {
    label: "Select an option",
    value: null,
    icon: (
      <ScanIcon className="text-muted-foreground size-4" />
    ),
  },
  {
    label: "Dashboard",
    value: "dashboard",
    icon: (
      <LayoutDashboardIcon className="text-muted-foreground size-4" />
    ),
  },
  {
    label: "Activity",
    value: "activity",
    icon: (
      <ActivityIcon className="text-muted-foreground size-4" />
    ),
  },
  {
    label: "Security",
    value: "security",
    icon: (
      <ShieldIcon className="text-muted-foreground size-4" />
    ),
  },
  {
    label: "Settings",
    value: "settings",
    icon: (
      <SettingsIcon className="text-muted-foreground size-4" />
    ),
  },
]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <Select>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={copyExample("Select an option")} />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {<ExampleText>{items.slice(1).map((item) => (
              <SelectItem key={item.value} value={item.value!}>
                {<ExampleText>{item.icon}</ExampleText>}
                {<ExampleText>{item.label}</ExampleText>}
              </SelectItem>
            ))}</ExampleText>}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
