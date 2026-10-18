
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>{<ExampleText>File</ExampleText>}</MenubarTrigger>
          <MenubarContent>
            <MenubarSub>
              <MenubarSubTrigger>{<ExampleText>Share</ExampleText>}</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>{<ExampleText>Email link</ExampleText>}</MenubarItem>
                <MenubarItem>{<ExampleText>Messages</ExampleText>}</MenubarItem>
                <MenubarItem>{<ExampleText>Notes</ExampleText>}</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem>
              {<ExampleText>Print… </ExampleText>}<MenubarShortcut>{<ExampleText>⌘P</ExampleText>}</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>{<ExampleText>Edit</ExampleText>}</MenubarTrigger>
          <MenubarContent>
            <MenubarSub>
              <MenubarSubTrigger>{<ExampleText>Find</ExampleText>}</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>{<ExampleText>Find…</ExampleText>}</MenubarItem>
                <MenubarItem>{<ExampleText>Find Next</ExampleText>}</MenubarItem>
                <MenubarItem>{<ExampleText>Find Previous</ExampleText>}</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
