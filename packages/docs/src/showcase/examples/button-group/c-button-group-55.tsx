
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CalendarIcon, CheckIcon, ChevronDownIcon, CreditCardIcon, FileTextIcon, XIcon } from "lucide-react"

import { Button } from "@exre/exui"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@exre/exui"
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
    <div className="flex flex-wrap items-center gap-2">
      <ButtonGroup>
        <ButtonGroupText className="border-input bg-muted/40 text-muted-foreground gap-1.5 border px-2.5 text-xs">
          <CreditCardIcon className="size-3.5 opacity-60" aria-hidden="true" />
          <span className="text-foreground font-medium tabular-nums">
            {<ExampleText>USD 12,480 </ExampleText>}</span>
        </ButtonGroupText>
        <Button variant="outline" size="sm">
          {<ExampleText>Hold </ExampleText>}</Button>
      </ButtonGroup>

      <ButtonGroup className="**:data-[slot=button]:border-r-0">
        <Button size="sm">
          <CheckIcon aria-hidden="true" />
          {<ExampleText>Release </ExampleText>}</Button>
        <ButtonGroupSeparator className="bg-primary/72" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon-sm"
              className="border-primary-foreground/20 rounded-l-none border-l"
              aria-label={copyExample("More payout actions")}
            >
              <ChevronDownIcon aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="w-44">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <CalendarIcon className="size-4 opacity-60" aria-hidden="true" />
                {<ExampleText>Schedule for Friday </ExampleText>}</DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon className="size-4 opacity-60" aria-hidden="true" />
                {<ExampleText>Change destination </ExampleText>}</DropdownMenuItem>
              <DropdownMenuItem>
                <FileTextIcon className="size-4 opacity-60" aria-hidden="true" />
                {<ExampleText>Export receipt </ExampleText>}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <XIcon aria-hidden="true" />
                {<ExampleText>Cancel payout </ExampleText>}</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
