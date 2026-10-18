"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BuildingIcon, CheckIcon, ChevronsUpDownIcon, LifeBuoyIcon, LogOutIcon, MonitorIcon, MoonIcon, PhoneIcon, SettingsIcon, SunIcon } from "lucide-react"

import { useState } from "react"
import { Badge } from "@exre/exui"

import { cn } from "@exre/exui"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Button } from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@exre/exui"
import { Tabs, TabsList, TabsTrigger } from "@exre/exui"


const statuses = [
  { value: "available", label: "Available", color: "bg-green-500" },
  { value: "away", label: "Away", color: "bg-amber-500" },
  { value: "busy", label: "Busy", color: "bg-red-500" },
  { value: "offline", label: "Offline", color: "bg-gray-400" },
]

  function OriginalPattern() {
  const [status, setStatus] = useState("available")
  const [theme, setTheme] = useState("light")

  const activeStatus = statuses.find((s) => s.value === status) || statuses[0]

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-40">
            <Avatar className="size-4">
              <AvatarImage src="/examples/reui/photos/0a10b9bc070f3bdf60.jpg" />
              <AvatarFallback>{<ExampleText>CN</ExampleText>}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{<ExampleText>shadcn</ExampleText>}</span>

            <ChevronsUpDownIcon className="ml-auto opacity-60" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60" align="start" sideOffset={8}>
          <div className="flex items-center gap-3 px-1 pt-1.5">
            <Avatar className="size-8">
              <AvatarImage src="/examples/reui/photos/0a10b9bc070f3bdf60.jpg" />
              <AvatarFallback>{<ExampleText>CN</ExampleText>}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-foreground text-sm font-medium">
                {<ExampleText>shadcn </ExampleText>}</span>
              <span className="text-muted-foreground text-xs">
                {<ExampleText>ui@shadcn.com </ExampleText>}</span>
            </div>
          </div>
          <div className="py-2.5">
            <Tabs value={theme} onValueChange={setTheme}>
              <TabsList className="w-full">
                <TabsTrigger value="light" className="h-6 flex-1">
                  <SunIcon className="size-4" aria-hidden="true" />
                </TabsTrigger>
                <TabsTrigger value="dark" className="h-6 flex-1">
                  <MoonIcon className="size-4" aria-hidden="true" />
                </TabsTrigger>
                <TabsTrigger value="system" className="h-6 flex-1">
                  <MonitorIcon className="size-4" aria-hidden="true" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="justify-between"
            >
              <span className="flex items-center gap-2">
                <BuildingIcon aria-hidden="true" />
                {<ExampleText>Your Companies </ExampleText>}</span>
              <Badge
                variant="secondary"
                size="sm"
                className="rounded-full px-1.5"
              >
                12
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="justify-between"
            >
              <span className="flex items-center gap-2">
                <PhoneIcon aria-hidden="true" />
                {<ExampleText>Your Numbers </ExampleText>}</span>
              <Badge
                variant="secondary"
                size="sm"
                className="rounded-full px-1.5"
              >
                2
              </Badge>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span className="flex items-center gap-2">
                <span
                  className={cn("size-2 rounded-full", activeStatus.color)}
                />
                {<ExampleText>{activeStatus.label}</ExampleText>}
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-40">
              {<ExampleText>{statuses.map((s) => (
                <DropdownMenuItem
                  key={s.value}
                  onClick={() => setStatus(s.value)}
                  className="justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span className={`size-2 rounded-full ${s.color}`} />
                    {<ExampleText>{s.label}</ExampleText>}
                  </span>
                  {<ExampleText>{status === s.value && (
                    <CheckIcon className="text-muted-foreground size-4" aria-hidden="true" />
                  )}</ExampleText>}
                </DropdownMenuItem>
              ))}</ExampleText>}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <SettingsIcon aria-hidden="true" />
              {<ExampleText>Settings </ExampleText>}</DropdownMenuItem>
            <DropdownMenuItem>
              <LifeBuoyIcon aria-hidden="true" />
              {<ExampleText>Help Center </ExampleText>}</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <LogOutIcon aria-hidden="true" />
            {<ExampleText>Logout </ExampleText>}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
