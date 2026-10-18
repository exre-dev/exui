"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useMemo, useState } from "react"
import { Badge } from "@exre/exui"
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures,
  type DataGridFeatures,
} from "@exre/exui"
import { DataGridColumnHeader } from "@exre/exui"
import type { DataGridI18nOverrides } from "@exre/exui"
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
import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@exre/exui"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@exre/exui"

interface IOrder {
  id: string
  reference: string
  customer: string
  avatar: string
  initials: string
  city: string
  status: "shipped" | "processing"
  total: number
}

type Locale = "en" | "de" | "ja"

const orders: IOrder[] = [
  {
    id: "1",
    reference: "ORD-4417",
    customer: "Alex Johnson",
    avatar:
      "/examples/reui/photos/e93553df2422635515.jpg",
    initials: "AJ",
    city: "Berlin",
    status: "shipped",
    total: 249.9,
  },
  {
    id: "2",
    reference: "ORD-4418",
    customer: "Sarah Chen",
    avatar:
      "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
    initials: "SC",
    city: "Osaka",
    status: "processing",
    total: 89.0,
  },
  {
    id: "3",
    reference: "ORD-4421",
    customer: "Michael Rodriguez",
    avatar:
      "/examples/reui/photos/4349381d8a8476edbc.jpg",
    initials: "MR",
    city: "Madrid",
    status: "shipped",
    total: 1290.5,
  },
  {
    id: "4",
    reference: "ORD-4425",
    customer: "Emma Wilson",
    avatar:
      "/examples/reui/photos/046af0b7d159f9f4fd.jpg",
    initials: "EW",
    city: "Hamburg",
    status: "processing",
    total: 45.25,
  },
  {
    id: "5",
    reference: "ORD-4430",
    customer: "David Kim",
    avatar:
      "/examples/reui/photos/973d47055c51440af7.jpg",
    initials: "DK",
    city: "Seoul",
    status: "shipped",
    total: 615.0,
  },
  {
    id: "6",
    reference: "ORD-4433",
    customer: "Maria Garcia",
    avatar:
      "/examples/reui/photos/067c566cd567259bb9.jpg",
    initials: "MG",
    city: "Lisbon",
    status: "processing",
    total: 132.75,
  },
  {
    id: "7",
    reference: "ORD-4440",
    customer: "James Brown",
    avatar:
      "/examples/reui/photos/c75592a667f30cfd44.jpg",
    initials: "JB",
    city: "Toronto",
    status: "shipped",
    total: 78.4,
  },
]

/**
 * One entry per locale: the grid's own copy through `i18n`, plus the column
 * titles and cell text the consumer owns. The grid never translates content,
 * only its built-in chrome, so a real app pairs the two exactly like this.
 */
const localeContent: Record<
  Locale,
  {
    label: string
    columns: {
      reference: string
      customer: string
      city: string
      status: string
      total: string
    }
    status: { shipped: string; processing: string }
    currency: string
    i18n: DataGridI18nOverrides
  }
> = {
  en: {
    label: "EN",
    columns: {
      reference: "Order",
      customer: "Customer",
      city: "City",
      status: "Status",
      total: "Total",
    },
    status: { shipped: "Shipped", processing: "Processing" },
    currency: "USD",
    i18n: {},
  },
  de: {
    label: "DE",
    columns: {
      reference: "Bestellung",
      customer: "Kunde",
      city: "Stadt",
      status: "Status",
      total: "Summe",
    },
    status: { shipped: "Versandt", processing: "In Bearbeitung" },
    currency: "EUR",
    i18n: {
      labels: {
        sortAscending: "Aufsteigend",
        sortDescending: "Absteigend",
        pinColumnStart: "Links anheften",
        pinColumnEnd: "Rechts anheften",
        moveColumnStart: "Nach links verschieben",
        moveColumnEnd: "Nach rechts verschieben",
        columnsMenu: "Spalten",
        toggleColumns: "Spalten ein- und ausblenden",
        selectAll: "Alle auswählen",
        selectRow: "Zeile auswählen",
        rowsPerPage: "Zeilen pro Seite",
        paginationInfo: ({ from, to, count }) => `${from}-${to} von ${count}`,
        previousPage: "Vorherige Seite",
        nextPage: "Nächste Seite",
        goToPage: (page) => `Seite ${page}`,
        empty: "Keine Daten vorhanden",
      },
    },
  },
  ja: {
    label: "日本語",
    columns: {
      reference: "注文",
      customer: "顧客",
      city: "都市",
      status: "状態",
      total: "合計",
    },
    status: { shipped: "発送済み", processing: "処理中" },
    currency: "JPY",
    i18n: {
      labels: {
        sortAscending: "昇順",
        sortDescending: "降順",
        pinColumnStart: "左に固定",
        pinColumnEnd: "右に固定",
        moveColumnStart: "左へ移動",
        moveColumnEnd: "右へ移動",
        columnsMenu: "列",
        toggleColumns: "列の表示切り替え",
        selectAll: "すべて選択",
        selectRow: "行を選択",
        rowsPerPage: "1ページの行数",
        /* Japanese counts the total first, the reason these labels are
           functions rather than templates with fixed placeholders. */
        paginationInfo: ({ from, to, count }) => `${count}件中 ${from}-${to}件`,
        previousPage: "前のページ",
        nextPage: "次のページ",
        goToPage: (page) => `${page}ページ目`,
        empty: "データがありません",
      },
    },
  },
}

