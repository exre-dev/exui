
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@exre/exui"


  function OriginalPattern() {
  return (
    <Pagination className="w-full max-w-xs">
      <PaginationContent className="w-full justify-between">
        <PaginationItem>
          <PaginationLink onClick={(event) => event.preventDefault()} href="#" size="default" className="gap-2">
            <ArrowLeftIcon className="size-4" />
            {<ExampleText>Previous </ExampleText>}</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink onClick={(event) => event.preventDefault()} href="#" size="default" className="gap-2">
            {<ExampleText>Next </ExampleText>}<ArrowRightIcon className="size-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
