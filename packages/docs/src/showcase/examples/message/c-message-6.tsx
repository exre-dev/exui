
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Bubble, BubbleContent } from "@exre/exui"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageGroup,
  MessageHeader,
} from "@exre/exui"

/*
 * A run from one person gets one portrait, on the last row. The earlier rows
 * still render MessageAvatar, just empty: it keeps its minimum width and holds
 * the spine that the last row sits on. Dropping the slot knocks the run off it.
 */
  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
      {/*
        The gap inside a run belongs to MessageGroup and the gap between runs
        to this column, so the two can differ per style with nothing hardcoded.
      */}
      <MessageGroup>
        <Message>
          <MessageAvatar />
          <MessageContent>
            {/*
              Only the first row of a run carries a name. The rest inherit it,
              which is the whole reason to group them.
            */}
            <MessageHeader>{<ExampleText>Alex Johnson</ExampleText>}</MessageHeader>
            <Bubble variant="muted">
              <BubbleContent>
                {<ExampleText>I pulled the eu-west traces for 14:00 to 14:10. </ExampleText>}</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>

        <Message>
          <MessageAvatar />
          <MessageContent>
            <Bubble variant="muted">
              <BubbleContent>
                {<ExampleText>Every slow request goes through the tax service. </ExampleText>}</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>

        <Message>
          <MessageAvatar>
            <Avatar>
              <AvatarImage
                src="/examples/reui/photos/e93553df2422635515.jpg"
                alt={copyExample("Alex Johnson")}
              />
              <AvatarFallback>{<ExampleText>AJ</ExampleText>}</AvatarFallback>
            </Avatar>
          </MessageAvatar>
          <MessageContent>
            <Bubble variant="muted">
              <BubbleContent>
                {<ExampleText>It is a retry loop, not the database. Two retries at 400ms each. </ExampleText>}</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
      </MessageGroup>

      <Message align="end">
        <MessageAvatar>
          <Avatar>
            <AvatarImage
              src="/examples/reui/photos/046af0b7d159f9f4fd.jpg"
              alt={copyExample("Emma Wilson")}
            />
            <AvatarFallback>{<ExampleText>EW</ExampleText>}</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble>
            <BubbleContent>
              {<ExampleText>That lines up with the 14:04 deploy. Rolling the tax client back. </ExampleText>}</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
