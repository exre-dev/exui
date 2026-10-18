
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
      <PaginationContent>
        <PaginationItem>
          <PaginationLink onClick={(event) => event.preventDefault()} href="#" size="icon" aria-label={copyExample("Go to first page")}>
            <ChevronFirstIcon className="size-4" />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink onClick={(event) => event.preventDefault()} href="#" size="icon" aria-label={copyExample("Go to previous page")}>
            <ChevronLeftIcon className="size-4" />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <NativeSelect className="w-26" defaultValue="1">
            <NativeSelectOption value="1">{<ExampleText>Page 1</ExampleText>}</NativeSelectOption>
            <NativeSelectOption value="2">{<ExampleText>Page 2</ExampleText>}</NativeSelectOption>
            <NativeSelectOption value="3">{<ExampleText>Page 3</ExampleText>}</NativeSelectOption>
            <NativeSelectOption value="4">{<ExampleText>Page 4</ExampleText>}</NativeSelectOption>
            <NativeSelectOption value="5">{<ExampleText>Page 5</ExampleText>}</NativeSelectOption>
            <NativeSelectOption value="6">{<ExampleText>Page 6</ExampleText>}</NativeSelectOption>
            <NativeSelectOption value="7">{<ExampleText>Page 7</ExampleText>}</NativeSelectOption>
            <NativeSelectOption value="8">{<ExampleText>Page 8</ExampleText>}</NativeSelectOption>
            <NativeSelectOption value="9">{<ExampleText>Page 9</ExampleText>}</NativeSelectOption>
            <NativeSelectOption value="10">{<ExampleText>Page 10</ExampleText>}</NativeSelectOption>
          </NativeSelect>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink onClick={(event) => event.preventDefault()} href="#" size="icon" aria-label={copyExample("Go to next page")}>
            <ChevronRightIcon className="size-4" />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink onClick={(event) => event.preventDefault()} href="#" size="icon" aria-label={copyExample("Go to last page")}>
            <ChevronLastIcon className="size-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
