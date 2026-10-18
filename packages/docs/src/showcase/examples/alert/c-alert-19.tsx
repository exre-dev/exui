
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@exre/exui"
import { Frame, FramePanel } from "@exre/exui"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { ActionButton } from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="mx-auto mb-auto w-full max-w-lg">
      <Frame>
        <FramePanel className="overflow-hidden p-0!">
          <Alert className="grid-cols-[32px_1fr] gap-x-3 border-0 shadow-none">
            <Avatar className="size-8 border">
              <AvatarImage
                src="/examples/reui/photos/e93553df2422635515.jpg"
                alt={copyExample("Alex Johnson")}
              />
              <AvatarFallback>{<ExampleText>AJ</ExampleText>}</AvatarFallback>
            </Avatar>
            <AlertTitle className="flex items-center gap-2">
              <span className="truncate">{<ExampleText>Alex Johnson</ExampleText>}</span>
              <span className="text-muted-foreground truncate font-normal">
                {<ExampleText>sent you a message </ExampleText>}</span>
            </AlertTitle>
            <AlertAction>
              <ActionButton size="xs" variant="outline">
                {<ExampleText>View </ExampleText>}</ActionButton>
              <ActionButton size="xs">{<ExampleText>Reply</ExampleText>}</ActionButton>
            </AlertAction>
            <AlertDescription className="line-clamp-1">
              {<ExampleText>"Hey! I've finished the draft for the new design system. Let me know what you think when you have a moment." </ExampleText>}</AlertDescription>
          </Alert>
        </FramePanel>
      </Frame>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
