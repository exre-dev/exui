"use client"
"use no memo"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

// This file keeps "use no memo": its own cell/header templates read state
// through builder calls on a stable row/column, which React Compiler cannot
// see. The primitive wraps its own such reads in TanStack's Subscribe; a
// consumer template has to opt out or subscribe itself.
import { useMemo, useState } from "react"
import { Badge } from "@exre/exui"
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

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Button } from "@exre/exui"


interface IData {
  id: string
  name: string
  availability: "online" | "away" | "busy" | "offline"
  avatar: string
  status: "active" | "inactive"
  flag: string // Emoji flags
  email: string
  company: string
  role: string
  joined: string
  location: string
  balance: number
  details: string // New field
}

const demoData: IData[] = [
  {
    id: "1",
    name: "Alex Johnson",
    availability: "online",
    avatar:
      "/examples/reui/photos/e93553df2422635515.jpg",
    status: "active",
    flag: "us",
    email: "alex@apple.com",
    company: "Apple",
    role: "CEO",
    joined: "Jan, 2024",
    location: "United States",
    balance: 5143.03,
    details:
      "Alex is a visionary leader at Apple, focusing on innovation and team growth.",
  },
  {
    id: "2",
    name: "Sarah Chen",
    availability: "away",
    avatar:
      "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
    status: "inactive",
    flag: "gb",
    email: "sarah@openai.com",
    company: "OpenAI",
    role: "CTO",
    joined: "Mar, 2023",
    location: "United Kingdom",
    balance: 4321.87,
    details:
      "Sarah is a technology pioneer specializing in artificial intelligence and machine learning.",
  },
  {
    id: "3",
    name: "Michael Rodriguez",
    availability: "busy",
    avatar:
      "/examples/reui/photos/4349381d8a8476edbc.jpg",
    status: "active",
    flag: "ca",
    email: "michael@meta.com",
    company: "Meta",
    role: "Designer",
    joined: "Jun, 2022",
    location: "Canada",
    balance: 7654.98,
    details:
      "Michael is a creative designer passionate about building user-centric experiences.",
  },
  {
    id: "4",
    name: "Emma Wilson",
    availability: "offline",
    avatar:
      "/examples/reui/photos/046af0b7d159f9f4fd.jpg",
    status: "inactive",
    flag: "au",
    email: "emma@tesla.com",
    company: "Tesla",
    role: "Developer",
    joined: "Sep, 2024",
    location: "Australia",
    balance: 3456.45,
    details:
      "Emma is a talented developer focused on innovative solutions in automotive technology.",
  },
  {
    id: "5",
    name: "David Kim",
    availability: "online",
    avatar:
      "/examples/reui/photos/973d47055c51440af7.jpg",
    status: "active",
    flag: "de",
    email: "david@sap.com",
    company: "SAP",
    role: "Lawyer",
    joined: "Nov, 2023",
    location: "Germany",
    balance: 9876.54,
    details:
      "David is a corporate lawyer specializing in technology and software agreements.",
  },
  {
    id: "6",
    name: "Aron Thompson",
    availability: "away",
    avatar:
      "/examples/reui/photos/df73db9a2c25069a42.jpg",
    status: "active",
    flag: "my",
    email: "aron@keenthemes.com",
    company: "Keenthemes",
    role: "Director",
    joined: "Feb, 2022",
    location: "Malaysia",
    balance: 6214.22,
    details:
      "Aron oversees product development and team leadership at Keenthemes.",
  },
  {
    id: "7",
    name: "James Brown",
    availability: "busy",
    avatar:
      "/examples/reui/photos/c75592a667f30cfd44.jpg",
    status: "inactive",
    flag: "es",
    email: "james@bbva.es",
    company: "BBVA",
    role: "Product Manager",
    joined: "Aug, 2024",
    location: "Spain",
    balance: 5321.77,
    details:
      "James manages product development and strategy for BBVA's digital platforms.",
  },
  {
    id: "8",
    name: "Maria Garcia",
    availability: "offline",
    avatar:
      "/examples/reui/photos/067c566cd567259bb9.jpg",
    status: "active",
    flag: "jp",
    email: "maria@sony.jp",
    company: "Sony",
    role: "Marketing Lead",
    joined: "Dec, 2023",
    location: "Japan",
    balance: 8452.39,
    details:
      "Maria leads innovative marketing campaigns for Sony's flagship products.",
  },
  {
    id: "9",
    name: "Nick Johnson",
    availability: "online",
    avatar:
      "/examples/reui/photos/f1d4253436738aaf8f.jpg",
    status: "inactive",
    flag: "fr",
    email: "nick@lvmh.fr",
    company: "LVMH",
    role: "Data Scientist",
    joined: "Apr, 2022",
    location: "France",
    balance: 7345.1,
    details:
      "Nick is a data scientist optimizing sales and marketing analytics at LVMH.",
  },
  {
    id: "10",
    name: "Liam Thompson",
    availability: "away",
    avatar:
      "/examples/reui/photos/a3afee2f77d259ce6a.jpg",
    status: "inactive",
    flag: "it",
    email: "liam@eni.it",
    company: "ENI",
    role: "Engineer",
    joined: "Jul, 2024",
    location: "Italy",
    balance: 5214.88,
    details:
      "Liam is a lead engineer developing sustainable energy solutions at ENI.",
  },
  {
    id: "11",
    name: "Alex Johnson",
    availability: "busy",
    avatar:
      "/examples/reui/photos/e93553df2422635515.jpg",
    status: "inactive",
    flag: "br",
    email: "alex@vale.br",
    company: "Vale",
    role: "Software Engineer",
    joined: "May, 2023",
    location: "Brazil",
    balance: 9421.5,
    details:
      "Alex develops cutting-edge software to optimize mining operations at Vale.",
  },
  {
    id: "12",
    name: "Sarah Chen",
    availability: "offline",
    avatar:
      "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
    status: "active",
    flag: "in",
    email: "sarah@tata.in",
    company: "Tata",
    role: "Sales Manager",
    joined: "Oct, 2024",
    location: "India",
    balance: 4521.67,
    details:
      "Sarah manages international sales for Tata's industrial and automotive products.",
  },
]

  function OriginalPattern() {
  const { copy: copyExample, locales: exampleLocales } = useExampleRuntime()

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
        id: "id",
        header: () => null,
        cell: ({ row }) => {
          return row.getCanExpand() ? (
            <Button aria-label={row.getIsExpanded() ? copyExample("Collapse row") : copyExample("Expand row")}
              {...{
                className: "size-6 text-muted-foreground hover:bg-transparent",
                onClick: row.getToggleExpandedHandler(),
                mode: "icon",
                variant: "ghost",
              }}
            >
              {<ExampleText>{row.getIsExpanded() ? (
                <ChevronUpIcon aria-hidden="true" />
              ) : (
                <ChevronDownIcon aria-hidden="true" />
              )}</ExampleText>}
            </Button>
          ) : null
        },
        size: 25,
        meta: {
          expandedContent: (row) => (
            <div className="text-muted-foreground ms-12 py-3 text-sm">
              {<ExampleText>{row.details}</ExampleText>}
            </div>
          ),
        },
      },
      {
        accessorKey: "name",
        id: "name",
        meta: { get headerTitle() { return copyExample("Name") } }, header: () => <ExampleText>Name</ExampleText>,
        cell: ({ row }) => {
          return (
            <ExampleRuntimeConsumer render={({copy: copyExample}) => (<div className="flex items-center gap-2">
              <Avatar className="size-6">
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
              <a onClick={(event) => event.preventDefault()}
                href="#"
                className="text-foreground hover:text-primary font-medium"
              >
                {<ExampleText>{row.original.name}</ExampleText>}
              </a>
            </div>)} />
          )
        },
        size: 150,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: "email",
        meta: { get headerTitle() { return copyExample("Email") } }, header: () => <ExampleText>Email</ExampleText>,
        cell: (info) => (
          <a
            href={`mailto:${info.getValue()}`}
            className="hover:text-primary hover:underline"
          >
            {<ExampleText>{info.getValue() as string}</ExampleText>}
          </a>
        ),
        size: 150,
      },
      {
        accessorKey: "location",
        header: () => <ExampleText>Location</ExampleText>,
        cell: ({ row }) => (
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
        ),
        size: 175,
        meta: {get headerTitle() { return copyExample("Location") },
          headerClassName: "",
          cellClassName: "text-start",
        },
      },
      {
        accessorKey: "status",
        id: "status",
        meta: { get headerTitle() { return copyExample("Status") } }, header: () => <ExampleText>Status</ExampleText>,
        cell: ({ row }) => {
          const status = row.original.status

          if (status == "active") {
            return <Badge variant="success-outline">{<ExampleText>Approved</ExampleText>}</Badge>
          } else {
            return <Badge variant="warning-outline">{<ExampleText>Pending</ExampleText>}</Badge>
          }
        },
        size: 100,
      },
    ],
    [copyExample]
  )

  const table = TanStackTable.useTable({
    features: dataGridFeatures,
    columns,
    data: demoData,
    pageCount: Math.ceil((demoData?.length || 0) / pagination.pageSize),
    getRowId: (row: IData) => row.id,
    getRowCanExpand: (row) => Boolean(row.original.details),
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
      recordCount={demoData?.length || 0}
      tableLayout={{ headerBackground: false }}
    >
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

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "27.25rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
