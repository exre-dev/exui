
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  NativeSelect,
  NativeSelectOption,
} from "@exre/exui"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Pagination>
      <PaginationContent className="w-full justify-between">
        <PaginationItem>
          <span className="text-muted-foreground text-sm">
            {<ExampleText>Page </ExampleText>}<span className="text-foreground font-medium">1</span> {<ExampleText> of</ExampleText>}{<ExampleText>{" "}</ExampleText>}
            <span className="text-foreground font-medium">10</span>
          </span>
        </PaginationItem>
        <PaginationItem className="flex items-center gap-1">
          <PaginationPrevious aria-label={copyExample("Go to previous page")} text={copyExample("Previous")} onClick={(event) => event.preventDefault()} href="#" />
          <PaginationLink onClick={(event) => event.preventDefault()} href="#" isActive>
            1
          </PaginationLink>
          <PaginationLink onClick={(event) => event.preventDefault()} href="#">2</PaginationLink>
          <PaginationLink onClick={(event) => event.preventDefault()} href="#">3</PaginationLink>
          <PaginationLink onClick={(event) => event.preventDefault()} href="#">4</PaginationLink>
          <PaginationEllipsis />
          <PaginationNext aria-label={copyExample("Go to next page")} text={copyExample("Next")} onClick={(event) => event.preventDefault()} href="#" />
        </PaginationItem>
        <PaginationItem>
          <NativeSelect className="w-28">
            <NativeSelectOption value="10">{<ExampleText>10 / page</ExampleText>}</NativeSelectOption>
            <NativeSelectOption value="20">{<ExampleText>20 / page</ExampleText>}</NativeSelectOption>
            <NativeSelectOption value="50">{<ExampleText>50 / page</ExampleText>}</NativeSelectOption>
            <NativeSelectOption value="100">{<ExampleText>100 / page</ExampleText>}</NativeSelectOption>
          </NativeSelect>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
