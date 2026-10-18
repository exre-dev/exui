"use client"

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
import { usePreviewCopy } from "../../preview-copy"
import { useShowcaseLanguage } from "../../language"
import { exampleLocales } from "../_shared/example-locales"

const users = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    initials: "AJ",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah@example.com",
    initials: "SC",
  },
  {
    id: "3",
    name: "Michael Rodriguez",
    email: "michael@example.com",
    initials: "MR",
  },
  {
    id: "4",
    name: "Emma Wilson",
    email: "emma@example.com",
    initials: "EW",
  },
  {
    id: "5",
    name: "David Kim",
    email: "david@example.com",
    initials: "DK",
  },
  {
    id: "6",
    name: "Aron Thompson",
    email: "lisa@example.com",
    initials: "LT",
  },
  {
    id: "7",
    name: "James Brown",
    email: "james@example.com",
    initials: "JB",
  },
  {
    id: "8",
    name: "Maria Garcia",
    email: "maria@example.com",
    initials: "MG",
  },
  {
    id: "9",
    name: "Nick Johnson",
    email: "nick@example.com",
    initials: "NJ",
  },
  {
    id: "10",
    name: "Liam Thompson",
    email: "liam@example.com",
    initials: "LT",
  },
]

interface IData {
  id: string
  name: string
  availability: "online" | "away" | "busy" | "offline"
  status: "active" | "inactive"
  flag: string // Country code for the locally preserved flag SVG.
  email: string
  company: string
  role: string
  joined: string
  location: string
  balance: number
}

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

export default function Pattern() {
  const copy = usePreviewCopy()
  const { language } = useShowcaseLanguage()
  const [pagination, setPagination] = useState<TanStackTable.PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })
  const [sorting, setSorting] = useState<TanStackTable.SortingState>([
    { id: "name", desc: true },
  ])

  const columns = useMemo<TanStackTable.ColumnDef<DataGridFeatures, IData>[]>(
    () => [
      {
        accessorKey: "name",
        header: copy("Name", "姓名"),
        cell: (info) => <>{info.getValue() as string}</>,
        size: 150,
        meta: {
          headerClassName: "",
          cellClassName: "",
        },
      },
      {
        accessorKey: "email",
        header: copy("Email", "邮箱"),
        cell: (info) => (
          <div className="truncate">
            <a
              href={`mailto:${info.getValue()}`}
              className="hover:text-primary truncate hover:underline"
            >
              {info.getValue() as string}
            </a>
          </div>
        ),
        size: 150,
        meta: {
          headerClassName: "",
          cellClassName: "",
        },
      },
      {
        accessorKey: "location",
        header: copy("Location", "所在地"),
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <img
              src={`/examples/reui/flags/${row.original.flag}.svg`}
              alt={row.original.flag}
              className="size-4 rounded-full object-cover"
            />
            <div className="text-foreground">{row.original.location}</div>
          </div>
        ),
        size: 175,
        meta: {
          headerClassName: "",
          cellClassName: "",
        },
      },
      {
        accessorKey: "balance",
        header: copy("Balance ($)", "余额（美元）"),
        cell: (info) => <>${(info.getValue() as number).toFixed(2)}</>,
        size: 100,
        meta: {
          headerClassName: "text-right rtl:text-left",
          cellClassName: "text-right rtl:text-left",
        },
      },
    ],
    [copy]
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
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  })

  return (
    <DataGrid table={table} recordCount={demoData.length} i18n={exampleLocales[language].dataGrid}>
      <div className="w-full space-y-2.5">
        <DataGridContainer>
          <DataGridScrollArea>
            <DataGridTable />
          </DataGridScrollArea>
        </DataGridContainer>
        <DataGridPagination />
      </div>
    </DataGrid>
  )
}
