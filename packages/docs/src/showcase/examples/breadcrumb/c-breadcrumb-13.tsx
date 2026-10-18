
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@exre/exui"

const BulletSeparator = () => {
  return (
    <span className="bg-foreground/30 inline-flex h-0.5 w-2 shrink-0 rounded-full"></span>
  )
}

  function OriginalPattern() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink onClick={(event) => event.preventDefault()} href="#">{<ExampleText>Home</ExampleText>}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="flex items-center">
          <BulletSeparator />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink onClick={(event) => event.preventDefault()} href="#">{<ExampleText>Components</ExampleText>}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="flex items-center">
          <BulletSeparator />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>{<ExampleText>Breadcrumb</ExampleText>}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
