"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useEffect, useMemo, useState } from "react"
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
  DataGridTableRowExpand,
} from "@exre/exui"
import { TanStackTable } from "@exre/exui"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Card } from "@exre/exui"

interface IData {
  id: string
  name: string
  type: "department" | "team" | "member"
  status: "active" | "inactive"
  role?: string
  avatar?: string
  flag?: string
  location?: string
  children?: IData[]
}

const demoData: IData[] = [
  {
    id: "eng",
    name: "Engineering",
    type: "department",
    status: "active",
    children: [
      {
        id: "eng-platform",
        name: "Platform",
        type: "team",
        status: "active",
        children: [
          {
            id: "eng-platform-1",
            name: "Alex Johnson",
            type: "member",
            status: "active",
            role: "Staff Engineer",
            avatar:
              "/examples/reui/photos/e93553df2422635515.jpg",
            flag: "us",
            location: "United States",
          },
          {
            id: "eng-platform-2",
            name: "Sarah Chen",
            type: "member",
            status: "active",
            role: "Senior Engineer",
            avatar:
              "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
            flag: "gb",
            location: "United Kingdom",
          },
          {
            id: "eng-platform-3",
            name: "Michael Rodriguez",
            type: "member",
            status: "inactive",
            role: "Frontend Engineer",
            avatar:
              "/examples/reui/photos/4349381d8a8476edbc.jpg",
            flag: "ca",
            location: "Canada",
          },
        ],
      },
      {
        id: "eng-mobile",
        name: "Mobile",
        type: "team",
        status: "active",
        children: [
          {
            id: "eng-mobile-1",
            name: "Emma Wilson",
            type: "member",
            status: "active",
            role: "iOS Engineer",
            avatar:
              "/examples/reui/photos/046af0b7d159f9f4fd.jpg",
            flag: "au",
            location: "Australia",
          },
          {
            id: "eng-mobile-2",
            name: "David Kim",
            type: "member",
            status: "active",
            role: "Android Engineer",
            avatar:
              "/examples/reui/photos/973d47055c51440af7.jpg",
            flag: "de",
            location: "Germany",
          },
        ],
      },
    ],
  },
  {
    id: "design",
    name: "Design",
    type: "department",
    status: "active",
    children: [
      {
        id: "design-product",
        name: "Product Design",
        type: "team",
        status: "active",
        children: [
          {
            id: "design-product-1",
            name: "Aron Thompson",
            type: "member",
            status: "active",
            role: "Design Lead",
            avatar:
              "/examples/reui/photos/df73db9a2c25069a42.jpg",
            flag: "my",
            location: "Malaysia",
          },
          {
            id: "design-product-2",
            name: "Maria Garcia",
            type: "member",
            status: "active",
            role: "Product Designer",
            avatar:
              "/examples/reui/photos/067c566cd567259bb9.jpg",
            flag: "jp",
            location: "Japan",
          },
          {
            id: "design-product-3",
            name: "James Brown",
            type: "member",
            status: "inactive",
            role: "UX Researcher",
            avatar:
              "/examples/reui/photos/c75592a667f30cfd44.jpg",
            flag: "es",
            location: "Spain",
          },
        ],
      },
      {
        id: "design-brand",
        name: "Brand",
        type: "team",
        status: "active",
        children: [
          {
            id: "design-brand-1",
            name: "Nick Johnson",
            type: "member",
            status: "active",
            role: "Brand Designer",
            avatar:
              "/examples/reui/photos/f1d4253436738aaf8f.jpg",
            flag: "fr",
            location: "France",
          },
          {
            id: "design-brand-2",
            name: "Liam Thompson",
            type: "member",
            status: "inactive",
            role: "Motion Designer",
            avatar:
              "/examples/reui/photos/a3afee2f77d259ce6a.jpg",
            flag: "it",
            location: "Italy",
          },
        ],
      },
    ],
  },
  {
    id: "marketing",
    name: "Marketing",
    type: "department",
    status: "active",
    children: [
      {
        id: "marketing-growth",
        name: "Growth",
        type: "team",
        status: "active",
        children: [
          {
            id: "marketing-growth-1",
            name: "Olivia Martin",
            type: "member",
            status: "active",
            role: "Growth Lead",
            avatar:
              "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
            flag: "us",
            location: "United States",
          },
          {
            id: "marketing-growth-2",
            name: "Ethan Clark",
            type: "member",
            status: "active",
            role: "Performance Marketer",
            avatar:
              "/examples/reui/photos/e93553df2422635515.jpg",
            flag: "ca",
            location: "Canada",
          },
        ],
      },
      {
        id: "marketing-content",
        name: "Content",
        type: "team",
        status: "active",
        children: [
          {
            id: "marketing-content-1",
            name: "Sofia Rossi",
            type: "member",
            status: "active",
            role: "Content Lead",
            avatar:
              "/examples/reui/photos/046af0b7d159f9f4fd.jpg",
            flag: "it",
            location: "Italy",
          },
          {
            id: "marketing-content-2",
            name: "Lucas Meyer",
            type: "member",
            status: "inactive",
            role: "Copywriter",
            avatar:
              "/examples/reui/photos/4349381d8a8476edbc.jpg",
            flag: "de",
            location: "Germany",
          },
        ],
      },
    ],
  },
  {
    id: "operations",
    name: "Operations",
    type: "department",
    status: "active",
    children: [
      {
        id: "operations-finance",
        name: "Finance",
        type: "team",
        status: "active",
        children: [
          {
            id: "operations-finance-1",
            name: "Grace Lee",
            type: "member",
            status: "active",
            role: "Finance Lead",
            avatar:
              "/examples/reui/photos/067c566cd567259bb9.jpg",
            flag: "kr",
            location: "South Korea",
          },
          {
            id: "operations-finance-2",
            name: "Daniel Novak",
            type: "member",
            status: "active",
            role: "Accountant",
            avatar:
              "/examples/reui/photos/973d47055c51440af7.jpg",
            flag: "cz",
            location: "Czechia",
          },
        ],
      },
      {
        id: "operations-people",
        name: "People",
        type: "team",
        status: "active",
        children: [
          {
            id: "operations-people-1",
            name: "Chloe Dubois",
            type: "member",
            status: "active",
            role: "People Lead",
            avatar:
              "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
            flag: "fr",
            location: "France",
          },
          {
            id: "operations-people-2",
            name: "Ryan Walsh",
            type: "member",
            status: "active",
            role: "Recruiter",
            avatar:
              "/examples/reui/photos/df73db9a2c25069a42.jpg",
            flag: "ie",
            location: "Ireland",
          },
        ],
      },
    ],
  },
  {
    id: "sales",
    name: "Sales",
    type: "department",
    status: "active",
    children: [
      {
        id: "sales-accounts",
        name: "Accounts",
        type: "team",
        status: "active",
        children: [
          {
            id: "sales-accounts-1",
            name: "Mia Park",
            type: "member",
            status: "active",
            role: "Account Executive",
            avatar:
              "/examples/reui/photos/046af0b7d159f9f4fd.jpg",
            flag: "kr",
            location: "South Korea",
          },
          {
            id: "sales-accounts-2",
            name: "Noah Fischer",
            type: "member",
            status: "inactive",
            role: "Account Manager",
            avatar:
              "/examples/reui/photos/c75592a667f30cfd44.jpg",
            flag: "at",
            location: "Austria",
          },
        ],
      },
    ],
  },
]

