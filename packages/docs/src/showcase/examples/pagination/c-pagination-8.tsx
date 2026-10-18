
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Pagination className="w-full max-w-xs">
      <PaginationContent className="w-full justify-between">
        <PaginationItem>
          <PaginationLink onClick={(event) => event.preventDefault()} href="#" size="icon" aria-label={copyExample("Go to previous page")}>
            <ChevronLeftIcon className="size-4" />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <span className="text-muted-foreground text-xs">
            {<ExampleText>Page </ExampleText>}<span className="text-foreground font-medium">1</span> {<ExampleText> of</ExampleText>}{<ExampleText>{" "}</ExampleText>}
            <span className="text-foreground font-medium">10</span>
          </span>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink onClick={(event) => event.preventDefault()} href="#" size="icon" aria-label={copyExample("Go to next page")}>
            <ChevronRightIcon className="size-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
