
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
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
              {<ExampleText>Copy </ExampleText>}<ContextMenuShortcut>{<ExampleText>⌘C</ExampleText>}</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              {<ExampleText>Cut </ExampleText>}<ContextMenuShortcut>{<ExampleText>⌘X</ExampleText>}</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSub>
            <ContextMenuSubTrigger>{<ExampleText>More Tools</ExampleText>}</ContextMenuSubTrigger>
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
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuItem variant="destructive">{<ExampleText>Delete</ExampleText>}</ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
