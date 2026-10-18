
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { FileTextIcon } from "lucide-react"

import { Frame, FramePanel } from "@exre/exui"

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
    <Frame spacing="sm">
      <FramePanel>
        <Breadcrumb>
          <BreadcrumbList className="gap-3">
            <BreadcrumbItem>
              <BreadcrumbLink onClick={(event) => event.preventDefault()}
                href="#"
                className="text-foreground flex items-center gap-2"
              >
                <Avatar className="size-6">
                  <AvatarImage src="/examples/reui/photos/f02f62535eba25f674.png" />
                  <AvatarFallback>{<ExampleText>VC</ExampleText>}</AvatarFallback>
                </Avatar>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator className="text-muted-foreground/60">
              /
            </BreadcrumbSeparator>

            <BreadcrumbItem>
              <BreadcrumbLink onClick={(event) => event.preventDefault()} href="#" className="flex items-center gap-3">
                <Avatar className="size-6">
                  <AvatarImage
                    src="/examples/reui/photos/0a10b9bc070f3bdf60.jpg"
                    className="object-cover"
                  />
                  <AvatarFallback>{<ExampleText>MP</ExampleText>}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-foreground leading-tight font-medium">
                    {<ExampleText>shadcn </ExampleText>}</span>
                  <span className="text-muted-foreground leading-tight">
                    {<ExampleText>ui@shadcn.com </ExampleText>}</span>
                </div>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator className="text-muted-foreground/60">
              /
            </BreadcrumbSeparator>

            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-2.5">
                <span className="flex size-6 items-center justify-center rounded-md bg-sky-100 text-sky-500 dark:bg-sky-500/10 dark:text-sky-400">
                  <FileTextIcon className="size-3.5" />
                </span>
                <div className="flex flex-col">
                  <span className="text-foreground leading-tight font-medium">
                    {<ExampleText>Document </ExampleText>}</span>
                  <span className="text-muted-foreground flex items-center gap-1 leading-tight">
                    {<ExampleText>agents.md </ExampleText>}</span>
                </div>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </FramePanel>
    </Frame>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
