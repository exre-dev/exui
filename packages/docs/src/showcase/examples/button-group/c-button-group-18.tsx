
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronDownIcon, PlayIcon } from "lucide-react"

import { Button } from "@exre/exui"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()
  return (
    <ButtonGroup className="**:data-[slot=button]:border-r-0">
      <Button>
        <PlayIcon aria-hidden="true" className="fill-current" />
        <span>{<ExampleText>Execute</ExampleText>}</span>
      </Button>
      <ButtonGroupSeparator className="bg-primary/72" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-label={copyExample("More execute options")}
            size="icon"
            className="border-primary-foreground/20 rounded-l-none border-l"
          >
            <ChevronDownIcon aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem>{<ExampleText>Commit &amp; Push</ExampleText>}</DropdownMenuItem>
          <DropdownMenuItem>{<ExampleText>Commit &amp; Sync</ExampleText>}</DropdownMenuItem>
          <DropdownMenuItem>{<ExampleText>Amend Last Commit</ExampleText>}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
