"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BarChart2Icon, CircleHelpIcon, LayoutDashboardIcon, SettingsIcon } from "lucide-react"

import { useState } from "react"

import { cn } from "@exre/exui"
import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"


const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <LayoutDashboardIcon aria-hidden="true" />
    ),
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: (
      <BarChart2Icon aria-hidden="true" />
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: (
      <SettingsIcon aria-hidden="true" />
    ),
  },
  {
    id: "help",
    label: "Help",
    icon: (
      <CircleHelpIcon aria-hidden="true" />
    ),
  },
]

  function OriginalPattern() {
  const [active, setActive] = useState("dashboard")

  return (
    <ButtonGroup orientation="vertical">
      {<ExampleText>{navItems.map((item) => (
        <Button
          key={item.id}
          variant="outline"
          className={cn("justify-start", active === item.id ? "bg-muted" : "")}
          onClick={() => setActive(item.id)}
        >
          {<ExampleText>{item.icon}</ExampleText>}
          {<ExampleText>{item.label}</ExampleText>}
        </Button>
      ))}</ExampleText>}
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
