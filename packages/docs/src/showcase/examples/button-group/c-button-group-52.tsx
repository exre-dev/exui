
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { FileTextIcon, ImageIcon, MoreHorizontalIcon, PencilIcon, RefreshCwIcon, Share2Icon } from "lucide-react"

import { Button } from "@exre/exui"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@exre/exui"


const icons = {
  refresh: (
    <RefreshCwIcon aria-hidden="true" />
  ),
  share: (
    <Share2Icon aria-hidden="true" />
  ),
  more: (
    <MoreHorizontalIcon aria-hidden="true" />
  ),
  pencil: (
    <PencilIcon aria-hidden="true" />
  ),
  fileText: (
    <FileTextIcon aria-hidden="true" />
  ),
  image: (
    <ImageIcon aria-hidden="true" />
  ),
}

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <ButtonGroup>
      <Button variant="outline" size="sm" aria-label={copyExample("Refresh")}>
        {<ExampleText>{icons.refresh}</ExampleText>}
      </Button>
      <Button variant="outline" size="sm">
        {<ExampleText>{icons.share}</ExampleText>}
        {<ExampleText>Share </ExampleText>}</Button>
      <ButtonGroupSeparator />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" aria-label={copyExample("More options")}>
            {<ExampleText>{icons.more}</ExampleText>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44" sideOffset={9}>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              {<ExampleText>{icons.pencil}</ExampleText>}
              {<ExampleText>Edit dashboard </ExampleText>}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {<ExampleText>{icons.fileText}</ExampleText>}
              {<ExampleText>Export CSV </ExampleText>}</DropdownMenuItem>
            <DropdownMenuItem>
              {<ExampleText>{icons.image}</ExampleText>}
              {<ExampleText>Export PNG </ExampleText>}</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
