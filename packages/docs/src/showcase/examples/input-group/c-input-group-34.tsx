
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { AppWindowIcon, AudioLinesIcon, BookOpenIcon, BrainIcon, GlobeIcon, ImageIcon, LayoutDashboardIcon, MicIcon, PaperclipIcon, PlusIcon, SearchIcon, ShoppingBagIcon, SparklesIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@exre/exui"
import { Field } from "@exre/exui"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-3xl">
      <InputGroup className="bg-background rounded-full h-14 border p-1.5">
        <InputGroupAddon className="border-none pl-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton aria-label={copyExample("Add")}
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-foreground rounded-full size-10"
              >
                <PlusIcon className="size-6" />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="start"
              sideOffset={12}
              className="w-56"
            >
              <DropdownMenuItem>
                <PaperclipIcon  />
                <span>{<ExampleText>Add photos &amp; files</ExampleText>}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="-mx-3" />
              <DropdownMenuItem>
                <ImageIcon  />
                <span>{<ExampleText>Create image</ExampleText>}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BrainIcon  />
                <span>{<ExampleText>Thinking</ExampleText>}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SearchIcon  />
                <span>{<ExampleText>Deep research</ExampleText>}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ShoppingBagIcon  />
                <span>{<ExampleText>Shopping research</ExampleText>}</span>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <SparklesIcon  />
                  <span>{<ExampleText>More</ExampleText>}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-44">
                  <DropdownMenuItem>
                    <BookOpenIcon  />
                    <span>{<ExampleText>Study and learn</ExampleText>}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <GlobeIcon  />
                    <span>{<ExampleText>Web search</ExampleText>}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LayoutDashboardIcon  />
                    <span>{<ExampleText>Canvas</ExampleText>}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <AppWindowIcon  />
                    <span>{<ExampleText>Explore apps</ExampleText>}</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>

        <InputGroupInput
          placeholder={copyExample("Ask anything")}
          className="placeholder:text-muted-foreground/70 border-none px-2 text-lg shadow-none focus-visible:ring-0"
        />

        <InputGroupAddon align="inline-end" className="gap-2 border-none pr-1">
          <InputGroupButton aria-label={copyExample("Voice input")}
            variant="ghost"
            className="text-muted-foreground hover:text-foreground rounded-full size-11"
          >
            <MicIcon className="size-5" />
          </InputGroupButton>
          <InputGroupButton aria-label={copyExample("Voice mode")}
            variant="default"
            className="rounded-full size-11 bg-black text-white hover:bg-black/90"
          >
            <AudioLinesIcon className="size-5" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
