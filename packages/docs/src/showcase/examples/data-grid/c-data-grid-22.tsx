"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { FunnelIcon, MoreHorizontalIcon, SearchIcon, UserPlusIcon, XIcon } from "lucide-react"

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
import { Checkbox } from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@exre/exui"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@exre/exui"
import { Label } from "@exre/exui"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@exre/exui"


interface IData {
  id: string
  name: string
  availability: "online" | "away" | "busy" | "offline"
  avatar: string
  status: "Active" | "Inactive" | "Pending" | "Blocked"
  flag: string // Emoji flags
  email: string
  company: string
  role: string
  joined: string
  location: string
  balance: number
}

const demoData: IData[] = [
  {
    id: "1",
    name: "Alex Johnson",
    availability: "online",
    avatar:
      "/examples/reui/photos/e93553df2422635515.jpg",
    status: "Active",
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
    status: "Inactive",
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
    status: "Blocked",
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
    status: "Inactive",
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
    status: "Active",
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
    status: "Pending",
    flag: "my",
    email: "aron@keenthemes.com",
    company: "Keenthemes",
    role: "Director",
    joined: "Feb, 2022",
    location: "Malaysia",
    balance: 6214.22,
  },
  {
    id: "7",
    name: "James Brown",
    availability: "busy",
    avatar:
      "/examples/reui/photos/c75592a667f30cfd44.jpg",
    status: "Inactive",
    flag: "es",
    email: "james@bbva.es",
    company: "BBVA",
    role: "Product Manager",
    joined: "Aug, 2024",
    location: "Spain",
    balance: 5321.77,
  },
  {
    id: "8",
    name: "Maria Garcia",
    availability: "offline",
    avatar:
      "/examples/reui/photos/067c566cd567259bb9.jpg",
    status: "Blocked",
    flag: "jp",
    email: "maria@sony.jp",
    company: "Sony",
    role: "Marketing Lead",
    joined: "Dec, 2023",
    location: "Japan",
    balance: 8452.39,
  },
  {
    id: "9",
    name: "Nick Johnson",
    availability: "online",
    avatar:
      "/examples/reui/photos/f1d4253436738aaf8f.jpg",
    status: "Pending",
    flag: "fr",
    email: "nick@lvmh.fr",
    company: "LVMH",
    role: "Data Scientist",
    joined: "Apr, 2022",
    location: "France",
    balance: 7345.1,
  },
  {
    id: "10",
    name: "Liam Thompson",
    availability: "away",
    avatar:
      "/examples/reui/photos/a3afee2f77d259ce6a.jpg",
    status: "Inactive",
    flag: "it",
    email: "liam@eni.it",
    company: "ENI",
    role: "Engineer",
    joined: "Jul, 2024",
    location: "Italy",
    balance: 5214.88,
  },
  {
    id: "11",
    name: "Alex Johnson",
    availability: "busy",
    avatar:
      "/examples/reui/photos/e93553df2422635515.jpg",
    status: "Blocked",
    flag: "br",
    email: "alex@vale.br",
    company: "Vale",
    role: "Software Engineer",
    joined: "May, 2023",
    location: "Brazil",
    balance: 9421.5,
  },
  {
    id: "12",
    name: "Sarah Chen",
    availability: "offline",
    avatar:
      "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
    status: "Active",
    flag: "in",
    email: "sarah@tata.in",
    company: "Tata",
    role: "Sales Manager",
    joined: "Oct, 2024",
    location: "India",
    balance: 4521.67,
  },
]

