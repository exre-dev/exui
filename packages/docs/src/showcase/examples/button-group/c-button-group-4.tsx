
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()
  return (
    <ButtonGroup>
      <Button variant="outline">{<ExampleText>Update</ExampleText>}</Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-label={copyExample("More options")} variant="outline" size="icon">
            <ChevronDownIcon aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem>{<ExampleText>Production</ExampleText>}</DropdownMenuItem>
          <DropdownMenuItem>{<ExampleText>Staging</ExampleText>}</DropdownMenuItem>
          <DropdownMenuItem>{<ExampleText>Development</ExampleText>}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
