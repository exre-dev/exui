
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { LogOutIcon, PlusIcon, SaveIcon, SearchIcon, SettingsIcon } from "lucide-react"

import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@exre/exui"
import { Kbd } from "@exre/exui"


const commands = [
  {
    icon: (
      <SearchIcon  />
    ),
    label: "Search",
    shortcut: "⌘K",
  },
  {
    icon: (
      <PlusIcon  />
    ),
    label: "New File",
    shortcut: "⌘N",
  },
  {
    icon: (
      <SaveIcon  />
    ),
    label: "Save",
    shortcut: "⌘S",
  },
  {
    icon: (
      <SettingsIcon  />
    ),
    label: "Settings",
    shortcut: "⌘,",
  },
  {
    icon: (
      <LogOutIcon  />
    ),
    label: "Sign Out",
    shortcut: "⌘Q",
  },
]

  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-full max-w-64 flex-col gap-0.5">
      {<ExampleText>{commands.map((cmd) => (
        <Item key={cmd.label} asChild size="xs">
          <a onClick={(event) => event.preventDefault()} href="#">
            <ItemMedia variant="icon">{<ExampleText>{cmd.icon}</ExampleText>}</ItemMedia>
            <ItemContent>
              <ItemTitle>{<ExampleText>{cmd.label}</ExampleText>}</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Kbd>{<ExampleText>{cmd.shortcut}</ExampleText>}</Kbd>
            </ItemActions>
          </a>
        </Item>
      ))}</ExampleText>}
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
