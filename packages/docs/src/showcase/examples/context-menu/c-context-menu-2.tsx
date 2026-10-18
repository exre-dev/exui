
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ClipboardIcon, CopyIcon, ScissorsIcon, TrashIcon } from "lucide-react"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
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
          <ContextMenuGroup>
            <ContextMenuItem variant="destructive">
              <TrashIcon  />
              {<ExampleText>Delete </ExampleText>}</ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
