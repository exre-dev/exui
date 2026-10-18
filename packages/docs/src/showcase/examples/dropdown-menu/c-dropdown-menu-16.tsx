
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { MoreHorizontalIcon, SettingsIcon, Share2Icon, TrashIcon } from "lucide-react"

import { Button } from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@exre/exui"


const icons = {
  more: (
    <MoreHorizontalIcon aria-hidden="true" />
  ),
  settings: (
    <SettingsIcon aria-hidden="true" />
  ),
  share: (
    <Share2Icon aria-hidden="true" />
  ),
  trash: (
    <TrashIcon aria-hidden="true" />
  ),
}

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="-me-1.5"
          aria-label={copyExample("More options")}
        >
          {<ExampleText>{icons.more}</ExampleText>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-36">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            {<ExampleText>{icons.settings}</ExampleText>}
            {<ExampleText>Settings </ExampleText>}</DropdownMenuItem>
          <DropdownMenuItem>
            {<ExampleText>{icons.share}</ExampleText>}
            {<ExampleText>Share </ExampleText>}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            {<ExampleText>{icons.trash}</ExampleText>}
            {<ExampleText>Remove </ExampleText>}</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