const localeTags: Record<Locale, string> = {
  en: "en-US",
  de: "de-DE",
  ja: "ja-JP",
}

  function OriginalPattern() {
  const { copy: copyExample, copyData: copyExampleData } = useExampleRuntime()

  const [locale, setLocale] = useState<Locale>("en")
  const [sorting, setSorting] = useState<TanStackTable.SortingState>([])
  const [rowSelection, setRowSelection] = useState<TanStackTable.RowSelectionState>({})
  const [pagination, setPagination] = useState<TanStackTable.PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })

  const content = localeContent[locale]

  const columns = useMemo<TanStackTable.ColumnDef<DataGridFeatures, IOrder>[]>(() => {
    const money = new Intl.NumberFormat(localeTags[locale], {
      style: "currency",
      currency: content.currency,
      maximumFractionDigits: content.currency === "JPY" ? 0 : 2,
    })

    return [
      {
        id: "select",
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        size: 44,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
      },
      {
        accessorKey: "reference",
        header: ({ column }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<DataGridColumnHeader
            title={copyExample(content.columns.reference)}
            column={column}
          />)} />
        ),
        cell: ({ row }) => (
          <span className="font-mono text-xs">{<ExampleText>{row.original.reference}</ExampleText>}</span>
        ),
        size: 110,
      },
      {
        accessorKey: "customer",
        header: ({ column }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<DataGridColumnHeader
            title={copyExample(content.columns.customer)}
            column={column}
          />)} />
        ),
        cell: ({ row }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<div className="flex items-center gap-2">
            <Avatar className="size-6">
              <AvatarImage
                src={row.original.avatar}
                alt={copyExample(row.original.customer)}
              />
              <AvatarFallback className="text-[10px]">
                {<ExampleText>{row.original.initials}</ExampleText>}
              </AvatarFallback>
            </Avatar>
            <span className="text-foreground truncate font-medium">
              {<ExampleText>{row.original.customer}</ExampleText>}
            </span>
          </div>)} />
        ),
        size: 200,
      },
      {
        accessorKey: "city",
        header: ({ column }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<DataGridColumnHeader title={copyExample(content.columns.city)} column={column} />)} />
        ),
        cell: ({ row }) => (
          <span className="truncate">{<ExampleText>{row.original.city}</ExampleText>}</span>
        ),
        size: 120,
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<DataGridColumnHeader
            title={copyExample(content.columns.status)}
            column={column}
          />)} />
        ),
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.status === "shipped"
                ? "success-light"
                : "warning-light"
            }
          >
            {<ExampleText>{content.status[row.original.status]}</ExampleText>}
          </Badge>
        ),
        size: 140,
      },
      {
        accessorKey: "total",
        header: ({ column }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<DataGridColumnHeader title={copyExample(content.columns.total)} column={column} />)} />
        ),
        cell: ({ row }) => (
          <span className="block text-end tabular-nums">
            {<ExampleText>{money.format(row.original.total)}</ExampleText>}
          </span>
        ),
        size: 130,
        meta: { headerClassName: "text-end [&>div]:justify-end" },
      },
    ]
  }, [content, locale])

  const table = TanStackTable.useTable({
    features: dataGridFeatures,
    columns,
    data: orders,
    getRowId: (row: IOrder) => row.id,
    state: { sorting, pagination, rowSelection },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
  })

  return (
    <DataGrid
      table={table}
      recordCount={orders.length}
      /* The whole point of the example: one prop swaps every built-in
         string, and the untouched keys keep their English defaults. */
      i18n={copyExampleData(content.i18n)}
      tableLayout={{ columnsPinnable: true, columnsMovable: true }}
    >
      <Card className="w-full gap-3 py-3.5">
        <CardHeader className="items-center px-3.5">
          <CardTitle>{<ExampleText>Orders</ExampleText>}</CardTitle>
          <CardAction>
            <ToggleGroup
              variant="outline"
              size="sm"
              type="single"
              value={locale}
              onValueChange={(next: string) =>
                next && setLocale(next as Locale)
              }
              aria-label={copyExample("Grid language")}
            >
              {<ExampleText>{(Object.keys(localeContent) as Locale[]).map((value) => (
                <ToggleGroupItem key={value} value={value}>
                  {<ExampleText>{localeContent[value].label}</ExampleText>}
                </ToggleGroupItem>
              ))}</ExampleText>}
            </ToggleGroup>
          </CardAction>
        </CardHeader>
        <DataGridContainer className="border-y">
          <DataGridScrollArea>
            <DataGridTable />
          </DataGridScrollArea>
        </DataGridContainer>
        <CardFooter className="border-none bg-transparent! px-3.5 py-0">
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "30rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
