
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronsRightIcon } from "lucide-react"

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
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink onClick={(event) => event.preventDefault()} href="#">{<ExampleText>Dashboard</ExampleText>}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronsRightIcon  />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink onClick={(event) => event.preventDefault()} href="#">{<ExampleText>Resources</ExampleText>}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronsRightIcon  />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>{<ExampleText>Documentation</ExampleText>}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
