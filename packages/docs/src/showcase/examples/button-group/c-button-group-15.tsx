
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BellIcon, ChevronDownIcon, EyeIcon, FlagIcon, GitForkIcon, ListPlusIcon, Share2Icon, StarIcon } from "lucide-react"

import { Badge } from "@exre/exui"

import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@exre/exui"


  function OriginalPattern() {
  return (
    <ButtonGroup>
      <Button variant="outline">
        <StarIcon aria-hidden="true" />
        <span>{<ExampleText>Star</ExampleText>}</span>
        <Badge variant="secondary">{<ExampleText>2.4k</ExampleText>}</Badge>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <ChevronDownIcon aria-hidden="true" />
            <span className="sr-only">{<ExampleText>Toggle dropdown</ExampleText>}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          <DropdownMenuItem>
            <EyeIcon aria-hidden="true" />
            {<ExampleText>Watch </ExampleText>}</DropdownMenuItem>
          <DropdownMenuItem>
            <GitForkIcon aria-hidden="true" />
            {<ExampleText>Fork </ExampleText>}</DropdownMenuItem>
          <DropdownMenuItem>
            <ListPlusIcon aria-hidden="true" />
            {<ExampleText>Add to list </ExampleText>}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Share2Icon aria-hidden="true" />
            {<ExampleText>Share </ExampleText>}</DropdownMenuItem>
          <DropdownMenuItem>
            <BellIcon aria-hidden="true" />
            {<ExampleText>Notifications </ExampleText>}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <FlagIcon aria-hidden="true" />
            {<ExampleText>Report </ExampleText>}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
