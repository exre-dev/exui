
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ArchiveIcon, ArrowRightIcon, CopyIcon, EllipsisVerticalIcon, FolderIcon, LinkIcon, PencilIcon, Share2Icon, StarIcon, TrashIcon } from "lucide-react"

import { Button } from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-label={copyExample("More options")} variant="outline" size="icon">
            <EllipsisVerticalIcon aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>{<ExampleText>Actions</ExampleText>}</DropdownMenuLabel>
            <DropdownMenuItem>
              <PencilIcon aria-hidden="true" />
              {<ExampleText>Edit </ExampleText>}<DropdownMenuShortcut>{<ExampleText>⌘E</ExampleText>}</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CopyIcon aria-hidden="true" />
              {<ExampleText>Duplicate </ExampleText>}<DropdownMenuShortcut>{<ExampleText>⌘D</ExampleText>}</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <ArrowRightIcon aria-hidden="true" />
                {<ExampleText>Move to </ExampleText>}</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <FolderIcon aria-hidden="true" />
                    {<ExampleText>Projects </ExampleText>}</DropdownMenuItem>
                  <DropdownMenuItem>
                    <ArchiveIcon aria-hidden="true" />
                    {<ExampleText>Archive </ExampleText>}</DropdownMenuItem>
                  <DropdownMenuItem>
                    <StarIcon aria-hidden="true" />
                    {<ExampleText>Favorites </ExampleText>}</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Share2Icon aria-hidden="true" />
              {<ExampleText>Share </ExampleText>}</DropdownMenuItem>
            <DropdownMenuItem>
              <LinkIcon aria-hidden="true" />
              {<ExampleText>Copy Link </ExampleText>}</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <TrashIcon aria-hidden="true" />
            {<ExampleText>Delete </ExampleText>}<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
