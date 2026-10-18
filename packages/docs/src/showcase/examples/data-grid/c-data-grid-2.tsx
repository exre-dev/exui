"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useMemo, useState } from "react"
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures,
  type DataGridFeatures,
} from "@exre/exui"
import { DataGridPagination } from "@exre/exui"
import { DataGridScrollArea } from "@exre/exui"
import { DataGridTable } from "@exre/exui"
import { TanStackTable } from "@exre/exui"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Card } from "@exre/exui"

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

const users = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar:
      "/examples/reui/photos/e93553df2422635515.jpg",
    initials: "AJ",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah@example.com",
    avatar:
      "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
    initials: "SC",
  },
  {
    id: "3",
    name: "Michael Rodriguez",
    email: "michael@example.com",
    avatar:
      "/examples/reui/photos/4349381d8a8476edbc.jpg",
    initials: "MR",
  },
  {
    id: "4",
    name: "Emma Wilson",
    email: "emma@example.com",
    avatar:
      "/examples/reui/photos/046af0b7d159f9f4fd.jpg",
    initials: "EW",
  },
  {
    id: "5",
    name: "David Kim",
    email: "david@example.com",
    avatar:
      "/examples/reui/photos/973d47055c51440af7.jpg",
    initials: "DK",
  },
  {
    id: "6",
    name: "Aron Thompson",
    email: "lisa@example.com",
    avatar:
      "/examples/reui/photos/df73db9a2c25069a42.jpg",
    initials: "LT",
  },
  {
    id: "7",
    name: "James Brown",
    email: "james@example.com",
    avatar:
      "/examples/reui/photos/c75592a667f30cfd44.jpg",
    initials: "JB",
  },
  {
    id: "8",
    name: "Maria Garcia",
    email: "maria@example.com",
    avatar:
      "/examples/reui/photos/067c566cd567259bb9.jpg",
    initials: "MG",
  },
  {
    id: "9",
    name: "Nick Johnson",
    email: "nick@example.com",
    avatar:
      "/examples/reui/photos/f1d4253436738aaf8f.jpg",
    initials: "NJ",
  },
  {
    id: "10",
    name: "Liam Thompson",
    email: "liam@example.com",
    avatar:
      "/examples/reui/photos/a3afee2f77d259ce6a.jpg",
    initials: "LT",
  },
]

const demoData: IData[] = users.map((user, index) => ({
  ...user,
  availability: (["online", "away", "busy", "offline"] as const)[index % 4],
  status: (index % 2 === 0 ? "active" : "inactive") as "active" | "inactive",
  flag: (["us", "gb", "ca", "au", "de", "my", "es", "jp", "fr", "it"] as const)[
    index % 10
  ],
  company: (
    [
      "Apple",
      "OpenAI",
      "Meta",
      "Tesla",
      "SAP",
      "Keenthemes",
      "BBVA",
      "Sony",
      "LVMH",
      "ENI",
    ] as const
  )[index % 10],
  role: (
    [
      "CEO",
      "CTO",
      "Designer",
      "Developer",
      "Lawyer",
      "Director",
      "Product Manager",
      "Marketing Lead",
      "Data Scientist",
      "Engineer",
    ] as const
  )[index % 10],
  joined: "Jan, 2024",
  location: (
    [
      "United States",
      "United Kingdom",
      "Canada",
      "Australia",
      "Germany",
      "Malaysia",
      "Spain",
      "Japan",
      "France",
      "Italy",
    ] as const
  )[index % 10],
  balance: 5143.03 + index * 100,
}))

  function OriginalPattern() {
  const { copy: copyExample, locales: exampleLocales } = useExampleRuntime()

  const [pagination, setPagination] = useState<TanStackTable.PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })
  const [sorting, setSorting] = useState<TanStackTable.SortingState>([
    { id: "name", desc: true },
  ])
  const [columnOrder, setColumnOrder] = useState<TanStackTable.ColumnOrderState>([])

  const columns = useMemo<TanStackTable.ColumnDef<DataGridFeatures, IData>[]>(
    () => [
      {
        accessorKey: "name",
        id: "name",
        meta: { get headerTitle() { return copyExample("Name") } }, header: () => <ExampleText>Name</ExampleText>,
        cell: ({ row }) => {
          return (
            <ExampleRuntimeConsumer render={({copy: copyExample}) => (<div className="flex items-center gap-3">
              <Avatar className="size-8">
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
              <div className="space-y-px">
                <div className="text-foreground font-medium">
                  {<ExampleText>{row.original.name}</ExampleText>}
                </div>
                <div className="text-muted-foreground">
                  {<ExampleText>{row.original.email}</ExampleText>}
                </div>
              </div>
            </div>)} />
          )
        },
        size: 250,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: "company",
        header: () => <ExampleText>Company</ExampleText>,
        cell: (info) => <span>{<ExampleText>{info.getValue() as string}</ExampleText>}</span>,
        size: 100,
        meta: {get headerTitle() { return copyExample("Company") },
          headerClassName: "",
        },
      },
      {
        accessorKey: "role",
        header: () => <ExampleText>Occupation</ExampleText>,
        cell: (info) => <span>{<ExampleText>{info.getValue() as string}</ExampleText>}</span>,
        size: 100,
        meta: {get headerTitle() { return copyExample("Occupation") },
          headerClassName: "",
        },
      },
      {
        accessorKey: "balance",
        meta: { get headerTitle() { return copyExample("Salary") } }, header: () => <ExampleText>Salary</ExampleText>,
        cell: (info) => (
          <span className="font-semibold">
            ${<ExampleText>{(info.getValue() as number).toFixed(2)}</ExampleText>}
          </span>
        ),
        size: 100,
      },
    ],
    [copyExample]
  )

  const table = TanStackTable.useTable({
    features: dataGridFeatures,
    columns,
    data: demoData,
    pageCount: Math.ceil((demoData?.length || 0) / pagination.pageSize),
    getRowId: (row: IData) => row.id,
    state: {
      pagination,
      sorting,
      columnOrder,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
  })

  return (
    <DataGrid i18n={exampleLocales.dataGrid}
      table={table}
      recordCount={demoData?.length || 0}
      tableLayout={{
        cellBorder: true,
      }}
    >
      <div className="w-full space-y-2.5">
        <Card className="p-0">
          <DataGridContainer>
            <DataGridScrollArea>
              <DataGridTable />
            </DataGridScrollArea>
          </DataGridContainer>
        </Card>
        <DataGridPagination />
      </div>
    </DataGrid>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "31.5rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
