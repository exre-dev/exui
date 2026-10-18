
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Bubble, BubbleContent } from "@exre/exui"
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@exre/exui"

/*
 * Hoisted because each person speaks twice. Repeating a 90-character URL per
 * turn is how a thread ends up rendering two crops of one face.
 */
const MICHAEL_AVATAR =
  "/examples/reui/photos/4349381d8a8476edbc.jpg"
const SARAH_AVATAR =
  "/examples/reui/photos/dfed3098ae0011e5a5.jpg"

/*
 * MessageAvatar is self-end, so the third message runs long on purpose: a
 * wrapped turn is the only state in which the bottom anchoring is visible.
 */
  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
      <Message>
        {/*
          MessageAvatar is a circular clip the size of the portrait, so a badge
          in its square corner loses half of itself. Badged rows opt out of it.
        */}
        <MessageAvatar className="overflow-visible">
          <Avatar>
            <AvatarImage src={MICHAEL_AVATAR} alt={copyExample("Michael Rodriguez")} />
            <AvatarFallback>{<ExampleText>MR</ExampleText>}</AvatarFallback>
            {/*
              Presence would be colour-only without the label, so the dot keeps
              its own sr-only text.
            */}
            <AvatarBadge className="bg-green-500">
              <span className="sr-only">{<ExampleText>Online</ExampleText>}</span>
            </AvatarBadge>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>
              {<ExampleText>eu-west checkout is timing out. It started around 14:05. </ExampleText>}</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>

      <Message align="end">
        <MessageAvatar>
          <Avatar>
            <AvatarImage src={SARAH_AVATAR} alt={copyExample("Sarah Chen")} />
            <AvatarFallback>{<ExampleText>SC</ExampleText>}</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble>
            <BubbleContent>
              {<ExampleText>Looking now. Is it every request or one route? </ExampleText>}</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>

      <Message>
        <MessageAvatar className="overflow-visible">
          <Avatar>
            <AvatarImage src={MICHAEL_AVATAR} alt={copyExample("Michael Rodriguez")} />
            <AvatarFallback>{<ExampleText>MR</ExampleText>}</AvatarFallback>
            <AvatarBadge className="bg-green-500">
              <span className="sr-only">{<ExampleText>Online</ExampleText>}</span>
            </AvatarBadge>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>
              {<ExampleText>Only POST /api/checkout/confirm. p95 went from 240ms to 3.1s and the error rate is sitting at 4.2 percent. Every other route in the region is flat. </ExampleText>}</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>

      <Message align="end">
        <MessageAvatar>
          <Avatar>
            <AvatarImage src={SARAH_AVATAR} alt={copyExample("Sarah Chen")} />
            <AvatarFallback>{<ExampleText>SC</ExampleText>}</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble>
            <BubbleContent>
              {<ExampleText>Pulling the traces for that window now. </ExampleText>}</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
