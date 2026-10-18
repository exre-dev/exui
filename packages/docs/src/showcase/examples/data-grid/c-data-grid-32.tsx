"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { useMemo, useState } from "react"
import {
  DataGrid,
  DataGridContainer,
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
  CardHeader,
  CardTitle,
} from "@exre/exui"


interface IPerson {
  name: string
  avatar: string
  initials: string
}

interface IData {
  id: string
  person: IPerson
  metrics: number[]
  total: number
}

const METRIC_COLUMN_COUNT = 36
const ROW_COUNT = 1000
const COLUMN_JUMP_SIZE = 8
const METRIC_IDS = Array.from(
  { length: METRIC_COLUMN_COUNT },
  (_, metricIndex) => `metric-${metricIndex + 1}`
)
const COLUMN_IDS = ["id", "name", ...METRIC_IDS, "total"]
const columnVirtualizerOptions = { enabled: true, overscan: 3 }
const numberFormatter = new Intl.NumberFormat("en-US")
const PEOPLE: IPerson[] = [
  {
    name: "Alex Johnson",
    avatar:
      "/examples/reui/photos/e93553df2422635515.jpg",
    initials: "AJ",
  },
  {
    name: "Sarah Chen",
    avatar:
      "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
    initials: "SC",
  },
  {
    name: "Michael Rodriguez",
    avatar:
      "/examples/reui/photos/4349381d8a8476edbc.jpg",
    initials: "MR",
  },
  {
    name: "Emma Wilson",
    avatar:
      "/examples/reui/photos/046af0b7d159f9f4fd.jpg",
    initials: "EW",
  },
  {
    name: "David Kim",
    avatar:
      "/examples/reui/photos/973d47055c51440af7.jpg",
    initials: "DK",
  },
  {
    name: "Aron Thompson",
    avatar:
      "/examples/reui/photos/df73db9a2c25069a42.jpg",
    initials: "AT",
  },
  {
    name: "James Brown",
    avatar:
      "/examples/reui/photos/c75592a667f30cfd44.jpg",
    initials: "JB",
  },
  {
    name: "Maria Garcia",
    avatar:
      "/examples/reui/photos/067c566cd567259bb9.jpg",
    initials: "MG",
  },
  {
    name: "Nick Johnson",
    avatar:
      "/examples/reui/photos/f1d4253436738aaf8f.jpg",
    initials: "NJ",
  },
  {
    name: "Liam Thompson",
    avatar:
      "/examples/reui/photos/a3afee2f77d259ce6a.jpg",
    initials: "LT",
  },
]

// Deterministic pseudo-data: the same grid on every load, no Math.random.
function generateData(count: number): IData[] {
  return Array.from({ length: count }, (_, rowIndex) => {
    const metrics = Array.from(
      { length: METRIC_COLUMN_COUNT },
      (_, metricIndex) => 100 + ((rowIndex * 37 + metricIndex * 19) % 900)
    )

    return {
      id: String(rowIndex + 1),
      person: PEOPLE[rowIndex % PEOPLE.length]!,
      metrics,
      total: metrics.reduce((sum, value) => sum + value, 0),
    }
  })
}

