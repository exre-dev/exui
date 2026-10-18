
import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ArchiveIcon, CalendarIcon, ChevronDownIcon, CopyIcon, EyeIcon, FileIcon, HistoryIcon, MoreHorizontalIcon, SendIcon, TrashIcon } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@exre/exui"
import { Button } from "@exre/exui"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@exre/exui"
import { Separator } from "@exre/exui"


const viewers = [
  {
    src: "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
    initials: "SC",
    name: "Sarah Chen",
  },
  {
    src: "/examples/reui/photos/e93553df2422635515.jpg",
    initials: "AJ",
    name: "Alex Johnson",
  },
]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex shrink-0 items-center gap-2">
      <AvatarGroup>
        {<ExampleText>{viewers.map((viewer) => (
          <ExampleRuntimeConsumer key={viewer.name} render={({copy: copyExample}) => (<Avatar key={viewer.name} size="sm">
            <AvatarImage src={viewer.src} alt={copyExample(viewer.name)} />
            <AvatarFallback>{<ExampleText>{viewer.initials}</ExampleText>}</AvatarFallback>
          </Avatar>)} />
        ))}</ExampleText>}
      </AvatarGroup>

      <Separator orientation="vertical" className="my-auto h-4" />

      <Button variant="outline" size="sm">
        <EyeIcon aria-hidden="true" />
        <span className="hidden md:block">{<ExampleText>Preview</ExampleText>}</span>
      </Button>

      <ButtonGroup className="**:data-[slot=button]:border-r-0">
        <Button size="sm">
          <SendIcon aria-hidden="true" />
          {<ExampleText>Publish </ExampleText>}</Button>

        <ButtonGroupSeparator className="bg-primary/72" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon-sm"
              className="border-primary-foreground/20 rounded-l-none border-l"
              aria-label={copyExample("More publish options")}
            >
              <ChevronDownIcon aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent sideOffset={8} align="end" className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <CalendarIcon className="size-4 opacity-60" aria-hidden="true" />
                {<ExampleText>Schedule for later </ExampleText>}</DropdownMenuItem>
              <DropdownMenuItem>
                <FileIcon className="size-4 opacity-60" aria-hidden="true" />
                {<ExampleText>Save as draft </ExampleText>}</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={copyExample("More actions")}>
            <MoreHorizontalIcon aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent sideOffset={8} align="end" className="w-40">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <CopyIcon className="size-4 opacity-60" aria-hidden="true" />
              {<ExampleText>Duplicate </ExampleText>}</DropdownMenuItem>
            <DropdownMenuItem>
              <HistoryIcon className="size-4 opacity-60" aria-hidden="true" />
              {<ExampleText>View history </ExampleText>}</DropdownMenuItem>
            <DropdownMenuItem>
              <ArchiveIcon className="size-4 opacity-60" aria-hidden="true" />
              {<ExampleText>Archive </ExampleText>}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <TrashIcon aria-hidden="true" />
              {<ExampleText>Delete </ExampleText>}</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
