
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ArrowUpDownIcon, CopyIcon, DownloadIcon, FilterIcon, MoreHorizontalIcon, SettingsIcon, Share2Icon } from "lucide-react"

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
  filter: (
    <FilterIcon aria-hidden="true" />
  ),
  sort: (
    <ArrowUpDownIcon aria-hidden="true" />
  ),
  more: (
    <MoreHorizontalIcon aria-hidden="true" />
  ),
  copy: (
    <CopyIcon aria-hidden="true" />
  ),
  share: (
    <Share2Icon aria-hidden="true" />
  ),
  download: (
    <DownloadIcon aria-hidden="true" />
  ),
  settings: (
    <SettingsIcon aria-hidden="true" />
  ),
}

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <ButtonGroup>
      <Button variant="outline" size="sm" aria-label={copyExample("Filter")}>
        {<ExampleText>{icons.filter}</ExampleText>}
      </Button>
      <Button variant="outline" size="sm" aria-label={copyExample("Sort")}>
        {<ExampleText>{icons.sort}</ExampleText>}
      </Button>
      <ButtonGroupSeparator />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" aria-label={copyExample("More options")}>
            {<ExampleText>{icons.more}</ExampleText>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8}>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              {<ExampleText>{icons.copy}</ExampleText>}
              {<ExampleText>Copy link </ExampleText>}</DropdownMenuItem>
            <DropdownMenuItem>
              {<ExampleText>{icons.share}</ExampleText>}
              {<ExampleText>Share </ExampleText>}</DropdownMenuItem>
            <DropdownMenuItem>
              {<ExampleText>{icons.download}</ExampleText>}
              {<ExampleText>Export </ExampleText>}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {<ExampleText>{icons.settings}</ExampleText>}
              {<ExampleText>Settings </ExampleText>}</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
