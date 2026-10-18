
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { FileSpreadsheetIcon, FileTextIcon, ImageIcon, LinkIcon, MailIcon, MessageCircleIcon, PrinterIcon, Share2Icon } from "lucide-react"

import { Button } from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@exre/exui"


  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-fit gap-2">
            <Share2Icon aria-hidden="true" />
            {<ExampleText>Share </ExampleText>}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="start">
          <DropdownMenuGroup>
            <DropdownMenuLabel>{<ExampleText>Share via</ExampleText>}</DropdownMenuLabel>
            <DropdownMenuItem>
              <MailIcon aria-hidden="true" />
              {<ExampleText>Email </ExampleText>}</DropdownMenuItem>
            <DropdownMenuItem>
              <MessageCircleIcon aria-hidden="true" />
              {<ExampleText>Message </ExampleText>}</DropdownMenuItem>
            <DropdownMenuItem>
              <LinkIcon aria-hidden="true" />
              {<ExampleText>Copy Link </ExampleText>}</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>{<ExampleText>Export as</ExampleText>}</DropdownMenuLabel>
            <DropdownMenuItem>
              <FileTextIcon aria-hidden="true" />
              {<ExampleText>PDF </ExampleText>}</DropdownMenuItem>
            <DropdownMenuItem>
              <FileSpreadsheetIcon aria-hidden="true" />
              {<ExampleText>CSV </ExampleText>}</DropdownMenuItem>
            <DropdownMenuItem>
              <ImageIcon aria-hidden="true" />
              {<ExampleText>PNG </ExampleText>}</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <PrinterIcon aria-hidden="true" />
            {<ExampleText>Print </ExampleText>}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
