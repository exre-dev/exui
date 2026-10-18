
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex w-full items-center justify-center p-12">
      <ContextMenu>
        <ContextMenuTrigger className="text-muted-foreground rounded-lg flex aspect-[2/0.5] w-full max-w-[300px] items-center justify-center border border-dashed text-sm">
          {<ExampleText>Right click here </ExampleText>}</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuLabel>{<ExampleText>File</ExampleText>}</ContextMenuLabel>
            <ContextMenuItem>
              {<ExampleText>New File </ExampleText>}<ContextMenuShortcut>{<ExampleText>⌘N</ExampleText>}</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              {<ExampleText>Open File </ExampleText>}<ContextMenuShortcut>{<ExampleText>⌘O</ExampleText>}</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              {<ExampleText>Save </ExampleText>}<ContextMenuShortcut>{<ExampleText>⌘S</ExampleText>}</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuLabel>{<ExampleText>Edit</ExampleText>}</ContextMenuLabel>
            <ContextMenuItem>
              {<ExampleText>Undo </ExampleText>}<ContextMenuShortcut>{<ExampleText>⌘Z</ExampleText>}</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              {<ExampleText>Redo </ExampleText>}<ContextMenuShortcut>{<ExampleText>⇧⌘Z</ExampleText>}</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuItem>
              {<ExampleText>Cut </ExampleText>}<ContextMenuShortcut>{<ExampleText>⌘X</ExampleText>}</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              {<ExampleText>Copy </ExampleText>}<ContextMenuShortcut>{<ExampleText>⌘C</ExampleText>}</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              {<ExampleText>Paste </ExampleText>}<ContextMenuShortcut>{<ExampleText>⌘V</ExampleText>}</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuItem variant="destructive">
              {<ExampleText>Delete </ExampleText>}<ContextMenuShortcut>⌫</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
