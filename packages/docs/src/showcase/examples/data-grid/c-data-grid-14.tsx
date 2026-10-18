"use client"

import * as React from "react"
import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
type DragEndEvent = Parameters<React.ComponentProps<typeof DataGridTableDndRows>["handleDragEnd"]>[0]
type UniqueIdentifier = string | number
type Modifier = NonNullable<React.ComponentProps<typeof DataGridTableDndRows>["modifiers"]>[number]
import { useMemo, useState } from "react"
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures,
  type DataGridFeatures,
} from "@exre/exui"
import { DataGridPagination } from "@exre/exui"
import { DataGridScrollArea } from "@exre/exui"
import {
  DataGridTableDndRowHandle,
  DataGridTableDndRows,
} from "@exre/exui"

import { arrayMove } from "../_shared/example-runtime"
import { TanStackTable } from "@exre/exui"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"

interface IData {
  id: string
  name: string
  availability: "online" | "away" | "busy" | "offline"
  avatar: string
  status: "active" | "inactive"
  flag: string // Emoji flags
  email: string
  company: string
  role: string
  joined: string
  location: string
  balance: number
}

// Let the carried row follow the pointer sideways as well as up and down.
// The default restriction pins it to the column it came from, which puts the
// clone directly on top of the rows you are trying to read; drifting it a
// little to the side lifts it clear of them, so the drop indicator underneath
// stays visible and the seam you are aiming at is much easier to judge. The
// primitive still rails the vertical axis, so the row cannot leave the grid.
const FOLLOW_POINTER: Modifier[] = [({ transform }) => transform]

const demoData: IData[] = [
  {
    id: "1",
    name: "Alex Johnson",
    availability: "online",
    avatar:
      "/examples/reui/photos/e93553df2422635515.jpg",
    status: "active",
    flag: "us",
    email: "alex@apple.com",
    company: "Apple",
    role: "CEO",
    joined: "Jan, 2024",
    location: "United States",
    balance: 5143.03,
  },
  {
    id: "2",
    name: "Sarah Chen",
    availability: "away",
    avatar:
      "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
    status: "inactive",
    flag: "gb",
    email: "sarah@openai.com",
    company: "OpenAI",
    role: "CTO",
    joined: "Mar, 2023",
    location: "United Kingdom",
    balance: 4321.87,
  },
  {
    id: "3",
    name: "Michael Rodriguez",
    availability: "busy",
    avatar:
      "/examples/reui/photos/4349381d8a8476edbc.jpg",
    status: "active",
    flag: "ca",
    email: "michael@meta.com",
    company: "Meta",
    role: "Designer",
    joined: "Jun, 2022",
    location: "Canada",
    balance: 7654.98,
  },
  {
    id: "4",
    name: "Emma Wilson",
    availability: "offline",
    avatar:
      "/examples/reui/photos/046af0b7d159f9f4fd.jpg",
    status: "inactive",
    flag: "au",
    email: "emma@tesla.com",
    company: "Tesla",
    role: "Developer",
    joined: "Sep, 2024",
    location: "Australia",
    balance: 3456.45,
  },
  {
    id: "5",
    name: "David Kim",
    availability: "online",
    avatar:
      "/examples/reui/photos/973d47055c51440af7.jpg",
    status: "active",
    flag: "de",
    email: "david@sap.com",
    company: "SAP",
    role: "Lawyer",
    joined: "Nov, 2023",
    location: "Germany",
    balance: 9876.54,
  },
  {
    id: "6",
    name: "Aron Thompson",
    availability: "away",
    avatar:
      "/examples/reui/photos/df73db9a2c25069a42.jpg",
    status: "active",
    flag: "my",
    email: "aron@keenthemes.com",
    company: "Keenthemes",
    role: "Director",
    joined: "Feb, 2022",
    location: "Malaysia",
    balance: 6214.22,
  },
]

  function OriginalPattern() {
  const { copy: copyExample, locales: exampleLocales } = useExampleRuntime()

  const columns = useMemo<TanStackTable.ColumnDef<DataGridFeatures, IData>[]>(
    () => [
      {
        id: "drag",
        cell: () => <DataGridTableDndRowHandle />,
        size: 30,
      },
      {
        accessorKey: "name",
        id: "name",
        meta: { get headerTitle() { return copyExample("Name") } }, header: () => <ExampleText>Name</ExampleText>,
        cell: ({ row }) => {
          return (
            <ExampleRuntimeConsumer render={({copy: copyExample}) => (<div className="flex items-center gap-2">
              <Avatar className="size-6">
                <AvatarImage
                  src={row.original.avatar}
                  alt={copyExample(row.original.name)}
                />
                <AvatarFallback>
                  {<ExampleText>{row.original.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}</ExampleText>}
                </AvatarFallback>
              </Avatar>
              <a onClick={(event) => event.preventDefault()}
                href="#"
                className="text-foreground hover:text-primary font-medium"
              >
                {<ExampleText>{row.original.name}</ExampleText>}
              </a>
            </div>)} />
          )
        },
        size: 170,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: "email",
        id: "email",
        header: () => <ExampleText>Email</ExampleText>,
        cell: (info) => (
          <a
            href={`mailto:${info.getValue()}`}
            className="hover:text-primary text-truncate hover:underline"
          >
            {<ExampleText>{info.getValue() as string}</ExampleText>}
          </a>
        ),
        size: 150,
        meta: {get headerTitle() { return copyExample("Email") },
          headerClassName: "",
          cellClassName: "",
        },
      },
      {
        accessorKey: "location",
        id: "location",
        header: () => <ExampleText>Location</ExampleText>,
        cell: ({ row }) => {
          return (
            <ExampleRuntimeConsumer render={({copy: copyExample}) => (<div className="flex items-center gap-1.5">
              <img
                src={`/examples/reui/flags/${row.original.flag.toLowerCase()}.svg`}
                alt={copyExample(row.original.flag)}
                className="size-4 rounded-full object-cover"
              />
              <div className="text-foreground font-medium">
                {<ExampleText>{row.original.location}</ExampleText>}
              </div>
            </div>)} />
          )
        },
        size: 170,
        meta: {get headerTitle() { return copyExample("Location") },
          headerClassName: "",
          cellClassName: "text-start",
        },
      },
    ],
    [copyExample]
  )

  const [data, setData] = useState(demoData)

  const dataIds = useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id),
    [data]
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  const table = TanStackTable.useTable({
    features: dataGridFeatures,
    // No pagination row model on v8, so every row rendered. The shared
    // bundle registers one, and manualPagination is v9's way to say the
    // data is already the page - it keeps the pagination APIs while
    // leaving the rows unsliced.
    manualPagination: true,
    columns,
    data,
    getRowId: (row: IData) => row.id,
  })

  return (
    <DataGrid i18n={exampleLocales.dataGrid}
      table={table}
      recordCount={data?.length || 0}
      tableLayout={{ rowsDraggable: true }}
    >
      <div className="w-full space-y-2.5">
        <DataGridContainer>
          <DataGridScrollArea>
            <DataGridTableDndRows
              handleDragEnd={handleDragEnd}
              dataIds={dataIds}
              modifiers={FOLLOW_POINTER}
            />
          </DataGridScrollArea>
        </DataGridContainer>
        <DataGridPagination />
      </div>
    </DataGrid>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "27.5rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
