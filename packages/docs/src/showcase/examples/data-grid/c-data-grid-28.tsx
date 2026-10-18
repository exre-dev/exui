"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime, createExampleRandom } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CloudDownloadIcon, DownloadIcon, RefreshCwIcon } from "lucide-react"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
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
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@exre/exui"


interface IData {
  id: string
  name: string
  avatar: string
  email: string
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

const statuses: IData["status"][] = ["Active", "Inactive", "Pending"]

const TOTAL_SERVER_RECORDS = 200
const PAGE_SIZE = 20

function simulateRow(index: number): IData {
  const name = names[index % names.length]
  return {
    id: String(index + 1),
    name,
    avatar: avatars[index % avatars.length],
    email: `${name.toLowerCase().replace(" ", ".")}${index}@company.com`,
    status: statuses[index % statuses.length],
    balance: Math.round((createExampleRandom("c-data-grid-28-row-" + index)() * 9000 + 1000) * 100) / 100,
  }
}

function createInitialData() {
  return Array.from({ length: PAGE_SIZE }, (_, index) => simulateRow(index))
}

  function OriginalPattern() {
  const { copy: copyExample, locales: exampleLocales, timers: exampleTimers } = useExampleRuntime()

  const [sorting, setSorting] = useState<TanStackTable.SortingState>([])
  const [initialData] = useState<IData[]>(() => createInitialData())
  const [data, setData] = useState<IData[]>(initialData)
  const [isFetching, setIsFetching] = useState(false)
  const [resetVersion, setResetVersion] = useState(0)
  const fetchTimeoutRef = useRef<number | null>(null)
  const hasMore = data.length < TOTAL_SERVER_RECORDS

  const clearPendingFetch = useCallback(() => {
    if (fetchTimeoutRef.current !== null) {
      window.clearTimeout(fetchTimeoutRef.current)
      fetchTimeoutRef.current = null
    }
  }, [])

  useEffect(() => () => clearPendingFetch(), [clearPendingFetch])

  const handleReset = useCallback(() => {
    clearPendingFetch()
    setSorting([])
    setData(initialData)
    setIsFetching(false)
    setResetVersion((version) => version + 1)
  }, [clearPendingFetch, initialData])

  const fetchMore = useCallback(() => {
    if (isFetching || !hasMore) return

    clearPendingFetch()
    setIsFetching(true)

    const timeoutId = exampleTimers.setTimeout(() => {
      setData((prev) => {
        const next = Array.from({ length: PAGE_SIZE }, (_, index) =>
          simulateRow(prev.length + index)
        )
        return [...prev, ...next]
      })
      setIsFetching(false)
      fetchTimeoutRef.current = null
    }, 800)

    fetchTimeoutRef.current = timeoutId
  }, [clearPendingFetch, hasMore, isFetching, exampleTimers])

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
        minSize: 200,
        meta: {
          autoSize: true,
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
          const status = row.original.status

          if (status === "Active") {
            return <Badge variant="success-outline">{<ExampleText>Active</ExampleText>}</Badge>
          }

          if (status === "Inactive") {
            return <Badge variant="info-outline">{<ExampleText>Inactive</ExampleText>}</Badge>
          }

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
    data,
    getRowId: (row: IData) => row.id,
    state: { sorting },
    onSortingChange: setSorting,
  })

  return (
    <DataGrid i18n={exampleLocales.dataGrid}
      table={table}
      recordCount={data.length}
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
          <div className="flex items-center gap-2">
            <CloudDownloadIcon className="text-muted-foreground size-4" />
            <span className="text-foreground text-sm font-medium">
              {<ExampleText>Remote Data </ExampleText>}</span>
            <Badge variant="secondary" size="sm">
              {<ExampleText>{data.length}</ExampleText>} / {<ExampleText>{TOTAL_SERVER_RECORDS}</ExampleText>}
            </Badge>
          </div>
          <CardAction className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RefreshCwIcon className="size-4" />
              {<ExampleText>Start over </ExampleText>}</Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label={copyExample("Download snapshot")}
              title={copyExample("Download snapshot")}
            >
              <DownloadIcon className="size-4" />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="border-t p-0">
          <DataGridScrollArea key={resetVersion} className="h-[480px]">
            <DataGridTableVirtual
              estimateSize={57}
              onFetchMore={fetchMore}
              isFetchingMore={isFetching}
              hasMore={hasMore}
            />
          </DataGridScrollArea>
        </CardContent>
      </Card>
    </DataGrid>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "34.25rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
