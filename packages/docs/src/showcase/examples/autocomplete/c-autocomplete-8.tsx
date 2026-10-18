"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime, useExampleFilter } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
const AutocompletePrimitive = { useFilter: useExampleFilter }
import { useMemo, useState } from "react"
import {
  Autocomplete,
  AutocompleteCollection,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@exre/exui"


import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const [value, setValue] = useState("")
  const [open, setOpen] = useState(false)

  const { contains } = AutocompletePrimitive.useFilter({ sensitivity: "base" })

  const filteredItems = useMemo(() => {
    if (!value) return groupedUsers

    return groupedUsers
      .map((group) => ({
        ...group,
        items: (group.items || []).filter(
          (item) =>
            contains(item.name || "", value) ||
            contains(item.group || "", value) ||
            contains(item.position || "", value)
        ),
      }))
      .filter((group) => group.items && group.items.length > 0)
  }, [value, contains])

  return (
    <div className="w-full max-w-xs">
      <Autocomplete
        items={filteredItems}
        value={value}
        onValueChange={setValue}
        open={open}
        onOpenChange={setOpen}
        itemToStringValue={(item: unknown) => (item as User).name}
        filter={null}
      >
        <AutocompleteInput placeholder={copyExample("e.g. John, Developer, Marketing")} />
        {<ExampleText>{open && (
          <AutocompleteContent className="pt-0">
            {<ExampleText>{filteredItems.length === 0 ? (
              <AutocompleteEmpty>{<ExampleText>No matching users found.</ExampleText>}</AutocompleteEmpty>
            ) : (
              <AutocompleteList className="not-empty:py-0">
                {(group: UserGroup) => (
                  <AutocompleteGroup
                    key={group.group}
                    items={group.items}
                    className="py-0"
                  >
                    <AutocompleteGroupLabel className="bg-background text-muted-foreground sticky top-0 z-10 me-1.5 py-2.5 text-xs font-medium">
                      {<ExampleText>{group.group}</ExampleText>}
                    </AutocompleteGroupLabel>
                    <AutocompleteCollection>
                      {(item: User) => (
                        <ExampleRuntimeConsumer key={item.id} render={({copy: copyExample}) => (<AutocompleteItem
                          key={item.id}
                          value={item}
                          className="flex items-center gap-2.5 rounded-lg"
                        >
                          <Avatar className="size-9">
                            <AvatarImage
                              src={item.avatar}
                              alt={copyExample(item.name || "User")}
                            />
                            <AvatarFallback>
                              {<ExampleText>{(item.name || "U")
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}</ExampleText>}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-medium">
                              {<ExampleText>{item.name || "Unknown"}</ExampleText>}
                            </div>
                            <div className="text-muted-foreground truncate text-sm">
                              {<ExampleText>{item.position || "No position available"}</ExampleText>}
                            </div>
                          </div>
                        </AutocompleteItem>)} />
                      )}
                    </AutocompleteCollection>
                  </AutocompleteGroup>
                )}
              </AutocompleteList>
            )}</ExampleText>}
          </AutocompleteContent>
        )}</ExampleText>}
      </Autocomplete>
    </div>
  )
}

interface User {
  id: string
  name: string
  group: string
  position: string
  avatar: string
  status: "Active" | "Inactive" | "Away"
}

interface UserGroup {
  group: string
  items: User[]
}