// Collapsed rows are unmounted, so their images would load only when a
// branch is first expanded and pop in after the fallback renders. Warming
// them once at mount keeps expansion flicker-free.
function collectImageUrls(rows: IData[]): string[] {
  return rows.flatMap((row) => [
    ...(row.avatar ? [row.avatar] : []),
    ...(row.flag ? [`/examples/reui/flags/${row.flag.toLowerCase()}.svg`] : []),
    ...(row.children ? collectImageUrls(row.children) : []),
  ])
}

  function OriginalPattern() {
  const { locales: exampleLocales } = useExampleRuntime()

  const [pagination, setPagination] = useState<TanStackTable.PaginationState>({
    pageIndex: 0,
    pageSize: 4,
  })
  const [sorting, setSorting] = useState<TanStackTable.SortingState>([])
  const [expanded, setExpanded] = useState<TanStackTable.ExpandedState>({
    eng: true,
    "eng-platform": true,
  })

  useEffect(() => {
    for (const src of collectImageUrls(demoData)) {
      const image = new Image()
      image.src = src
    }
  }, [])

  const columns = useMemo<TanStackTable.ColumnDef<DataGridFeatures, IData>[]>(
    () => [
      {
        accessorKey: "name",
        id: "name",
        header: ({ column }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<DataGridColumnHeader title={copyExample("Name")} column={column} />)} />
        ),
        cell: ({ row }) => {
          const item = row.original

          return (
            <ExampleRuntimeConsumer render={({copy: copyExample}) => (<div className="flex items-center gap-1">
              <DataGridTableRowExpand row={row} className="-ms-1.5 -me-1" />
              {<ExampleText>{item.type === "member" ? (
                <>
                  <Avatar className="size-6 shrink-0">
                    <AvatarImage src={item.avatar} alt={copyExample(item.name)} />
                    <AvatarFallback>
                      {<ExampleText>{item.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}</ExampleText>}
                    </AvatarFallback>
                  </Avatar>
                  <a onClick={(event) => event.preventDefault()}
                    href="#"
                    className="text-foreground hover:text-primary font-medium"
                  >
                    {<ExampleText>{item.name}</ExampleText>}
                  </a>
                </>
              ) : (
                <span className="text-foreground font-medium">{<ExampleText>{item.name}</ExampleText>}</span>
              )}</ExampleText>}
            </div>)} />
          )
        },
        minSize: 260,
        enableSorting: true,
        enableHiding: false,
        meta: {
          autoSize: true,
        },
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<DataGridColumnHeader title={copyExample("Role")} column={column} />)} />
        ),
        cell: ({ row }) => {
          const item = row.original

          return (
            <div className="text-muted-foreground">
              {<ExampleText>{item.role ??
                (item.type === "department" ? "Department" : "Team")}</ExampleText>}
            </div>
          )
        },
        size: 180,
      },
      {
        accessorKey: "location",
        header: ({ column }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<DataGridColumnHeader title={copyExample("Location")} column={column} />)} />
        ),
        cell: ({ row }) => {
          const item = row.original

          const locationFlag = item.flag
          if (!item.location || !locationFlag) {
            return <span className="text-muted-foreground">-</span>
          }

          return (
            <ExampleRuntimeConsumer render={({copy: copyExample}) => (<div className="flex items-center gap-1.5">
              <img
                src={`/examples/reui/flags/${locationFlag.toLowerCase()}.svg`}
                alt={copyExample(item.flag)}
                className="size-4 rounded-full object-cover"
              />
              <div className="text-foreground font-medium">{<ExampleText>{item.location}</ExampleText>}</div>
            </div>)} />
          )
        },
        size: 180,
      },
      {
        accessorKey: "status",
        id: "status",
        header: ({ column }) => (
          <ExampleRuntimeConsumer render={({copy: copyExample}) => (<DataGridColumnHeader title={copyExample("Status")} column={column} />)} />
        ),
        cell: ({ row }) => {
          if (row.original.status === "active") {
            return <Badge variant="success-outline">{<ExampleText>Active</ExampleText>}</Badge>
          }

          return <Badge variant="warning-outline">{<ExampleText>Inactive</ExampleText>}</Badge>
        },
        size: 130,
      },
    ],
    []
  )

  const table = TanStackTable.useTable({
    features: dataGridFeatures,
    columns,
    data: demoData,
    pageCount: Math.ceil((demoData?.length || 0) / pagination.pageSize),
    getRowId: (row: IData) => row.id,
    getSubRows: (row) => row.children,
    state: {
      pagination,
      sorting,
      expanded,
    },
    // Keep expanded children on the same page as their parent.
    paginateExpandedRows: false,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
  })

  return (
    <DataGrid i18n={exampleLocales.dataGrid}
      table={table}
      recordCount={demoData?.length || 0}
      tableLayout={{
        columnsResizable: true,
        columnsMovable: true,
        columnsVisibility: true,
      }}
    >
      <div className="w-full space-y-2.5">
        <Card className="overflow-hidden p-0">
          <DataGridContainer>
            <DataGridScrollArea>
              <DataGridTable />
            </DataGridScrollArea>
          </DataGridContainer>
        </Card>
        <DataGridPagination sizes={[4, 8, 16]} />
      </div>
    </DataGrid>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "38rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
