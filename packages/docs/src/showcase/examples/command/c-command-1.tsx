
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CalculatorIcon, CalendarIcon, CreditCardIcon, SettingsIcon, SmileIcon, UserIcon } from "lucide-react"

import { Card, CardContent } from "@exre/exui"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Card className="w-full max-w-xs p-0">
      <CardContent className="p-0">
        <Command className="**:data-[selected=true]:bg-muted **:data-selected:bg-transparent">
          <CommandInput placeholder={copyExample("Type a command or search...")} />
          <CommandList>
            <CommandEmpty>{<ExampleText>No results found.</ExampleText>}</CommandEmpty>
            <CommandGroup heading={copyExample("Suggestions")}>
              <CommandItem>
                <CalendarIcon  />
                <span>{<ExampleText>Calendar</ExampleText>}</span>
              </CommandItem>
              <CommandItem>
                <SmileIcon  />
                <span>{<ExampleText>Search Emoji</ExampleText>}</span>
              </CommandItem>
              <CommandItem disabled>
                <CalculatorIcon  />
                <span>{<ExampleText>Calculator</ExampleText>}</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading={copyExample("Settings")}>
              <CommandItem>
                <UserIcon  />
                <span>{<ExampleText>Profile</ExampleText>}</span>
                <CommandShortcut>{<ExampleText>⌘P</ExampleText>}</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <CreditCardIcon  />
                <span>{<ExampleText>Billing</ExampleText>}</span>
                <CommandShortcut>{<ExampleText>⌘B</ExampleText>}</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <SettingsIcon  />
                <span>{<ExampleText>Settings</ExampleText>}</span>
                <CommandShortcut>{<ExampleText>⌘S</ExampleText>}</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
