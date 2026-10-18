
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { HouseIcon, LayoutDashboardIcon, SettingsIcon } from "lucide-react"

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
          <BreadcrumbLink onClick={(event) => event.preventDefault()} href="#" className="flex items-center gap-1.5">
            <HouseIcon className="size-4" />
            {<ExampleText>Home </ExampleText>}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink onClick={(event) => event.preventDefault()} href="#" className="flex items-center gap-1.5">
            <LayoutDashboardIcon className="size-4" />
            {<ExampleText>Components </ExampleText>}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="flex items-center gap-1.5">
            <SettingsIcon className="size-4" />
            {<ExampleText>Settings </ExampleText>}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
