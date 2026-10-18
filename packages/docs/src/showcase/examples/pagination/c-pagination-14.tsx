
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Input } from "@exre/exui"
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
      <PaginationContent className="w-full justify-between">
        <PaginationItem className="flex items-center gap-1">
          <PaginationLink onClick={(event) => event.preventDefault()} href="#" size="icon" aria-label={copyExample("Go to previous page")}>
            <ChevronLeftIcon className="size-4" />
          </PaginationLink>
          <PaginationLink onClick={(event) => event.preventDefault()} href="#" isActive>
            1
          </PaginationLink>
          <PaginationLink onClick={(event) => event.preventDefault()} href="#">2</PaginationLink>
          <PaginationLink onClick={(event) => event.preventDefault()} href="#">3</PaginationLink>
          <PaginationLink onClick={(event) => event.preventDefault()} href="#">4</PaginationLink>
          <PaginationEllipsis />
          <PaginationLink onClick={(event) => event.preventDefault()} href="#" size="icon" aria-label={copyExample("Go to next page")}>
            <ChevronRightIcon className="size-4" />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm whitespace-nowrap">
            {<ExampleText>Go to page </ExampleText>}</span>
          <Input
            type="number"
            min={1}
            max={10}
            defaultValue={1}
            className="h-9 w-16 text-center"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
