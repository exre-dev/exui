
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
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
            <ContextMenuItem>
              {<ExampleText>Back </ExampleText>}<ContextMenuShortcut>⌘[</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem disabled>
              {<ExampleText>Forward </ExampleText>}<ContextMenuShortcut>⌘]</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              {<ExampleText>Reload </ExampleText>}<ContextMenuShortcut>{<ExampleText>⌘R</ExampleText>}</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuItem>
              {<ExampleText>Save </ExampleText>}<ContextMenuShortcut>{<ExampleText>⌘S</ExampleText>}</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              {<ExampleText>Save As... </ExampleText>}<ContextMenuShortcut>{<ExampleText>⇧⌘S</ExampleText>}</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
