
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import {
  NativeSelect,
  NativeSelectOption,
} from "@exre/exui"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Pagination>
      <PaginationContent className="w-full justify-between">
        <PaginationItem className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm whitespace-nowrap">
            {<ExampleText>Rows per page </ExampleText>}</span>
          <NativeSelect className="w-18" defaultValue="25">
            <NativeSelectOption value="10">10</NativeSelectOption>
            <NativeSelectOption value="25">25</NativeSelectOption>
            <NativeSelectOption value="50">50</NativeSelectOption>
            <NativeSelectOption value="100">100</NativeSelectOption>
          </NativeSelect>
        </PaginationItem>
        <PaginationItem className="flex items-center gap-3">
          <span className="text-muted-foreground text-sm whitespace-nowrap">
            {<ExampleText>1-25 of 100 </ExampleText>}</span>
          <div className="flex gap-1">
            <PaginationLink onClick={(event) => event.preventDefault()} href="#" size="icon" aria-label={copyExample("Go to first page")}>
              <ChevronFirstIcon className="size-4" />
            </PaginationLink>
            <PaginationLink onClick={(event) => event.preventDefault()}
              href="#"
              size="icon"
              aria-label={copyExample("Go to previous page")}
            >
              <ChevronLeftIcon className="size-4" />
            </PaginationLink>
            <PaginationLink onClick={(event) => event.preventDefault()} href="#" size="icon" aria-label={copyExample("Go to next page")}>
              <ChevronRightIcon className="size-4" />
            </PaginationLink>
            <PaginationLink onClick={(event) => event.preventDefault()} href="#" size="icon" aria-label={copyExample("Go to last page")}>
              <ChevronLastIcon className="size-4" />
            </PaginationLink>
          </div>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
