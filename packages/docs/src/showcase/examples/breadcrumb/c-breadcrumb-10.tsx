
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { HouseIcon } from "lucide-react"

import { Frame, FramePanel } from "@exre/exui"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@exre/exui"


  function OriginalPattern() {
  return (
    <Frame>
      <FramePanel className="gap-2 px-3! py-2!">
        <Breadcrumb>
          <BreadcrumbList>
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
      </FramePanel>
    </Frame>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
