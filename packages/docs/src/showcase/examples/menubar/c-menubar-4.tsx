
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { FileIcon, FolderIcon, LogOutIcon, SaveIcon, UserIcon } from "lucide-react"

import {
  Menubar,
  MenubarContent,
  MenubarGroup,
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
              <FileIcon  />
              {<ExampleText>New File </ExampleText>}<MenubarShortcut>{<ExampleText>⌘N</ExampleText>}</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <FolderIcon  />
              {<ExampleText>Open Folder </ExampleText>}</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <SaveIcon  />
              {<ExampleText>Save </ExampleText>}<MenubarShortcut>{<ExampleText>⌘S</ExampleText>}</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>{<ExampleText>Account</ExampleText>}</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarItem>
                <UserIcon  />
                {<ExampleText>Profile </ExampleText>}</MenubarItem>
              <MenubarSeparator />
              <MenubarItem variant="destructive">
                <LogOutIcon  />
                {<ExampleText>Sign out </ExampleText>}</MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
