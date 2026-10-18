
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ArchiveIcon, FileIcon, InboxIcon, SendIcon, Trash2Icon } from "lucide-react"

import { Badge } from "@exre/exui"

import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@exre/exui"


const menuItems = [
  {
    icon: (
      <InboxIcon  />
    ),
    label: "Inbox",
    count: 12,
  },
  {
    icon: (
      <SendIcon  />
    ),
    label: "Sent",
    count: 0,
  },
  {
    icon: (
      <FileIcon  />
    ),
    label: "Drafts",
    count: 3,
  },
  {
    icon: (
      <ArchiveIcon  />
    ),
    label: "Archive",
    count: 0,
  },
  {
    icon: (
      <Trash2Icon  />
    ),
    label: "Trash",
    count: 0,
  },
]

  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-full max-w-64 flex-col gap-0.5">
      {<ExampleText>{menuItems.map((item) => (
        <Item key={item.label} size="xs" asChild>
          <a onClick={(event) => event.preventDefault()} href="#">
            <ItemMedia variant="icon">{<ExampleText>{item.icon}</ExampleText>}</ItemMedia>
            <ItemContent>
              <ItemTitle>{<ExampleText>{item.label}</ExampleText>}</ItemTitle>
            </ItemContent>
            {<ExampleText>{item.count > 1 && (
              <ItemActions>
                <Badge
                  variant="success-light"
                  className="rounded-full"
                  size="xs"
                >
                  {<ExampleText>{item.count}</ExampleText>}
                </Badge>
              </ItemActions>
            )}</ExampleText>}
          </a>
        </Item>
      ))}</ExampleText>}
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
