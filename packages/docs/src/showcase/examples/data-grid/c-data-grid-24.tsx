"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { DownloadIcon, MoreHorizontalIcon, TableIcon } from "lucide-react"

import { useMemo, useState } from "react"
import { useCopyToClipboard } from "@exre/exui"
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
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from "@exre/exui"
import { TanStackTable } from "@exre/exui"


import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Button } from "@exre/exui"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@exre/exui"



interface IData {
  id: string
  name: string
  avatar: string
  role: string
  status: "Active" | "Inactive" | "Pending" | "Blocked"
  balance: number
}

const demoData: IData[] = [
  {
    id: "1",
    name: "Alex Johnson",
    avatar:
      "/examples/reui/photos/e93553df2422635515.jpg",
    role: "CEO",
    status: "Active",
    balance: 5143.03,
  },
  {
    id: "2",
    name: "Sarah Chen",
    avatar:
      "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
    role: "CTO",
    status: "Inactive",
    balance: 4321.87,
  },
  {
    id: "3",
    name: "Michael Rodriguez",
    avatar:
      "/examples/reui/photos/4349381d8a8476edbc.jpg",
    role: "Designer",
    status: "Blocked",
    balance: 7654.98,
  },
  {
    id: "4",
    name: "Emma Wilson",
    avatar:
      "/examples/reui/photos/046af0b7d159f9f4fd.jpg",
    role: "Developer",
    status: "Inactive",
    balance: 3456.45,
  },
  {
    id: "5",
    name: "David Kim",
    avatar:
      "/examples/reui/photos/973d47055c51440af7.jpg",
    role: "Lawyer",
    status: "Active",
    balance: 9876.54,
  },
  {
    id: "6",
    name: "Aron Thompson",
    avatar:
      "/examples/reui/photos/df73db9a2c25069a42.jpg",
    role: "Director",
    status: "Pending",
    balance: 6214.22,
  },
  {
    id: "7",
    name: "James Brown",
    avatar:
      "/examples/reui/photos/c75592a667f30cfd44.jpg",
    role: "Product Manager",
    status: "Inactive",
    balance: 5321.77,
  },
  {
    id: "8",
    name: "Maria Garcia",
    avatar:
      "/examples/reui/photos/067c566cd567259bb9.jpg",
    role: "Marketing Lead",
    status: "Blocked",
    balance: 8452.39,
  },
  {
    id: "9",
    name: "Nick Johnson",
    avatar:
      "/examples/reui/photos/f1d4253436738aaf8f.jpg",
    role: "Data Scientist",
    status: "Pending",
    balance: 7345.1,
  },
  {
    id: "10",
    name: "Liam Thompson",
    avatar:
      "/examples/reui/photos/a3afee2f77d259ce6a.jpg",
    role: "Engineer",
    status: "Inactive",
    balance: 5214.88,
  },
]

function ActionsCell({ row }: { row: TanStackTable.Row<DataGridFeatures, IData> }) {
  const { copy: copyExample } = useExampleRuntime()
  const { toast } = useExampleRuntime()

  const { copyToClipboard } = useCopyToClipboard()
  const handleCopyId = () => {
    copyToClipboard(row.original.id)
    toast.success("Employee ID copied", { description: row.original.id })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label={copyExample("Row actions")} className="size-7" size="icon" variant="ghost">
          <MoreHorizontalIcon  />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start">
        <DropdownMenuItem onClick={() => {}}>{<ExampleText>Edit</ExampleText>}</DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyId}>{<ExampleText>Copy ID</ExampleText>}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => {}}>
          {<ExampleText>Delete </ExampleText>}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

  function OriginalPattern() {
  const { locales: exampleLocales } = useExampleRuntime()

  const [pagination, setPagination] = useState<TanStackTable.PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })
  const [sorting, setSorting] = useState<TanStackTable.SortingState>([
    { id: "name", desc: false },
  ])

  const totalBalance = useMemo(
    () => demoData.reduce((sum, row) => sum + row.balance, 0),
    []
  )

  const columns = useMemo<TanStackTable.ColumnDef<DataGridFeatures, IData>[]>(
    () => [
      {
        accessorKey: "id",
        id: "id",
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        enableSorting: false,
        size: 35,
        enableResizing: false,
      },
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
        accessorKey: "role",
        id: "role",
        header: ({ column }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<DataGridColumnHeader title={copyExample("Role")} visibility column={column} />)} />
        ),
        cell: ({ row }) => (
          <div className="text-foreground font-medium">{<ExampleText>{row.original.role}</ExampleText>}</div>
        ),
        size: 150,
        enableSorting: true,
        enableHiding: true,
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
        size: 110,
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
            $
            {<ExampleText>{row.original.balance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}</ExampleText>}
          </div>
        ),
        size: 130,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => <ActionsCell row={row} />,
        size: 60,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
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

  const visibleCount = table.getVisibleLeafColumns().length

  const footer = (
    <DataGridTableFootRow>
      {/* Label spans checkbox + user + role + status */}
      <DataGridTableFootRowCell colSpan={visibleCount - 2}>
        <span className="text-muted-foreground">{<ExampleText>Total balance</ExampleText>}</span>
      </DataGridTableFootRowCell>
      {/* Balance total */}
      <DataGridTableFootRowCell className="font-bold tabular-nums">
        ${<ExampleText>{totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</ExampleText>}
      </DataGridTableFootRowCell>
      {/* Actions column - empty */}
      <DataGridTableFootRowCell />
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
      <Card className="w-full gap-0 py-0">
        <CardHeader className="flex items-center justify-between px-3.5 py-2">
          <div className="flex items-center gap-2">
            <TableIcon className="text-muted-foreground size-4" />
            <span className="text-foreground text-sm font-medium">
              {<ExampleText>Employee Balances </ExampleText>}</span>
          </div>
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

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "34.75rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
