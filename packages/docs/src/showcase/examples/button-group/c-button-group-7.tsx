
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon, ChevronDownIcon, ExternalLinkIcon, GitBranchIcon, GitMergeIcon, RefreshCwIcon } from "lucide-react"

import { Button } from "@exre/exui"
import {
  ButtonGroup,
  ButtonGroupText,
} from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()
  return (
    <ButtonGroup>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <GitMergeIcon aria-hidden="true" />
            <span>{<ExampleText>main</ExampleText>}</span>
            <ChevronDownIcon aria-hidden="true" className="size-3.5 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuLabel>{<ExampleText>Switch Branch</ExampleText>}</DropdownMenuLabel>
            <DropdownMenuItem>
              <GitBranchIcon aria-hidden="true" />
              <span>{<ExampleText>main</ExampleText>}</span>
              <CheckIcon aria-hidden="true" className="text-primary ml-auto size-3.5" />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <GitBranchIcon aria-hidden="true" />
              <span>{<ExampleText>develop</ExampleText>}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <GitBranchIcon aria-hidden="true" />
              <span>{<ExampleText>feature/auth</ExampleText>}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ButtonGroupText className="bg-transparent">
        <div className="size-1.5 animate-pulse rounded-full bg-green-600" />
        <span>{<ExampleText>Production</ExampleText>}</span>
      </ButtonGroupText>

      <Button aria-label={copyExample("Refresh")} variant="outline" size="icon">
        <RefreshCwIcon aria-hidden="true" />
      </Button>

      <Button aria-label={copyExample("Open external link")} variant="outline" size="icon">
        <ExternalLinkIcon aria-hidden="true" />
      </Button>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
