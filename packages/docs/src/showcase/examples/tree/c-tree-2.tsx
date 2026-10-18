"use client"

import { useId as useTreeInstanceId } from "react"

import { useExampleRuntime, ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Tree,
  TreeItem,
  TreeItemLabel,
} from "@exre/exui"
import { hotkeysCoreFeature, syncDataLoaderFeature } from "@headless-tree/core"
import { useTree } from "@headless-tree/react"

interface Item {
  name: string
  children?: string[]
}

const items: Record<string, Item> = {
  crm: {
    name: "CRM",
    children: ["leads", "accounts", "activities", "support"],
  },
  leads: {
    name: "Leads",
    children: ["new-lead", "contacted-lead", "qualified-lead"],
  },
  "new-lead": { name: "New Lead" },
  "contacted-lead": { name: "Contacted Lead" },
  "qualified-lead": { name: "Qualified Lead" },
  accounts: {
    name: "Accounts",
    children: ["acme-corp", "globex-inc"],
  },
  "acme-corp": {
    name: "Acme Corp",
    children: ["acme-contacts", "acme-opportunities"],
  },
  "acme-contacts": {
    name: "Contacts",
    children: ["john-smith", "jane-doe"],
  },
  "john-smith": { name: "John Smith" },
  "jane-doe": { name: "Jane Doe" },
  "acme-opportunities": {
    name: "Opportunities",
    children: ["website-redesign", "annual-maintenance"],
  },
  "website-redesign": { name: "Website Redesign" },
  "annual-maintenance": { name: "Annual Maintenance" },
  "globex-inc": {
    name: "Globex Inc",
    children: ["globex-contacts", "globex-opportunities"],
  },
  "globex-contacts": {
    name: "Contacts",
    children: ["alice-johnson"],
  },
  "alice-johnson": { name: "Alice Johnson" },
  "globex-opportunities": {
    name: "Opportunities",
    children: ["cloud-migration"],
  },
  "cloud-migration": { name: "Cloud Migration" },
  activities: {
    name: "Activities",
    children: ["calls", "meetings", "emails"],
  },
  calls: { name: "Calls" },
  meetings: { name: "Meetings" },
  emails: { name: "Emails" },
  support: {
    name: "Support",
    children: ["open-tickets", "closed-tickets"],
  },
  "open-tickets": { name: "Open Tickets" },
  "closed-tickets": { name: "Closed Tickets" },
}

const indent = 20

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const treeInstanceId = useTreeInstanceId()

  const tree = useTree<Item>({
    initialState: {
      expandedItems: ["leads", "accounts", "activities"],
    },
    indent,
    rootItemId: "crm",
    getItemName: (item) => copyExample(item.getItemData().name),
    isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
    dataLoader: {
      getItem: (itemId) => items[itemId],
      getChildren: (itemId) => items[itemId].children ?? [],
    },
    features: [syncDataLoaderFeature, hotkeysCoreFeature],
  })

  return (
    <div className="mx-auto w-full grow place-self-start lg:w-xs">
      <Tree id={treeInstanceId + "-tree"}
        className="relative before:absolute before:inset-0 before:-ms-1 before:bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)))]"
        indent={indent}
        tree={tree}
      >
        {<ExampleText>{tree.getItems().map((item) => {
          return (
            <TreeItem id={treeInstanceId + "-item-" + item.getId()} key={item.getId()} item={item}>
              <TreeItemLabel />
            </TreeItem>
          )
        })}</ExampleText>}
      </Tree>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
