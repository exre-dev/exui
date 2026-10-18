
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ClipboardIcon, CopyIcon, ScissorsIcon, TrashIcon } from "lucide-react"

import { Button } from "@exre/exui"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@exre/exui"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@exre/exui"


  function OriginalPattern() {
  return (
    <div className="flex w-full items-center justify-center p-12">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">{<ExampleText>Open Dialog</ExampleText>}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{<ExampleText>Context Menu Example</ExampleText>}</DialogTitle>
            <DialogDescription>
              {<ExampleText>Right click on the area below to see the context menu. </ExampleText>}</DialogDescription>
          </DialogHeader>
          <ContextMenu>
            <ContextMenuTrigger className="text-muted-foreground rounded-lg flex aspect-[2/0.5] w-full items-center justify-center border border-dashed text-sm">
              {<ExampleText>Right click here </ExampleText>}</ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuGroup>
                <ContextMenuItem>
                  <CopyIcon  />
                  {<ExampleText>Copy </ExampleText>}</ContextMenuItem>
                <ContextMenuItem>
                  <ScissorsIcon  />
                  {<ExampleText>Cut </ExampleText>}</ContextMenuItem>
                <ContextMenuItem>
                  <ClipboardIcon  />
                  {<ExampleText>Paste </ExampleText>}</ContextMenuItem>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuSub>
                <ContextMenuSubTrigger>{<ExampleText>More Options</ExampleText>}</ContextMenuSubTrigger>
                <ContextMenuSubContent>
                  <ContextMenuGroup>
                    <ContextMenuItem>{<ExampleText>Save Page...</ExampleText>}</ContextMenuItem>
                    <ContextMenuItem>{<ExampleText>Create Shortcut...</ExampleText>}</ContextMenuItem>
                    <ContextMenuItem>{<ExampleText>Name Window...</ExampleText>}</ContextMenuItem>
                  </ContextMenuGroup>
                  <ContextMenuSeparator />
                  <ContextMenuGroup>
                    <ContextMenuItem>{<ExampleText>Developer Tools</ExampleText>}</ContextMenuItem>
                  </ContextMenuGroup>
                </ContextMenuSubContent>
              </ContextMenuSub>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuItem variant="destructive">
                  <TrashIcon  />
                  {<ExampleText>Delete </ExampleText>}</ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuContent>
          </ContextMenu>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
