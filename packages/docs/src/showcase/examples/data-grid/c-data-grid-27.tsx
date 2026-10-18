"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime, createExampleRandom } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { RefreshCwIcon } from "lucide-react"
const exampleRandom = createExampleRandom("c-data-grid-27")
import { useMemo, useState } from "react"
import { Badge } from "@exre/exui"
import {
  DataGrid,
  dataGridFeatures,
  type DataGridFeatures,
} from "@exre/exui"
import { DataGridColumnHeader } from "@exre/exui"
import { DataGridScrollArea } from "@exre/exui"
import { DataGridTableVirtual } from "@exre/exui"
import { TanStackTable } from "@exre/exui"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Button } from "@exre/exui"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@exre/exui"


interface IData {
  id: string
  name: string
  avatar: string
  department: string
  status: "Active" | "Inactive" | "Pending"
  balance: number
}

const avatars = [
  "/examples/reui/photos/e93553df2422635515.jpg",
  "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
  "/examples/reui/photos/4349381d8a8476edbc.jpg",
  "/examples/reui/photos/046af0b7d159f9f4fd.jpg",
  "/examples/reui/photos/973d47055c51440af7.jpg",
  "/examples/reui/photos/df73db9a2c25069a42.jpg",
]

const names = [
  "Alex Johnson",
  "Sarah Chen",
  "Michael Rodriguez",
  "Emma Wilson",
  "David Kim",
  "Aron Thompson",
  "James Brown",
  "Maria Garcia",
  "Nick Johnson",
  "Liam Thompson",
]

const departments = [
  "Engineering",
  "Marketing",
  "Design",
  "Sales",
  "Finance",
  "Operations",
  "Legal",
  "Support",
]

const statuses: IData["status"][] = ["Active", "Inactive", "Pending"]

function generateData(count: number): IData[] {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    name: names[i % names.length],
    avatar: avatars[i % avatars.length],
    department: departments[i % departments.length],
    status: statuses[i % statuses.length],
    balance: Math.round((exampleRandom() * 9000 + 1000) * 100) / 100,
  }))
}

const allData = generateData(200)

  function OriginalPattern() {
  const { locales: exampleLocales } = useExampleRuntime()

  const [sorting, setSorting] = useState<TanStackTable.SortingState>([])

  const columns = useMemo<TanStackTable.ColumnDef<DataGridFeatures, IData>[]>(
    () => [
      {
        accessorKey: "id",
        id: "id",
        header: ({ column }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<DataGridColumnHeader title={copyExample("#")} column={column} />)} />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground tabular-nums">
            {<ExampleText>{row.original.id}</ExampleText>}
          </span>
        ),
        size: 70,
        enableSorting: false,
      },
      {
        accessorKey: "name",
        id: "name",
        header: ({ column }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<DataGridColumnHeader title={copyExample("User")} column={column} />)} />
        ),
        cell: ({ row }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<div className="flex items-center gap-3">
            <Avatar className="size-7">
              <AvatarImage src={row.original.avatar} alt={copyExample(row.original.name)} />
              <AvatarFallback>
                {<ExampleText>{row.original.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}</ExampleText>}
              </AvatarFallback>
            </Avatar>
            <span className="text-foreground font-medium">
              {<ExampleText>{row.original.name}</ExampleText>}
            </span>
          </div>)} />
        ),
        minSize: 150,
        meta: {
          autoSize: true,
        },
        enableSorting: true,
      },
      {
        accessorKey: "department",
        id: "department",
        header: ({ column }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<DataGridColumnHeader title={copyExample("Department")} column={column} />)} />
        ),
        cell: ({ row }) => row.original.department,
        size: 150,
        enableSorting: true,
      },
      {
        accessorKey: "status",
        id: "status",
        header: ({ column }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<DataGridColumnHeader title={copyExample("Status")} column={column} />)} />
        ),
        cell: ({ row }) => {
          const s = row.original.status
          if (s === "Active")
            return <Badge variant="success-outline">{<ExampleText>Active</ExampleText>}</Badge>
          if (s === "Inactive")
            return <Badge variant="info-outline">{<ExampleText>Inactive</ExampleText>}</Badge>
          return <Badge variant="warning-outline">{<ExampleText>Pending</ExampleText>}</Badge>
        },
        size: 120,
        enableSorting: true,
      },
      {
        accessorKey: "balance",
        id: "balance",
        header: ({ column }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<DataGridColumnHeader title={copyExample("Balance")} column={column} />)} />
        ),
        cell: ({ row }) => (
          <span className="tabular-nums">
            $
            {<ExampleText>{row.original.balance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}</ExampleText>}
          </span>
        ),
        size: 140,
        enableSorting: true,
        enableResizing: true,
      },
    ],
    []
  )

  const table = TanStackTable.useTable({
    features: dataGridFeatures,
    // No pagination row model on v8, so every row rendered. The shared
    // bundle registers one, and manualPagination is v9's way to say the
    // data is already the page - it keeps the pagination APIs while
    // leaving the rows unsliced.
    manualPagination: true,
    columns,
    data: allData,
    getRowId: (row: IData) => row.id,
    state: { sorting },
    onSortingChange: setSorting,
  })

  return (
    <DataGrid i18n={exampleLocales.dataGrid}
      table={table}
      recordCount={allData.length}
      tableLayout={{
        columnsResizable: true,
        headerSticky: true,
      }}
      tableClassNames={{
        headerSticky: "sticky top-0 z-10 bg-muted/90 backdrop-blur-xs",
      }}
    >
      <Card className="w-full gap-0 p-0">
        <CardHeader className="flex items-center justify-between gap-3 px-4 py-2">
          <CardTitle className="text-sm font-medium">
            {<ExampleText>Virtualized Directory </ExampleText>}</CardTitle>
          <CardAction>
            <Button variant="outline" size="sm">
              <RefreshCwIcon  />
              {<ExampleText>Refresh </ExampleText>}</Button>
          </CardAction>
        </CardHeader>
        <CardContent className="border-t p-0">
          <DataGridScrollArea className="h-[480px]">
            <DataGridTableVirtual estimateSize={49} />
          </DataGridScrollArea>
        </CardContent>
      </Card>
    </DataGrid>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "34.25rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
