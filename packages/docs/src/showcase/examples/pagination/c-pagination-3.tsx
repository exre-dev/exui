"use client"


import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious aria-label={copyExample("Go to previous page")} text={copyExample("Previous")} onClick={(event) => event.preventDefault()} href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink onClick={(event) => event.preventDefault()}
            href="#"
            className="hover:border-border hover:border!"
          >
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink onClick={(event) => event.preventDefault()} href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink onClick={(event) => event.preventDefault()}
            href="#"
            className="hover:border-border hover:border!"
          >
            3
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext aria-label={copyExample("Go to next page")} text={copyExample("Next")} onClick={(event) => event.preventDefault()} href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
