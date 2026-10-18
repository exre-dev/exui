
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Pagination className="w-full max-w-xs">
      <PaginationContent className="w-full justify-between">
        <PaginationItem>
          <span className="text-muted-foreground text-xs">
            {<ExampleText>Page </ExampleText>}<span className="text-foreground font-medium">1</span> {<ExampleText> of</ExampleText>}{<ExampleText>{" "}</ExampleText>}
            <span className="text-foreground font-medium">10</span>
          </span>
        </PaginationItem>
        <PaginationItem className="flex gap-1">
          <PaginationPrevious aria-label={copyExample("Go to previous page")} text={copyExample("Previous")} onClick={(event) => event.preventDefault()} href="#" />
          <PaginationNext aria-label={copyExample("Go to next page")} text={copyExample("Next")} onClick={(event) => event.preventDefault()} href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
