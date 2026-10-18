
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
          <Alert
            variant="invert"
            className="grid-cols-[32px_1fr] gap-x-3 border-0 shadow-none"
          >
            <Avatar className="border-border/10 size-8 border">
              <AvatarImage
                src="/examples/reui/photos/dfed3098ae0011e5a5.jpg"
                alt={copyExample("Sarah Chen")}
              />
              <AvatarFallback>{<ExampleText>SC</ExampleText>}</AvatarFallback>
            </Avatar>
            <AlertTitle className="flex items-center gap-2">
              <span className="truncate">{<ExampleText>Sarah Chen</ExampleText>}</span>
              <span className="text-invert-foreground/60 truncate font-normal">
                {<ExampleText>mentioned you in a comment </ExampleText>}</span>
            </AlertTitle>
            <AlertAction>
              <ActionButton
                variant="outline"
                size="xs"
                className="bg-background/10 border-border/10"
              >
                {<ExampleText>Dismiss </ExampleText>}</ActionButton>
              <ActionButton
                size="xs"
                className="border-blue-800 bg-blue-500 text-white hover:border-blue-900 hover:bg-blue-600"
              >
                {<ExampleText>View </ExampleText>}</ActionButton>
            </AlertAction>
            <AlertDescription className="text-invert-foreground/70 line-clamp-1">
              {<ExampleText>"Great work on the user profile layout! I've added some suggestions for the avatar spacing." </ExampleText>}</AlertDescription>
          </Alert>
        </FramePanel>
      </Frame>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
