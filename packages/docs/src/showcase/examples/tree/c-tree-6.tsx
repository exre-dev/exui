"use client"

import { useId as useTreeInstanceId } from "react"

import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Tree,
  TreeItem,
  TreeItemLabel,
} from "@exre/exui"
import { hotkeysCoreFeature, syncDataLoaderFeature } from "@headless-tree/core"
import { useTree } from "@headless-tree/react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"

interface OrgItem {
  name: string
  role?: string
  avatar?: string
  children?: string[]
}

const items: Record<string, OrgItem> = {
  company: { name: "Acme Inc.", children: ["ceo"] },
  ceo: {
    name: "Sarah Chen",
    role: "CEO",
    avatar:
      "/examples/reui/photos/c6e9e0d487c842b94f.jpg",
    children: ["cto", "coo", "cfo"],
  },
  cto: {
    name: "Alex Johnson",
    role: "CTO",
    avatar:
      "/examples/reui/photos/e93553df2422635515.jpg",
    children: ["eng-lead", "design-lead"],
  },
  coo: {
    name: "Emma Wilson",
    role: "COO",
    avatar:
      "/examples/reui/photos/dbc92c73c5f6acf737.jpg",
    children: ["ops-mgr", "hr-mgr"],
  },
  cfo: {
    name: "David Kim",
    role: "CFO",
    avatar:
      "/examples/reui/photos/2bc0a75442d5cf52e4.jpg",
    children: ["finance-mgr"],
  },
  "eng-lead": {
    name: "Michael Rodriguez",
    role: "Engineering Lead",
    avatar:
      "/examples/reui/photos/823cc7e47d4e7e6cb0.jpg",
    children: ["dev-1", "dev-2"],
  },
  "design-lead": {
    name: "Lisa Park",
    role: "Design Lead",
    avatar:
      "/examples/reui/photos/240c6b87e9fc32d076.jpg",
  },
  "ops-mgr": {
    name: "James Brown",
    role: "Operations Manager",
    avatar:
      "/examples/reui/photos/833451dbb99bcf927d.jpg",
  },
  "hr-mgr": {
    name: "Amy Taylor",
    role: "HR Manager",
    avatar:
      "/examples/reui/photos/1d09296b721df419b9.jpg",
  },
  "finance-mgr": {
    name: "Robert Davis",
    role: "Finance Manager",
    avatar:
      "/examples/reui/photos/99f5b111c8dfb9bdaa.jpg",
  },
  "dev-1": {
    name: "Tom Harris",
    role: "Senior Developer",
    avatar:
      "/examples/reui/photos/c6064767ae24420606.jpg",
  },
  "dev-2": {
    name: "Nina Patel",
    role: "Developer",
    avatar:
      "/examples/reui/photos/7da2efac125ddc6e00.jpg",
  },
}

const indent = 24

  function OriginalPattern() {
  const treeInstanceId = useTreeInstanceId()

  const tree = useTree<OrgItem>({
    initialState: {
      expandedItems: ["ceo", "cto"],
    },
    indent,
    rootItemId: "company",
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
    dataLoader: {
      getItem: (itemId) => items[itemId],
      getChildren: (itemId) => items[itemId].children ?? [],
    },
    features: [syncDataLoaderFeature, hotkeysCoreFeature],
  })

  return (
    <div className="mx-auto w-full grow place-self-start lg:w-xs">
      <Tree id={treeInstanceId + "-tree"} indent={indent} tree={tree}>
        {<ExampleText>{tree.getItems().map((item) => {
          const data = item.getItemData()
          const initials = data.name
            .split(" ")
            .map((n) => n[0])
            .join("")

          return (
            <ExampleRuntimeConsumer key={item.getId()} render={({copy: copyExample}) => (<TreeItem id={treeInstanceId + "-item-" + item.getId()} key={item.getId()} item={item}>
              <TreeItemLabel className="gap-2 py-1">
                <Avatar className="size-6 shrink-0">
                  <AvatarImage src={data.avatar} alt={copyExample(data.name)} />
                  <AvatarFallback className="text-[9px]">
                    {<ExampleText>{initials}</ExampleText>}
                  </AvatarFallback>
                </Avatar>
                <span className="flex flex-col items-start">
                  <span className="text-sm leading-tight">{<ExampleText>{data.name}</ExampleText>}</span>
                  {<ExampleText>{data.role && (
                    <span className="text-muted-foreground text-[10px] leading-tight">
                      {<ExampleText>{data.role}</ExampleText>}
                    </span>
                  )}</ExampleText>}
                </span>
              </TreeItemLabel>
            </TreeItem>)} />
          )
        })}</ExampleText>}
      </Tree>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
