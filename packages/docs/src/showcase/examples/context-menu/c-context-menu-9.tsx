
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex w-full items-center justify-center p-12">
      <div className="grid grid-cols-2 gap-2">
        {<ExampleText>{(["left", "top", "bottom", "right"] as const).map((side) => (
          <ContextMenu key={side}>
            <ContextMenuTrigger className="text-muted-foreground rounded-lg flex aspect-[2/0.5] items-center justify-center border border-dashed p-4 text-sm capitalize">
              {<ExampleText>{side}</ExampleText>}
            </ContextMenuTrigger>
            <ContextMenuContent side={side}>
              <ContextMenuGroup>
                <ContextMenuItem>{<ExampleText>Back</ExampleText>}</ContextMenuItem>
                <ContextMenuItem>{<ExampleText>Forward</ExampleText>}</ContextMenuItem>
                <ContextMenuItem>{<ExampleText>Reload</ExampleText>}</ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuContent>
          </ContextMenu>
        ))}</ExampleText>}
      </div>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
