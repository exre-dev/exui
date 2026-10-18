
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
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
          <BreadcrumbLink onClick={(event) => event.preventDefault()} href="#" className="flex items-center gap-2">
            <Avatar className="size-5 rounded-sm">
              <AvatarImage src="/examples/reui/photos/f02f62535eba25f674.png" />
              <AvatarFallback>{<ExampleText>VC</ExampleText>}</AvatarFallback>
            </Avatar>
            {<ExampleText>Vercel </ExampleText>}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink onClick={(event) => event.preventDefault()} href="#" className="flex items-center gap-2">
            <Avatar className="size-5">
              <AvatarImage src="/examples/reui/photos/0a10b9bc070f3bdf60.jpg" />
              <AvatarFallback>{<ExampleText>CN</ExampleText>}</AvatarFallback>
            </Avatar>
            {<ExampleText>@shadcn </ExampleText>}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{<ExampleText>Projects</ExampleText>}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
