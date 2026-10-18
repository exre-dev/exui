
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BoldIcon, ImageIcon, ItalicIcon, LinkIcon } from "lucide-react"

import {
  Menubar,
  MenubarCheckboxItem,
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
          <MenubarTrigger>{<ExampleText>Format</ExampleText>}</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <BoldIcon  />
              {<ExampleText>Bold </ExampleText>}<MenubarShortcut>{<ExampleText>⌘B</ExampleText>}</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <ItalicIcon  />
              {<ExampleText>Italic </ExampleText>}<MenubarShortcut>{<ExampleText>⌘I</ExampleText>}</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarCheckboxItem checked>{<ExampleText>Strikethrough</ExampleText>}</MenubarCheckboxItem>
            <MenubarCheckboxItem>{<ExampleText>Code</ExampleText>}</MenubarCheckboxItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>{<ExampleText>Insert</ExampleText>}</MenubarTrigger>
          <MenubarContent>
            <MenubarSub>
              <MenubarSubTrigger>
                <ImageIcon  />
                {<ExampleText>Media </ExampleText>}</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>{<ExampleText>Image</ExampleText>}</MenubarItem>
                <MenubarItem>{<ExampleText>Video</ExampleText>}</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem>
              <LinkIcon  />
              {<ExampleText>Link </ExampleText>}<MenubarShortcut>{<ExampleText>⌘K</ExampleText>}</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
