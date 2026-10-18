
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { HouseIcon } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@exre/exui"
import { Card, CardContent } from "@exre/exui"


  function OriginalPattern() {
  return (
    <Card className="p-2">
      <CardContent className="px-1 py-0">
        <Breadcrumb>
          <BreadcrumbList className="gap-1.5 sm:gap-1.5">
            <BreadcrumbItem>
              <BreadcrumbLink onClick={(event) => event.preventDefault()} href="#" className="flex items-center gap-1.5">
                <HouseIcon className="size-4" aria-hidden="true" />
                {<ExampleText>Home </ExampleText>}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink onClick={(event) => event.preventDefault()} href="#">{<ExampleText>Products</ExampleText>}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold">
                {<ExampleText>Checkout </ExampleText>}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
