
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { AlertTriangleIcon, CheckIcon, CopyIcon, EllipsisVerticalIcon, MessageCircleIcon, TrashIcon, UploadIcon, UserRoundXIcon, VolumeXIcon } from "lucide-react"

import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()
  return (
    <ButtonGroup>
      <Button variant="outline">
        <MessageCircleIcon aria-hidden="true" />
        <span>{<ExampleText>Conversation</ExampleText>}</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-label={copyExample("More conversation options")} variant="outline" size="icon">
            <EllipsisVerticalIcon aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <VolumeXIcon aria-hidden="true" />
              {<ExampleText>Mute Conversation </ExampleText>}</DropdownMenuItem>
            <DropdownMenuItem>
              <CheckIcon aria-hidden="true" />
              {<ExampleText>Mark as Read </ExampleText>}</DropdownMenuItem>
            <DropdownMenuItem>
              <AlertTriangleIcon aria-hidden="true" />
              {<ExampleText>Report Conversation </ExampleText>}</DropdownMenuItem>
            <DropdownMenuItem>
              <UserRoundXIcon aria-hidden="true" />
              {<ExampleText>Block User </ExampleText>}</DropdownMenuItem>
            <DropdownMenuItem>
              <UploadIcon aria-hidden="true" />
              {<ExampleText>Share Conversation </ExampleText>}</DropdownMenuItem>
            <DropdownMenuItem>
              <CopyIcon aria-hidden="true" />
              {<ExampleText>Copy Link </ExampleText>}</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">
              <TrashIcon aria-hidden="true" />
              {<ExampleText>Delete Conversation </ExampleText>}</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
