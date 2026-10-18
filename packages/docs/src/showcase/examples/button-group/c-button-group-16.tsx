
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronDownIcon, ListFilterIcon, XIcon } from "lucide-react"

import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@exre/exui"
import { Input } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <ButtonGroup className="max-w-xs">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" aria-label={copyExample("Filter")}>
            <ListFilterIcon aria-hidden="true" />
            {<ExampleText>Filter </ExampleText>}<ChevronDownIcon aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          <DropdownMenuItem>{<ExampleText>All Records</ExampleText>}</DropdownMenuItem>
          <DropdownMenuItem>{<ExampleText>Recent</ExampleText>}</DropdownMenuItem>
          <DropdownMenuItem>{<ExampleText>Archived</ExampleText>}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Input placeholder={copyExample("Filter records...")} />
      <Button aria-label={copyExample("Clear filter")} variant="outline" size="icon">
        <XIcon aria-hidden="true" />
      </Button>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