const usersData: User[] = [
  // Development Team
  {
    id: "john-doe",
    name: "John Doe",
    group: "Development Team",
    position: "Senior Frontend Developer",
    avatar: "/examples/reui/photos/4342c8343f38562388.jpg",
    status: "Active",
  },
  {
    id: "jane-smith",
    name: "Jane Smith",
    group: "Development Team",
    position: "Full Stack Developer",
    avatar: "/examples/reui/photos/f0fb6d9fa4dd3c2a9e.jpg",
    status: "Active",
  },
  {
    id: "mike-wilson",
    name: "Mike Wilson",
    group: "Development Team",
    position: "Backend Developer",
    avatar: "/examples/reui/photos/d28200d97f109ef7bd.jpg",
    status: "Active",
  },
  {
    id: "sarah-johnson",
    name: "Sarah Johnson",
    group: "Development Team",
    position: "DevOps Engineer",
    avatar: "/examples/reui/photos/26b2d8e69e31afd55b.jpg",
    status: "Away",
  },
  {
    id: "david-brown",
    name: "David Brown",
    group: "Development Team",
    position: "Mobile Developer",
    avatar: "/examples/reui/photos/b52fd343cddf0caa04.jpg",
    status: "Active",
  },
  {
    id: "lisa-garcia",
    name: "Lisa Garcia",
    group: "Development Team",
    position: "UI/UX Developer",
    avatar: "/examples/reui/photos/2bbeb95380bb9d2d09.jpg",
    status: "Active",
  },

  // Design Team
  {
    id: "alex-martinez",
    name: "Alex Martinez",
    group: "Design Team",
    position: "Lead UX Designer",
    avatar: "/examples/reui/photos/c21a444cce1a796d39.jpg",
    status: "Active",
  },
  {
    id: "emma-davis",
    name: "Emma Davis",
    group: "Design Team",
    position: "UI Designer",
    avatar: "/examples/reui/photos/061a1e14d562d22b1a.jpg",
    status: "Active",
  },
  {
    id: "chris-taylor",
    name: "Chris Taylor",
    group: "Design Team",
    position: "Product Designer",
    avatar: "/examples/reui/photos/b07d4d0875fa8ba405.jpg",
    status: "Active",
  },
  {
    id: "olivia-anderson",
    name: "Olivia Anderson",
    group: "Design Team",
    position: "Visual Designer",
    avatar: "/examples/reui/photos/15b65855433f942355.jpg",
    status: "Inactive",
  },

  // Marketing Team
  {
    id: "james-moore",
    name: "James Moore",
    group: "Marketing Team",
    position: "Marketing Manager",
    avatar: "/examples/reui/photos/1312ce123c18a93b29.jpg",
    status: "Active",
  },
  {
    id: "sophia-white",
    name: "Sophia White",
    group: "Marketing Team",
    position: "Content Marketing Specialist",
    avatar: "/examples/reui/photos/1f13cfba5372a5a343.jpg",
    status: "Active",
  },
  {
    id: "william-harris",
    name: "William Harris",
    group: "Marketing Team",
    position: "Digital Marketing Specialist",
    avatar: "/examples/reui/photos/56505d15eb15a8386f.jpg",
    status: "Active",
  },
  {
    id: "ava-martin",
    name: "Ava Martin",
    group: "Marketing Team",
    position: "Social Media Manager",
    avatar: "/examples/reui/photos/fa633a17792c16d3d0.jpg",
    status: "Away",
  },

  // Sales Team
  {
    id: "ethan-thompson",
    name: "Ethan Thompson",
    group: "Sales Team",
    position: "Sales Director",
    avatar: "/examples/reui/photos/a36f6e5451cbbf0917.jpg",
    status: "Active",
  },
  {
    id: "mia-garcia",
    name: "Mia Garcia",
    group: "Sales Team",
    position: "Account Executive",
    avatar: "/examples/reui/photos/4a39d3ea9365eb0cac.jpg",
    status: "Active",
  },
  {
    id: "noah-martinez",
    name: "Noah Martinez",
    group: "Sales Team",
    position: "Sales Representative",
    avatar: "/examples/reui/photos/22ab94dabe1a5382cd.jpg",
    status: "Active",
  },
  {
    id: "isabella-rodriguez",
    name: "Isabella Rodriguez",
    group: "Sales Team",
    position: "Business Development Manager",
    avatar: "/examples/reui/photos/fea73a77a1afde4456.jpg",
    status: "Active",
  },

  // Management Team
  {
    id: "lucas-lee",
    name: "Lucas Lee",
    group: "Management Team",
    position: "CEO",
    avatar: "/examples/reui/photos/74e83c28d9f60165b7.jpg",
    status: "Active",
  },
  {
    id: "charlotte-walker",
    name: "Charlotte Walker",
    group: "Management Team",
    position: "CTO",
    avatar: "/examples/reui/photos/680905eed473f03053.jpg",
    status: "Active",
  },
  {
    id: "benjamin-hall",
    name: "Benjamin Hall",
    group: "Management Team",
    position: "VP of Engineering",
    avatar: "/examples/reui/photos/32ef49fd928350fdcd.jpg",
    status: "Active",
  },
  {
    id: "amelia-allen",
    name: "Amelia Allen",
    group: "Management Team",
    position: "VP of Marketing",
    avatar: "/examples/reui/photos/6a23a44cfa1f6513bb.jpg",
    status: "Active",
  },

  // Support Team
  {
    id: "henry-young",
    name: "Henry Young",
    group: "Support Team",
    position: "Customer Success Manager",
    avatar: "/examples/reui/photos/d24e3b963979d19d16.jpg",
    status: "Active",
  },
  {
    id: "grace-king",
    name: "Grace King",
    group: "Support Team",
    position: "Technical Support Specialist",
    avatar: "/examples/reui/photos/9b0f719279d1af83b9.jpg",
    status: "Active",
  },
  {
    id: "sebastian-wright",
    name: "Sebastian Wright",
    group: "Support Team",
    position: "Customer Support Representative",
    avatar: "/examples/reui/photos/d3f84cfec347aa987c.jpg",
    status: "Away",
  },
  {
    id: "lily-lopez",
    name: "Lily Lopez",
    group: "Support Team",
    position: "Help Desk Technician",
    avatar: "/examples/reui/photos/74a61d09ef0b503c55.jpg",
    status: "Active",
  },
]

function groupUsers(users: User[]): UserGroup[] {
  const groups: { [key: string]: User[] } = {}
  users.forEach((item) => {
    ;(groups[item.group] ??= []).push(item)
  })

  // Sort by status within each group (Active first, then Away, then Inactive)
  Object.keys(groups).forEach((group) => {
    groups[group].sort((a, b) => {
      const statusOrder = { Active: 0, Away: 1, Inactive: 2 }
      return statusOrder[a.status] - statusOrder[b.status]
    })
  })

  const order = [
    "Management Team",
    "Development Team",
    "Design Team",
    "Marketing Team",
    "Sales Team",
    "Support Team",
  ]
  return order.map((group) => ({ group, items: groups[group] ?? [] }))
}

const groupedUsers: UserGroup[] = groupUsers(usersData)

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
