"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime, type ExampleTimers } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { XIcon } from "lucide-react"

import { useEffect, useMemo, useRef, useState } from "react"
import { Badge } from "@exre/exui"
import {
  DataGrid,
  dataGridFeatures,
  type DataGridFeatures,
} from "@exre/exui"
import { DataGridColumnHeader } from "@exre/exui"
import { DataGridPagination } from "@exre/exui"
import { DataGridScrollArea } from "@exre/exui"
import { DataGridTable } from "@exre/exui"
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
  CardTitle,
} from "@exre/exui"
import { Input } from "@exre/exui"
import {
  SelectField as Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@exre/exui"
import { Skeleton } from "@exre/exui"


interface IData {
  id: string
  name: string
  avatar: string
  email: string
  company: string
  status: "Active" | "Inactive" | "Pending"
  balance: number
}

type StatusFilter = "all" | IData["status"]

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

const companies = [
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
]

const statuses: IData["status"][] = ["Active", "Inactive", "Pending"]

// Deterministic, so sorting and paging are reproducible across fetches. A
// non-round total makes the "1 - 5 of 487" info text read like a real API.
const TOTAL_SERVER_RECORDS = 487

const serverRecords: IData[] = Array.from(
  { length: TOTAL_SERVER_RECORDS },
  (_, index) => {
    const name = names[index % names.length]
    return {
      id: String(index + 1),
      name,
      avatar: avatars[index % avatars.length],
      email: `${name.toLowerCase().replace(" ", ".")}${index + 1}@company.com`,
      company: companies[(index * 3) % companies.length],
      status: statuses[index % statuses.length],
      balance: Math.round((1000 + ((index * 137.17) % 9000)) * 100) / 100,
    }
  }
)

/**
 * The simulated server. Everything inside this function is what a real
 * backend does with the query string of a paged endpoint: filter, sort, count,
 * slice. Replace the whole body with a fetch to your own API and keep the
 * return shape - one page of rows plus the total AFTER filtering.
 */
async function fetchServerPage(params: {
  pageIndex: number
  pageSize: number
  sorting: TanStackTable.SortingState
  search: string
  status: StatusFilter
}, exampleTimers: ExampleTimers): Promise<{ rows: IData[]; total: number }> {
  // Latency, so the built-in skeleton state is actually visible in the demo.
  await exampleTimers.delay(500)

  const search = params.search.toLowerCase()
  let rows = serverRecords
  if (params.status !== "all") {
    rows = rows.filter((record) => record.status === params.status)
  }
  if (search) {
    rows = rows.filter((record) =>
      [record.name, record.email, record.company].some((value) =>
        value.toLowerCase().includes(search)
      )
    )
  }

  const sort = params.sorting[0]
  if (sort) {
    const direction = sort.desc ? -1 : 1
    rows = [...rows].sort((a, b) => {
      const left = a[sort.id as keyof IData]
      const right = b[sort.id as keyof IData]
      if (typeof left === "number" && typeof right === "number") {
        return (left - right) * direction
      }
      return String(left).localeCompare(String(right)) * direction
    })
  }

  const start = params.pageIndex * params.pageSize
  return {
    rows: rows.slice(start, start + params.pageSize),
    total: rows.length,
  }
}

  function OriginalPattern() {
  const { copy: copyExample, locales: exampleLocales, timers: exampleTimers } = useExampleRuntime()

  const [pagination, setPagination] = useState<TanStackTable.PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })
  const [sorting, setSorting] = useState<TanStackTable.SortingState>([])
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<StatusFilter>("all")
  const [data, setData] = useState<IData[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const hasActiveFilters = searchInput.trim() !== "" || status !== "all"

  const resetToFirstPage = () =>
    setPagination((current) =>
      current.pageIndex === 0 ? current : { ...current, pageIndex: 0 }
    )

  // Debounce typing into one server query, and return to the first page: the
  // old page index is meaningless against a different filtered set.
  useEffect(() => {
    const timeoutId = exampleTimers.setTimeout(() => {
      setSearch(searchInput.trim())
      setPagination((current) =>
        current.pageIndex === 0 ? current : { ...current, pageIndex: 0 }
      )
    }, 350)
    return () => window.clearTimeout(timeoutId)
  }, [searchInput, exampleTimers])

  // One fetch per settled query state. The request id guards against a slow
  // response landing after a newer one and overwriting fresher rows.
  const requestIdRef = useRef(0)
  useEffect(() => {
    const requestId = ++requestIdRef.current
    setIsLoading(true)
    fetchServerPage({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sorting,
      search,
      status,
    }, exampleTimers).then((response) => {
      if (requestId !== requestIdRef.current) return
      setData(response.rows)
      setTotal(response.total)
      setIsLoading(false)
    }).catch(() => {})
  }, [pagination.pageIndex, pagination.pageSize, sorting, search, status, exampleTimers])

  const columns = useMemo<TanStackTable.ColumnDef<DataGridFeatures, IData>[]>(
    () => [
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
                  .map((namePart) => namePart[0])
                  .join("")}</ExampleText>}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-foreground font-medium">
                {<ExampleText>{row.original.name}</ExampleText>}
              </div>
              <div className="text-muted-foreground text-xs">
                {<ExampleText>{row.original.email}</ExampleText>}
              </div>
            </div>
          </div>)} />
        ),
        minSize: 220,
        meta: {
          autoSize: true,
          skeleton: (
            <div className="flex items-center gap-3">
              <Skeleton className="size-7 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
          ),
        },
        enableSorting: true,
      },
      {
        accessorKey: "company",
        id: "company",
        header: ({ column }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<DataGridColumnHeader title={copyExample("Company")} column={column} />)} />
        ),
        cell: ({ row }) => (
          <span className="text-foreground">{<ExampleText>{row.original.company}</ExampleText>}</span>
        ),
        size: 130,
        meta: {
          skeleton: <Skeleton className="h-4 w-20" />,
        },
        enableSorting: true,
      },
      {
        accessorKey: "status",
        id: "status",
        header: ({ column }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<DataGridColumnHeader title={copyExample("Status")} column={column} />)} />
        ),
        cell: ({ row }) => {
          const rowStatus = row.original.status

          if (rowStatus === "Active") {
            return <Badge variant="success-outline">{<ExampleText>Active</ExampleText>}</Badge>
          }

          if (rowStatus === "Inactive") {
            return <Badge variant="info-outline">{<ExampleText>Inactive</ExampleText>}</Badge>
          }

          return <Badge variant="warning-outline">{<ExampleText>Pending</ExampleText>}</Badge>
        },
        size: 120,
        meta: {
          skeleton: <Skeleton className="h-5 w-16" />,
        },
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
        meta: {
          skeleton: <Skeleton className="h-4 w-24" />,
        },
        enableSorting: true,
      },
    ],
    []
  )

  const table = TanStackTable.useTable({
    features: dataGridFeatures,
    columns,
    data,
    // Server-side mode: `data` is exactly one page, so paging and sorting are
    // the server's job instead of the row models'.
    manualPagination: true,
    manualSorting: true,
    // The server-side total. REQUIRED alongside recordCount below: without it
    // getPageCount() is derived from the one loaded page and the pagination
    // buttons collapse to a single page, while the info text still claims the
    // full count. recordCount only drives the "1 - 5 of N" text.
    rowCount: total,
    getRowId: (row: IData) => row.id,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  })

  return (
    <DataGrid i18n={exampleLocales.dataGrid}
      table={table}
      recordCount={total}
      isLoading={isLoading}
      tableLayout={{ columnsResizable: true }}
    >
      <Card className="w-full gap-3 py-3.5">
        <CardHeader className="items-center px-3.5">
          <CardTitle className="flex items-center gap-2">
            {<ExampleText>Users </ExampleText>}<Badge variant="secondary" size="sm" className="tabular-nums">
              {<ExampleText>{total}</ExampleText>}
            </Badge>
          </CardTitle>
          <CardAction className="flex flex-wrap items-center justify-end gap-2">
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              aria-label={copyExample("Search users")}
              placeholder={copyExample("Search name, email, company...")}
              className="w-56"
            />
            <Select
              value={status}
              /* The primitive types the callback value as nullable; a null
                 (nothing selected) means the unfiltered view. */
              onValueChange={(next) => {
                setStatus((next ?? "all") as StatusFilter)
                resetToFirstPage()
              }}
            >
              <SelectTrigger className="w-32" aria-label={copyExample("Filter by status")}>
                {/* Explicit label: the primitive can only resolve a value to
                    its item label after the popup has mounted the items, so a
                    fresh render would show the raw "all". */}
                <SelectValue placeholder={copyExample("Status")}>
                  {<ExampleText>{status === "all" ? "All statuses" : status}</ExampleText>}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{<ExampleText>All statuses</ExampleText>}</SelectItem>
                <SelectItem value="Active">{<ExampleText>Active</ExampleText>}</SelectItem>
                <SelectItem value="Inactive">{<ExampleText>Inactive</ExampleText>}</SelectItem>
                <SelectItem value="Pending">{<ExampleText>Pending</ExampleText>}</SelectItem>
              </SelectContent>
            </Select>
            {/* Present only while a filter is active, so the resting toolbar
                stays quiet. Search is cleared through both halves at once:
                waiting out the debounce would leave stale rows for 350ms. */}
            {<ExampleText>{hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchInput("")
                  setSearch("")
                  setStatus("all")
                  resetToFirstPage()
                }}
              >
                <XIcon className="size-4" />
                {<ExampleText>Clear </ExampleText>}</Button>
            )}</ExampleText>}
          </CardAction>
        </CardHeader>
        <CardContent className="border-t p-0">
          <DataGridScrollArea>
            <DataGridTable />
          </DataGridScrollArea>
        </CardContent>
        <CardFooter className="border-none bg-transparent! px-3.5 py-0">
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "31.25rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