function ActionsCell({ row }: { row: TanStackTable.Row<DataGridFeatures, IData> }) {
  const { copy: copyExample } = useExampleRuntime()
  const { toast } = useExampleRuntime()

  const { copyToClipboard } = useCopyToClipboard()
  const handleCopyId = () => {
    copyToClipboard(row.original.id)

    toast.success("Employee ID successfully copied", {
      description: row.original.id,
    })
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
  const { copy: copyExample, locales: exampleLocales } = useExampleRuntime()

  const [pagination, setPagination] = useState<TanStackTable.PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })
  const [sorting, setSorting] = useState<TanStackTable.SortingState>([
    { id: "name", desc: true },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])

  const filteredData = useMemo(() => {
    return demoData.filter((item) => {
      // Filter by status
      const matchesStatus =
        !selectedStatuses?.length || selectedStatuses.includes(item.status)

      // Filter by search query (case-insensitive)
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        !searchQuery ||
        Object.values(item)
          .join(" ") // Combine all fields into a single string
          .toLowerCase()
          .includes(searchLower)

      return matchesStatus && matchesSearch
    })
  }, [searchQuery, selectedStatuses])

  const statusCounts = useMemo(() => {
    return demoData.reduce(
      (acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )
  }, [])

  const handleStatusChange = (checked: boolean, value: string) => {
    setSelectedStatuses(
      (
        prev = [] // Default to an empty array
      ) => (checked ? [...prev, value] : prev.filter((v) => v !== value))
    )
  }

  const columns = useMemo<TanStackTable.ColumnDef<DataGridFeatures, IData>[]>(
    () => [
      {
        accessorKey: "id",
        id: "id",
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        enableSorting: false,
        size: 35,
        meta: {
          headerClassName: "",
          cellClassName: "",
        },
        enableResizing: false,
      },
      {
        accessorKey: "name",
        id: "name",
        header: ({ column }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<DataGridColumnHeader
            title={copyExample("User")}
            visibility={true}
            column={column}
          />)} />
        ),
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
        size: 260,
        meta: {
          autoSize: true,
        },
        enableSorting: true,
        enableHiding: false,
        enableResizing: true,
      },
      {
        accessorKey: "location",
        id: "location",
        header: ({ column }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<DataGridColumnHeader
            title={copyExample("Location")}
            visibility={true}
            column={column}
          />)} />
        ),
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
        size: 150,
        meta: {
          headerClassName: "",
          cellClassName: "text-start",
        },
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        accessorKey: "role",
        id: "role",
        header: ({ column }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<DataGridColumnHeader
            title={copyExample("Role")}
            visibility={true}
            column={column}
          />)} />
        ),
        cell: ({ row }) => {
          return (
            <div className="text-foreground font-medium">
              {<ExampleText>{row.original.role}</ExampleText>}
            </div>
          )
        },
        size: 150,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        accessorKey: "joined",
        id: "joined",
        header: ({ column }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<DataGridColumnHeader
            title={copyExample("Joined")}
            visibility={true}
            column={column}
          />)} />
        ),
        cell: ({ row }) => {
          return (
            <div className="text-foreground font-medium">
              {<ExampleText>{row.original.joined}</ExampleText>}
            </div>
          )
        },
        size: 150,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        accessorKey: "status",
        id: "status",
        header: ({ column }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<DataGridColumnHeader
            title={copyExample("Status")}
            visibility={true}
            column={column}
          />)} />
        ),
        cell: ({ row }) => {
          const status = row.original.status

          if (status == "Active") {
            return <Badge variant="success-outline">{<ExampleText>Approved</ExampleText>}</Badge>
          } else if (status == "Blocked") {
            return <Badge variant="destructive-outline">{<ExampleText>Blocked</ExampleText>}</Badge>
          } else if (status == "Inactive") {
            return <Badge variant="info-outline">{<ExampleText>Inactive</ExampleText>}</Badge>
          } else {
            return <Badge variant="warning-outline">{<ExampleText>Pending</ExampleText>}</Badge>
          }
        },
        size: 100,
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
    columns.map((column) => column.id as string)
  )

  const table = TanStackTable.useTable({
    features: dataGridFeatures,
    columns,
    data: filteredData,
    pageCount: Math.ceil((filteredData?.length || 0) / pagination.pageSize),
    getRowId: (row: IData) => row.id,
    state: {
      pagination,
      sorting,
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  })

  return (
    <DataGrid i18n={exampleLocales.dataGrid}
      table={table}
      recordCount={filteredData?.length || 0}
      tableLayout={{
        columnsPinnable: true,
        columnsResizable: true,
        columnsMovable: true,
        columnsVisibility: true,
      }}
    >
      <Card className="w-full gap-3 py-0">
        <CardHeader className="flex items-center justify-between px-3.5 py-2">
          <div className="flex items-center gap-2.5">
            <InputGroup className="w-48">
              <InputGroupAddon align="inline-start">
                <SearchIcon  />
              </InputGroupAddon>

              <InputGroupInput
                placeholder={copyExample("Search...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {<ExampleText>{searchQuery.length > 0 && (
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    aria-label={copyExample("Copy")}
                    title={copyExample("Copy")}
                    size="icon-xs"
                    onClick={() => setSearchQuery("")}
                  >
                    <XIcon  />
                  </InputGroupButton>
                </InputGroupAddon>
              )}</ExampleText>}
            </InputGroup>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <FunnelIcon  />
                  {<ExampleText>Status </ExampleText>}{<ExampleText>{selectedStatuses.length > 0 && (
                    <Badge size="sm" variant="info-outline">
                      {<ExampleText>{selectedStatuses.length}</ExampleText>}
                    </Badge>
                  )}</ExampleText>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40" align="start">
                <div className="space-y-3">
                  <div className="text-muted-foreground text-xs font-medium">
                    {<ExampleText>Filters </ExampleText>}</div>
                  <div className="space-y-3">
                    {<ExampleText>{Object.keys(statusCounts).map((status) => (
                      <ExampleRuntimeConsumer key={status} render={({id: exampleId}) => (<div key={status} className="flex items-center gap-2.5">
                        <Checkbox
                          id={exampleId(status)}
                          checked={selectedStatuses.includes(status)}
                          onCheckedChange={(checked) =>
                            handleStatusChange(checked === true, status)
                          }
                        />
                        <Label
                          htmlFor={exampleId(status)}
                          className="flex grow items-center justify-between gap-1.5 font-normal"
                        >
                          {<ExampleText>{status}</ExampleText>}
                          <span className="text-muted-foreground">
                            {<ExampleText>{statusCounts[status]}</ExampleText>}
                          </span>
                        </Label>
                      </div>)} />
                    ))}</ExampleText>}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <CardAction>
            <Button>
              <UserPlusIcon  />
              {<ExampleText>Add new </ExampleText>}</Button>
          </CardAction>
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
        <CardFooter className="border-none bg-transparent! px-3.5 py-2">
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "37rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
