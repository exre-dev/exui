"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BellIcon, ChartBarIcon, ChevronRightIcon, CreditCardIcon, FileTextIcon, LayoutDashboardIcon, MessageSquareIcon, SettingsIcon, ShieldIcon, UserIcon } from "lucide-react"

import { type ReactElement, useState } from "react"

import { Card, CardContent } from "@exre/exui"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@exre/exui"
import { Item, ItemMedia, ItemTitle } from "@exre/exui"


type NavItem = {
  id: string
  name: string
  icon: ReactElement
  items?: NavItem[]
}

const navItems: NavItem[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: (
      <LayoutDashboardIcon  />
    ),
    items: [
      {
        id: "analytics",
        name: "Analytics",
        icon: (
          <ChartBarIcon  />
        ),
        items: [
          {
            id: "real-time",
            name: "Real-time",
            icon: (
              <FileTextIcon aria-hidden="true" />
            ),
          },
          {
            id: "historical",
            name: "Historical",
            icon: (
              <FileTextIcon aria-hidden="true" />
            ),
          },
        ],
      },
      {
        id: "reports",
        name: "Reports",
        icon: (
          <MessageSquareIcon aria-hidden="true" />
        ),
      },
    ],
  },
  {
    id: "team",
    name: "Team",
    icon: (
      <UserIcon aria-hidden="true" />
    ),
    items: [
      {
        id: "members",
        name: "Members",
        icon: (
          <UserIcon aria-hidden="true" />
        ),
      },
      {
        id: "permissions",
        name: "Permissions",
        icon: (
          <ShieldIcon aria-hidden="true" />
        ),
      },
    ],
  },
  {
    id: "billing",
    name: "Billing",
    icon: (
      <CreditCardIcon aria-hidden="true" />
    ),
  },
  {
    id: "settings",
    name: "Settings",
    icon: (
      <SettingsIcon aria-hidden="true" />
    ),
  },
  {
    id: "notifications",
    name: "Notifications",
    icon: (
      <BellIcon aria-hidden="true" />
    ),
  },
]

function NavMenuItem({
  item,
  level = 0,
  selectedId,
  onSelect,
}: {
  item: NavItem
  level?: number
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const isFolder = !!item.items && item.items.length > 0
  const isSelected = selectedId === item.id

  if (isFolder) {
    return (
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Item asChild
            size="xs"
            className="hover:bg-accent aria-expanded:bg-accent group/item cursor-pointer bg-transparent py-1.25 focus-visible:ring-inset"
            style={{ paddingLeft: `${level * 12 + 8}px`, color: "inherit", fontFamily: "inherit", textAlign: "left" }}
          >
            <button type="button">
              <ItemMedia variant="icon">
                <div className="text-muted-foreground group-hover/item:text-foreground size-3.5">
                  {<ExampleText>{item.icon}</ExampleText>}
                </div>
              </ItemMedia>
              <ItemTitle className="text-sm in-aria-expanded:font-semibold">
                {<ExampleText>{item.name}</ExampleText>}
              </ItemTitle>
              <ChevronRightIcon aria-hidden="true" className="text-muted-foreground ml-auto size-4 transition-transform in-aria-expanded:rotate-90" />
            </button>
          </Item>
        </CollapsibleTrigger>
        <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden motion-reduce:animate-none">
          <div className="flex flex-col gap-0.5 pt-0.5">
            {<ExampleText>{item.items?.map((child) => (
              <NavMenuItem
                key={child.id}
                item={child}
                level={level + 1}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            ))}</ExampleText>}
          </div>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <Item asChild
      size="xs"
      className="hover:bg-accent data-[active=true]:bg-accent data-[active=true]:text-foreground group/item cursor-pointer bg-transparent py-1.25"
      data-active={isSelected}
      style={{ paddingLeft: `${level * 12 + 8}px`, color: "inherit", fontFamily: "inherit", textAlign: "left" }}
      onClick={() => onSelect(item.id)}
    >
      <button type="button">
        <ItemMedia variant="icon">
          <div className="text-muted-foreground group-hover/item:text-foreground group-data-[active=true]/item:text-foreground size-3.5">
            {<ExampleText>{item.icon}</ExampleText>}
          </div>
        </ItemMedia>
        <ItemTitle className="text-sm">{<ExampleText>{item.name}</ExampleText>}</ItemTitle>
      </button>
    </Item>
  )
}

  function OriginalPattern() {
  const [selectedId, setSelectedId] = useState<string | null>("real-time")

  return (
    <div className="min-h-64 w-full max-w-56">
      <Card className="p-0">
        <CardContent className="p-1">
          <div className="flex flex-col gap-0.5">
            {<ExampleText>{navItems.map((item) => (
              <NavMenuItem
                key={item.id}
                item={item}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            ))}</ExampleText>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
