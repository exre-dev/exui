
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>{<ExampleText>File</ExampleText>}</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              {<ExampleText>New Tab </ExampleText>}<MenubarShortcut>{<ExampleText>⌘T</ExampleText>}</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              {<ExampleText>New Window </ExampleText>}<MenubarShortcut>{<ExampleText>⌘N</ExampleText>}</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>{<ExampleText>New Incognito Window</ExampleText>}</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              {<ExampleText>Print… </ExampleText>}<MenubarShortcut>{<ExampleText>⌘P</ExampleText>}</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>{<ExampleText>Edit</ExampleText>}</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              {<ExampleText>Undo </ExampleText>}<MenubarShortcut>{<ExampleText>⌘Z</ExampleText>}</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              {<ExampleText>Redo </ExampleText>}<MenubarShortcut>{<ExampleText>⇧⌘Z</ExampleText>}</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>{<ExampleText>Cut</ExampleText>}</MenubarItem>
            <MenubarItem>{<ExampleText>Copy</ExampleText>}</MenubarItem>
            <MenubarItem>{<ExampleText>Paste</ExampleText>}</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
