
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { SearchIcon } from "lucide-react"

import { Button } from "@exre/exui"
import { Kbd } from "@exre/exui"
import { Tooltip, TooltipContent, TooltipTrigger } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" aria-label={copyExample("Search")}>
            <SearchIcon  />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="flex items-center gap-3">
          {<ExampleText>Search </ExampleText>}<Kbd className="-mr-1">{<ExampleText>⌘K</ExampleText>}</Kbd>
        </TooltipContent>
      </Tooltip>
    </>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
