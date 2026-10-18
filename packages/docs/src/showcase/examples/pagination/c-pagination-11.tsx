
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Pagination>
      <PaginationContent className="rounded-md gap-0 overflow-hidden border">
        <PaginationItem>
          <PaginationLink onClick={(event) => event.preventDefault()}
            href="#"
            size="icon"
            aria-label={copyExample("Go to previous page")}
            className="border-border rounded-none border-0 border-e"
          >
            <ChevronLeftIcon  />
          </PaginationLink>
        </PaginationItem>

        {
          /* Page numbers */
          <ExampleText>{Array.from({ length: 4 }).map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink onClick={(event) => event.preventDefault()}
                href="#"
                isActive={index === 2}
                className="data-[active=true]:bg-muted border-border rounded-none border-0 border-e"
              >
                {<ExampleText>{index + 1}</ExampleText>}
              </PaginationLink>
            </PaginationItem>
          ))}</ExampleText>
        }

        <PaginationItem className="border-border border-0 border-e">
          <PaginationEllipsis />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink onClick={(event) => event.preventDefault()}
            href="#"
            size="icon"
            aria-label={copyExample("Go to next page")}
            className="rounded-none border-0"
          >
            <ChevronRightIcon  />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
