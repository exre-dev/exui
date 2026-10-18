"use client"
"use no memo"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { MoreHorizontalIcon, RefreshCwIcon } from "lucide-react"

// This file keeps "use no memo": its own cell/header templates read state
// through builder calls on a stable row/column, which React Compiler cannot
// see. The primitive wraps its own such reads in TanStack's Subscribe; a
// consumer template has to opt out or subscribe itself.
import { useMemo, useState } from "react"
import { useCopyToClipboard } from "@exre/exui"
import { Badge } from "@exre/exui"
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures,
  type DataGridFeatures,
} from "@exre/exui"
import { DataGridColumnHeader } from "@exre/exui"
import { DataGridPagination } from "@exre/exui"
import { DataGridScrollArea } from "@exre/exui"
import {
  DataGridTable,
  DataGridTableRowPin,
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
    status: "Active",
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
    status: "Active",
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
  {
    id: "11",
    name: "Olivia Martinez",
    avatar:
      "/examples/reui/photos/240c6b87e9fc32d076.jpg",
    role: "VP of Sales",
    status: "Active",
    balance: 11234.56,
  },
  {
    id: "12",
    name: "Ethan Park",
    avatar:
      "/examples/reui/photos/c6064767ae24420606.jpg",
    role: "DevOps Lead",
    status: "Active",
    balance: 8910.33,
  },
  {
    id: "13",
    name: "Sophie Taylor",
    avatar:
      "/examples/reui/photos/7da2efac125ddc6e00.jpg",
    role: "UX Researcher",
    status: "Pending",
    balance: 6543.21,
  },
  {
    id: "14",
    name: "Ryan Mitchell",
    avatar:
      "/examples/reui/photos/833451dbb99bcf927d.jpg",
    role: "Architect",
    status: "Inactive",
    balance: 7821.44,
  },
  {
    id: "15",
    name: "Isabella Wong",
    avatar:
      "/examples/reui/photos/dbc92c73c5f6acf737.jpg",
    role: "QA Manager",
    status: "Active",
    balance: 5678.9,
  },
]

function ActionsCell({ row }: { row: TanStackTable.Row<DataGridFeatures, IData> }) {
  const { copy: copyExample } = useExampleRuntime()
  const { toast } = useExampleRuntime()

  const { copyToClipboard } = useCopyToClipboard()
  const isPinned = row.getIsPinned()

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
        <DropdownMenuItem onClick={() => row.pin(isPinned ? false : "top")}>
          {<ExampleText>{isPinned ? "Unpin row" : "Pin to top"}</ExampleText>}
        </DropdownMenuItem>
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
  const { copy: copyExample, locales: exampleLocales } = useExampleRuntime()

  const [pagination, setPagination] = useState<TanStackTable.PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<TanStackTable.SortingState>([
    { id: "name", desc: false },
  ])
  const [rowPinning, setRowPinning] = useState<TanStackTable.RowPinningState>({
    top: [],
    bottom: [],
  })

  const columns = useMemo<TanStackTable.ColumnDef<DataGridFeatures, IData>[]>(
    () => [
      {
        id: "pin",
        header: "",
        cell: ({ row }) => <DataGridTableRowPin row={row} />,
        size: 40,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
      },
      {
        accessorKey: "name",
        id: "name",
        header: ({ column }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<DataGridColumnHeader title={copyExample("User")} column={column} />)} />
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
            <div className="text-foreground min-w-0 truncate font-medium">
              {<ExampleText>{row.original.name}</ExampleText>}
            </div>
          </div>)} />
        ),
        minSize: 150,
        meta: {
          autoSize: true,
        },
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: "role",
        id: "role",
        header: ({ column }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<DataGridColumnHeader title={copyExample("Role")} column={column} />)} />
        ),
        cell: ({ row }) => (
          <span className="text-foreground">{<ExampleText>{row.original.role}</ExampleText>}</span>
        ),
        size: 160,
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
          if (s === "Blocked")
            return <Badge variant="destructive-outline">{<ExampleText>Blocked</ExampleText>}</Badge>
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
          <span className="text-foreground tabular-nums">
            $
            {<ExampleText>{row.original.balance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}</ExampleText>}
          </span>
        ),
        size: 140,
        enableSorting: true,
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

  const table = TanStackTable.useTable({
    features: dataGridFeatures,
    columns,
    data: demoData,
    pageCount: Math.ceil(demoData.length / pagination.pageSize),
    getRowId: (row: IData) => row.id,
    enableRowPinning: true,
    keepPinnedRows: true,
    state: { pagination, sorting, rowPinning },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onRowPinningChange: setRowPinning,
  })

  return (
    <DataGrid i18n={exampleLocales.dataGrid}
      table={table}
      recordCount={demoData.length}
      tableLayout={{
        rowsPinnable: true,
        columnsResizable: true,
      }}
    >
      <Card className="w-full gap-0 p-0">
        <CardHeader className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-foreground text-sm font-medium">
              {<ExampleText>Team Members </ExampleText>}</span>
            {<ExampleText>{(rowPinning.top?.length ?? 0) > 0 && (
              <Badge variant="primary-outline" size="sm">
                {<ExampleText>{rowPinning.top?.length}</ExampleText>} {<ExampleText> pinned </ExampleText>}</Badge>
            )}</ExampleText>}
          </div>
          <div className="flex items-center gap-1">
            {<ExampleText>{(rowPinning.top?.length ?? 0) > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRowPinning({ top: [], bottom: [] })}
              >
                {<ExampleText>Unpin all </ExampleText>}</Button>
            )}</ExampleText>}
            <Button aria-label={copyExample("Refresh")} variant="ghost" size="icon" className="size-8">
              <RefreshCwIcon className="size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Card className="p-0">
            <DataGridContainer>
              <DataGridScrollArea>
                <DataGridTable />
              </DataGridScrollArea>
            </DataGridContainer>
          </Card>
        </CardContent>
        <CardFooter className="border-none bg-transparent! px-3 py-2">
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "47.5rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
