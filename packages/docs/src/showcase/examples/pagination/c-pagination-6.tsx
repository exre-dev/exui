
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Card, CardContent } from "@exre/exui"
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
    <Card className="p-2">
      <CardContent className="p-0">
        <Pagination>
          <PaginationContent>
            {/* Previous */}
            <PaginationItem>
              <PaginationLink onClick={(event) => event.preventDefault()}
                href="#"
                size="icon"
                aria-label={copyExample("Go to previous page")}
                className="hover:bg-muted h-8 w-8 rounded-full"
              >
                <ChevronLeftIcon className="size-4" />
              </PaginationLink>
            </PaginationItem>

            {<ExampleText>{[1, 2, 3].map((page) => (
              <PaginationItem key={page}>
                <PaginationLink onClick={(event) => event.preventDefault()}
                  href="#"
                  isActive={page === 1}
                  className={
                    page === 1
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "hover:bg-muted"
                  }
                >
                  {<ExampleText>{page}</ExampleText>}
                </PaginationLink>
              </PaginationItem>
            ))}</ExampleText>}

            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>

            {<ExampleText>{[10, 11, 12].map((page) => (
              <PaginationItem key={page}>
                <PaginationLink onClick={(event) => event.preventDefault()} href="#">{<ExampleText>{page}</ExampleText>}</PaginationLink>
              </PaginationItem>
            ))}</ExampleText>}

            {/* Next */}
            <PaginationItem>
              <PaginationLink onClick={(event) => event.preventDefault()}
                href="#"
                size="icon"
                aria-label={copyExample("Go to next page")}
                className="hover:bg-muted h-8 w-8 rounded-full"
              >
                <ChevronRightIcon className="size-4" />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
