"use client"


import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { AtSignIcon, CalendarClockIcon, HashIcon, SquareCheckIcon, TypeIcon, UserIcon, UsersIcon } from "lucide-react"

import { useState } from "react"
import {
  Cascader,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderPanel,
  CascaderStatus,
  CascaderTrigger,
} from "@exre/exui"
import { CascaderItems } from "@exre/exui"
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav,
  CascaderValue,
} from "@exre/exui"
import type { CascaderNode } from "@exre/exui"

import { Button } from "@exre/exui"


const textIcon = (
  <TypeIcon className="size-4" />
)
const hashIcon = (
  <HashIcon className="size-4" />
)
const usersIcon = (
  <UsersIcon className="size-4" />
)
const mailIcon = (
  <AtSignIcon className="size-4" />
)
const checkIcon = (
  <SquareCheckIcon className="size-4" />
)
const clockIcon = (
  <CalendarClockIcon className="size-4" />
)
const userIcon = (
  <UserIcon className="size-4" />
)

const attributes: CascaderNode[] = [
  { value: "record-id", label: "Record ID", icon: hashIcon },
  {
    value: "person",
    label: "Person",
    icon: usersIcon,
    count: 24,
    children: [
      { value: "person.name", label: "Name", icon: textIcon },
      {
        value: "person.email",
        label: "Email addresses",
        icon: mailIcon,
        keywords: ["mail"],
      },
      { value: "person.title", label: "Job title", icon: textIcon },
      {
        value: "person.company",
        label: "Company",
        icon: usersIcon,
        count: 8,
        children: [
          {
            value: "person.company.name",
            label: "Company name",
            icon: textIcon,
          },
          { value: "person.company.domain", label: "Domain", icon: textIcon },
          {
            value: "person.company.employees",
            label: "Employees",
            icon: hashIcon,
          },
        ],
      },
    ],
  },
  {
    value: "email",
    label: "Primary email address",
    icon: mailIcon,
    keywords: ["mail"],
  },
  { value: "user-id", label: "User ID", icon: textIcon },
  {
    value: "workspaces",
    label: "Workspaces",
    icon: usersIcon,
    count: 9,
    children: [
      { value: "workspaces.name", label: "Name", icon: textIcon },
      { value: "workspaces.plan", label: "Plan", icon: textIcon },
      { value: "workspaces.seats", label: "Seats", icon: hashIcon },
    ],
  },
  {
    value: "next-task",
    label: "Next due task",
    icon: checkIcon,
    count: 1,
    children: [{ value: "next-task.due", label: "Due date", icon: clockIcon }],
  },
  { value: "created-at", label: "Created at", icon: clockIcon },
  { value: "created-by", label: "Created by", icon: userIcon },
]

  function OriginalPattern() {
  const { copy: copyExample, locales: exampleLocales } = useExampleRuntime()

  const [value, setValue] = useState("")

  return (
    <div className="flex w-full justify-center p-4">
      <Cascader labels={exampleLocales.cascader} items={attributes} value={value} onValueChange={setValue}>
        <CascaderTrigger
          aria-label={copyExample("Attribute")}
          render={
            <Button
              variant="outline"
              className="w-72 justify-between gap-2 font-normal"
            />
          }
        >
          <CascaderValue placeholder={copyExample("Select an attribute")} maxSegments={3} />
        </CascaderTrigger>

        <CascaderContent className="w-80">
          <CascaderPanel>
            <CascaderNav>
              <CascaderInput />
            </CascaderNav>
            <CascaderBreadcrumb />
            <CascaderEmpty />
            <CascaderList>
              <CascaderItems />
            </CascaderList>
            <CascaderStatus />
          </CascaderPanel>
        </CascaderContent>
      </Cascader>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