const allData = generateData(ROW_COUNT)

  function OriginalPattern() {
  const { copy: copyExample, locales: exampleLocales } = useExampleRuntime()

  const [sorting, setSorting] = useState<TanStackTable.SortingState>([])
  const [columnPinning, setColumnPinning] = useState<TanStackTable.ColumnPinningState>({
    start: ["id", "name"],
    end: ["total"],
  })
  const [targetMetricIndex, setTargetMetricIndex] = useState(0)

  const columns = useMemo<TanStackTable.ColumnDef<DataGridFeatures, IData>[]>(() => {
    const metricColumns = Array.from(
      { length: METRIC_COLUMN_COUNT },
      (_, metricIndex): TanStackTable.ColumnDef<DataGridFeatures, IData> => {
        const metricNumber = String(metricIndex + 1).padStart(2, "0")

        return {
          id: METRIC_IDS[metricIndex]!,
          accessorFn: (row) => row.metrics[metricIndex],
          header: ({ column }) => (
            <ExampleRuntimeConsumer render={({format: formatExample}) => (<DataGridColumnHeader title={formatExample("Metric {number}", { number: metricNumber })} column={column} />)} />
          ),
          cell: ({ row }) => (
            <span className="block text-right font-mono tabular-nums">
              {<ExampleText>{numberFormatter.format(row.original.metrics[metricIndex]!)}</ExampleText>}
            </span>
          ),
          size: 124,
        }
      }
    )

    return [
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
        size: 72,
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "name",
        accessorFn: (row) => row.person.name,
        header: ({ column }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<DataGridColumnHeader title={copyExample("Team member")} column={column} />)} />
        ),
        cell: ({ row }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<div className="flex items-center gap-2">
            <Avatar className="size-6">
              <AvatarImage
                src={row.original.person.avatar}
                alt={copyExample(row.original.person.name)}
              />
              <AvatarFallback className="text-[10px]">
                {<ExampleText>{row.original.person.initials}</ExampleText>}
              </AvatarFallback>
            </Avatar>
            <span className="text-foreground truncate font-medium">
              {<ExampleText>{row.original.person.name}</ExampleText>}
            </span>
          </div>)} />
        ),
        size: 190,
        enableHiding: false,
      },
      ...metricColumns,
      {
        accessorKey: "total",
        id: "total",
        header: ({ column }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<DataGridColumnHeader title={copyExample("Total")} column={column} />)} />
        ),
        cell: ({ row }) => (
          <span className="block text-right font-medium tabular-nums">
            {<ExampleText>{numberFormatter.format(row.original.total)}</ExampleText>}
          </span>
        ),
        size: 132,
        enableHiding: false,
      },
    ]
  }, [])

  const table = TanStackTable.useTable({
    features: dataGridFeatures,
    columns,
    data: allData,
    enableColumnPinning: true,
    getRowId: (row: IData) => row.id,
    state: { columnPinning, sorting },
    onColumnPinningChange: setColumnPinning,
    onSortingChange: setSorting,
    // The whole set is already client-side: without this, v9's registered
    // paginated row model would clip the virtual grid to one page.
    manualPagination: true,
  })

  // The jump scrolls by CENTER column index, and pinning changes which
  // columns are centered, so the target metric is looked up among the
  // unpinned ones. A pinned metric is already in view: no scroll (-1).
  const centerMetricIndex = COLUMN_IDS.filter(
    (id) =>
      !columnPinning.start?.includes(id) && !columnPinning.end?.includes(id)
  ).indexOf(METRIC_IDS[targetMetricIndex]!)

  return (
    <DataGrid i18n={exampleLocales.dataGrid}
      table={table}
      recordCount={allData.length}
      tableLayout={{
        width: "fixed",
        dense: true,
        columnsPinnable: true,
        columnsResizable: true,
        headerSticky: true,
      }}
      tableClassNames={{
        /* z-40, not z-10: pinned BODY cells are sticky at z-30, and a lower
           thead would let them paint over the header band while rows scroll
           under it. 40 is the primitive's sticky-header plane. */
        headerSticky: "sticky top-0 z-40 bg-muted/90 backdrop-blur-xs",
      }}
    >
      {/* No footer here, so the grid itself closes the card: pb-0 removes
          the empty strip below the container, and overflow-hidden lets the
          card's own radius clip the grid's square bottom corners. */}
      <Card className="w-full gap-3 overflow-hidden py-3.5 pb-0">
        <CardHeader className="items-center px-3.5">
          <CardTitle>{<ExampleText>Performance Matrix</ExampleText>}</CardTitle>
          <CardAction className="flex items-center gap-2">
            <span className="text-muted-foreground hidden text-xs tabular-nums sm:inline">
              {<ExampleText>Metric </ExampleText>}{<ExampleText>{String(targetMetricIndex + 1).padStart(2, "0")}</ExampleText>} {<ExampleText> of</ExampleText>}{<ExampleText>{" "}</ExampleText>}
              {<ExampleText>{METRIC_COLUMN_COUNT}</ExampleText>}
            </span>
            <Button
              aria-label={copyExample("Show previous metric columns")}
              title={copyExample("Show previous metric columns")}
              className="size-8"
              disabled={targetMetricIndex === 0}
              size="icon"
              variant="outline"
              onClick={() =>
                setTargetMetricIndex((current) =>
                  Math.max(0, current - COLUMN_JUMP_SIZE)
                )
              }
            >
              <ChevronLeftIcon aria-hidden="true" />
            </Button>
            <Button
              aria-label={copyExample("Show next metric columns")}
              title={copyExample("Show next metric columns")}
              className="size-8"
              disabled={targetMetricIndex === METRIC_COLUMN_COUNT - 1}
              size="icon"
              variant="outline"
              onClick={() =>
                setTargetMetricIndex((current) =>
                  Math.min(METRIC_COLUMN_COUNT - 1, current + COLUMN_JUMP_SIZE)
                )
              }
            >
              <ChevronRightIcon aria-hidden="true" />
            </Button>
          </CardAction>
        </CardHeader>
        <DataGridContainer className="border-t">
          <DataGridScrollArea className="h-[480px]">
            <DataGridTableVirtual
              estimateSize={41}
              overscan={8}
              columnVirtualizerOptions={columnVirtualizerOptions}
              scrollBehavior="smooth"
              scrollToColumnAlign="center"
              scrollToColumnIndex={
                centerMetricIndex >= 0 ? centerMetricIndex : undefined
              }
            />
          </DataGridScrollArea>
        </DataGridContainer>
      </Card>
    </DataGrid>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "38.75rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
