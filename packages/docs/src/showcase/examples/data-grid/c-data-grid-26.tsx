"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { DownloadIcon } from "lucide-react"

import { useMemo, useState } from "react"
import { Badge } from "@exre/exui"
import {
  DataGrid,
  dataGridFeatures,
  type DataGridFeatures,
} from "@exre/exui"
import { DataGridColumnHeader } from "@exre/exui"
import { DataGridPagination } from "@exre/exui"
import { DataGridScrollArea } from "@exre/exui"
import {
  DataGridTable,
  DataGridTableFootRow,
  DataGridTableFootRowCell,
} from "@exre/exui"
import { TanStackTable } from "@exre/exui"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Button } from "@exre/exui"
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@exre/exui"


interface IData {
  id: string
  name: string
  avatar: string
  status: "Active" | "Inactive" | "Pending" | "Blocked"
  balance: number
  transactions: number
}

const demoData: IData[] = [
  {
    id: "1",
    name: "Alex Johnson",
    avatar:
      "/examples/reui/photos/e93553df2422635515.jpg",
    status: "Active",
    balance: 5143.03,
    transactions: 48,
  },
  {
    id: "2",
    name: "Sarah Chen",
    avatar:
      "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
    status: "Inactive",
    balance: 4321.87,
    transactions: 31,
  },
  {
    id: "3",
    name: "Michael Rodriguez",
    avatar:
      "/examples/reui/photos/4349381d8a8476edbc.jpg",
    status: "Blocked",
    balance: 7654.98,
    transactions: 67,
  },
  {
    id: "4",
    name: "Emma Wilson",
    avatar:
      "/examples/reui/photos/046af0b7d159f9f4fd.jpg",
    status: "Inactive",
    balance: 3456.45,
    transactions: 22,
  },
  {
    id: "5",
    name: "David Kim",
    avatar:
      "/examples/reui/photos/973d47055c51440af7.jpg",
    status: "Active",
    balance: 9876.54,
    transactions: 93,
  },
  {
    id: "6",
    name: "Aron Thompson",
    avatar:
      "/examples/reui/photos/df73db9a2c25069a42.jpg",
    status: "Pending",
    balance: 6214.22,
    transactions: 55,
  },
  {
    id: "7",
    name: "James Brown",
    avatar:
      "/examples/reui/photos/c75592a667f30cfd44.jpg",
    status: "Inactive",
    balance: 5321.77,
    transactions: 40,
  },
  {
    id: "8",
    name: "Maria Garcia",
    avatar:
      "/examples/reui/photos/067c566cd567259bb9.jpg",
    status: "Blocked",
    balance: 8452.39,
    transactions: 74,
  },
  {
    id: "9",
    name: "Nick Johnson",
    avatar:
      "/examples/reui/photos/f1d4253436738aaf8f.jpg",
    status: "Pending",
    balance: 7345.1,
    transactions: 61,
  },
  {
    id: "10",
    name: "Liam Thompson",
    avatar:
      "/examples/reui/photos/a3afee2f77d259ce6a.jpg",
    status: "Inactive",
    balance: 5214.88,
    transactions: 37,
  },
]

  function OriginalPattern() {
  const { locales: exampleLocales } = useExampleRuntime()

  const [pagination, setPagination] = useState<TanStackTable.PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })
  const [sorting, setSorting] = useState<TanStackTable.SortingState>([
    { id: "name", desc: false },
  ])

  const aggregates = useMemo(() => {
    const n = demoData.length
    const balances = demoData.map((r) => r.balance)
    const txns = demoData.map((r) => r.transactions)
    return {
      avgBalance: balances.reduce((a, b) => a + b, 0) / n,
      minBalance: Math.min(...balances),
      maxBalance: Math.max(...balances),
      avgTxns: Math.round(txns.reduce((a, b) => a + b, 0) / n),
      minTxns: Math.min(...txns),
      maxTxns: Math.max(...txns),
    }
  }, [])

  const fmt = (n: number) =>
    "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2 })

  const columns = useMemo<TanStackTable.ColumnDef<DataGridFeatures, IData>[]>(
    () => [
      {
        accessorKey: "name",
        id: "name",
        header: ({ column }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<DataGridColumnHeader title={copyExample("User")} visibility column={column} />)} />
        ),
        cell: ({ row }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<div className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarImage src={row.original.avatar} alt={copyExample(row.original.name)} />
              <AvatarFallback>
                {<ExampleText>{row.original.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}</ExampleText>}
              </AvatarFallback>
            </Avatar>
            <div className="text-foreground font-medium">
              {<ExampleText>{row.original.name}</ExampleText>}
            </div>
          </div>)} />
        ),
        minSize: 200,
        meta: {
          autoSize: true,
        },
        enableSorting: true,
        enableHiding: false,
        enableResizing: true,
      },
      {
        accessorKey: "status",
        id: "status",
        header: ({ column }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<DataGridColumnHeader title={copyExample("Status")} visibility column={column} />)} />
        ),
        cell: ({ row }) => {
          const s = row.original.status
          if (s === "Active")
            return <Badge variant="success-outline">{<ExampleText>Active</ExampleText>}</Badge>
          if (s === "Blocked")
            return <Badge variant="destructive-outline">{<ExampleText>Blocked</ExampleText>}</Badge>
          if (s === "Inactive")
            return <Badge variant="info-outline">{<ExampleText>Inactive</ExampleText>}</Badge>
          return <Badge variant="warning-outline">{<ExampleText>Pending</ExampleText>}</Badge>
        },
        size: 150,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        accessorKey: "balance",
        id: "balance",
        header: ({ column }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<DataGridColumnHeader title={copyExample("Balance")} visibility column={column} />)} />
        ),
        cell: ({ row }) => (
          <div className="text-foreground font-medium tabular-nums">
            {<ExampleText>{fmt(row.original.balance)}</ExampleText>}
          </div>
        ),
        size: 150,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        accessorKey: "transactions",
        id: "transactions",
        header: ({ column }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<DataGridColumnHeader
            title={copyExample("Transactions")}
            visibility
            column={column}
          />)} />
        ),
        cell: ({ row }) => (
          <div className="text-foreground font-medium tabular-nums">
            {<ExampleText>{row.original.transactions}</ExampleText>}
          </div>
        ),
        size: 150,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
    ],
    []
  )

  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((c) => c.id as string)
  )

  const table = TanStackTable.useTable({
    features: dataGridFeatures,
    columns,
    data: demoData,
    pageCount: Math.ceil(demoData.length / pagination.pageSize),
    getRowId: (row: IData) => row.id,
    state: { pagination, sorting, columnOrder },
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  })

  const footer = (
    <DataGridTableFootRow>
      <DataGridTableFootRowCell colSpan={2}>
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground">{<ExampleText>Summary</ExampleText>}</span>
          <span className="text-foreground font-medium">
            {<ExampleText>Across all members </ExampleText>}</span>
          <span className="text-muted-foreground tabular-nums">
            {<ExampleText>{demoData.length}</ExampleText>} {<ExampleText> members </ExampleText>}</span>
        </div>
      </DataGridTableFootRowCell>
      <DataGridTableFootRowCell>
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground">{<ExampleText>Avg</ExampleText>}</span>
          <span className="tabular-nums">{<ExampleText>{fmt(aggregates.avgBalance)}</ExampleText>}</span>
          <span className="text-muted-foreground tabular-nums">
            {<ExampleText>{fmt(aggregates.minBalance)}</ExampleText>} - {<ExampleText>{fmt(aggregates.maxBalance)}</ExampleText>}
          </span>
        </div>
      </DataGridTableFootRowCell>
      {/* Transactions aggregate */}
      <DataGridTableFootRowCell>
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground">{<ExampleText>Avg</ExampleText>}</span>
          <span className="tabular-nums">{<ExampleText>{aggregates.avgTxns}</ExampleText>}</span>
          <span className="text-muted-foreground tabular-nums">
            {<ExampleText>{aggregates.minTxns}</ExampleText>} - {<ExampleText>{aggregates.maxTxns}</ExampleText>}
          </span>
        </div>
      </DataGridTableFootRowCell>
    </DataGridTableFootRow>
  )

  return (
    <DataGrid i18n={exampleLocales.dataGrid}
      table={table}
      recordCount={demoData.length}
      tableLayout={{
        columnsPinnable: true,
        columnsResizable: true,
        columnsVisibility: true,
      }}
    >
      <Card className="w-full gap-0 p-0">
        <CardHeader className="flex items-center justify-between gap-3 px-4 py-2">
          <CardTitle className="text-sm font-medium">
            {<ExampleText>Column Aggregates </ExampleText>}</CardTitle>
          <CardAction>
            <Button variant="outline" size="sm">
              <DownloadIcon  />
              {<ExampleText>Export </ExampleText>}</Button>
          </CardAction>
        </CardHeader>
        <CardContent className="border-y px-0">
          <DataGridScrollArea>
            <DataGridTable footerContent={footer} />
          </DataGridScrollArea>
        </CardContent>
        <CardFooter className="border-none bg-transparent! px-3.5 py-2">
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "38.75rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
