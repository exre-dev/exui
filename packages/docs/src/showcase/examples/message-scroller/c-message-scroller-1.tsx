
import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { SparklesIcon } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Bubble, BubbleContent } from "@exre/exui"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@exre/exui"
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@exre/exui"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@exre/exui"


type Turn = {
  id: string
  role: "user" | "assistant"
  author: string
  text: string
}

const VIEWER_AVATAR =
  "/examples/reui/photos/e93553df2422635515.jpg"

/*
 * Ids are thread scoped and stable across renders. That is what lets a row be
 * addressed later by scrollToMessage, and what the prepend restore uses to keep
 * a specific row under the reader. Index keys would break both.
 */
const TURNS: Turn[] = [
  {
    id: "th_9f2k4m_1",
    role: "user",
    author: "Jonas Weber",
    text: "Our Stripe webhook is returning 500 on charge.refunded. It started at 09:42 and 41 events are queued behind it.",
  },
  {
    id: "th_9f2k4m_2",
    role: "assistant",
    author: "Nimbus",
    text: "The handler throws before it acknowledges, so Stripe keeps redelivering the same event.\n\nEvery retry lands on the same code path, which is why the queue grows instead of draining. No other event type on that endpoint is affected.",
  },
  {
    id: "th_9f2k4m_3",
    role: "user",
    author: "Jonas Weber",
    text: "What is actually throwing?",
  },
  {
    id: "th_9f2k4m_4",
    role: "assistant",
    author: "Nimbus",
    text: "The refund branch reads charge.payment_intent, and that field is null for refunds created in the dashboard.\n\nThe null reaches the lookup helper, which throws before the 200 goes out. Card refunds carry the intent, dashboard refunds do not, so it only fires for a subset.",
  },
  {
    id: "th_9f2k4m_5",
    role: "user",
    author: "Jonas Weber",
    text: "Can we drain the queue without shipping anything?",
  },
  {
    id: "th_9f2k4m_6",
    role: "assistant",
    author: "Nimbus",
    text: "Not safely. The queued events replay the same branch, so they would fail again and burn the retries you have left.\n\nShip the guard first, then replay. Stripe keeps failed events for three days, so the 41 are not at risk yet.",
  },
  {
    id: "th_9f2k4m_7",
    role: "user",
    author: "Jonas Weber",
    text: "Give me the smallest patch that unblocks it.",
  },
  {
    id: "th_9f2k4m_8",
    role: "assistant",
    author: "Nimbus",
    text: "Return 200 as soon as the signature verifies, then do the refund work on a queue. A webhook acknowledges receipt, not success.\n\nWith that in place a null payment_intent becomes a job that fails and retries on your side, instead of a 500 Stripe has to redeliver.",
  },
  {
    id: "th_9f2k4m_9",
    role: "assistant",
    author: "Nimbus",
    text: "I drafted the change on a branch and left the replay script beside it. Want me to open the pull request?",
  },
]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    /*
     * The scroller fills a height constrained parent, so the frame owns the
     * height and the transcript overflows inside it. Drop the fixed height and
     * the page becomes the scroll container, which is a different component.
     */
    <Card className="h-100 w-full max-w-2xl gap-0 overflow-hidden py-0">
      <CardHeader className="shrink-0 border-b py-4">
        <CardTitle>{<ExampleText>Stripe webhook 500s on charge.refunded</ExampleText>}</CardTitle>
        <CardDescription>{<ExampleText>th_9f2k4m, 9 messages</ExampleText>}</CardDescription>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 p-0">
        <MessageScrollerProvider>
          <MessageScroller>
            {/*
             * The viewport already ships role="region" and tabIndex 0, so the
             * transcript is keyboard scrollable with no prop of ours. The label
             * is the one default worth replacing per surface.
             */}
            <MessageScrollerViewport aria-label={copyExample("Webhook incident transcript")}>
              <MessageScrollerContent className="gap-5 p-(--card-spacing)">
                {<ExampleText>{TURNS.map((turn) => {
                  const isUser = turn.role === "user"

                  return (
                    /*
                     * scrollAnchor marks the row that starts an exchange. It is
                     * what last-anchor opening and the previous item peek read,
                     * so it goes on the question, never on the answer.
                     */
                    <ExampleRuntimeConsumer key={turn.id} render={({copy: copyExample}) => (<MessageScrollerItem
                      key={turn.id}
                      messageId={turn.id}
                      scrollAnchor={isUser}
                    >
                      <Message align={isUser ? "end" : "start"}>
                        <MessageAvatar className="size-8">
                          {<ExampleText>{isUser ? (
                            <Avatar>
                              <AvatarImage
                                src={VIEWER_AVATAR}
                                alt={copyExample(turn.author)}
                              />
                              <AvatarFallback>{<ExampleText>JW</ExampleText>}</AvatarFallback>
                            </Avatar>
                          ) : (
                            <>
                              <SparklesIcon aria-hidden="true" className="text-muted-foreground size-4" />
                              <span className="sr-only">{<ExampleText>{turn.author}</ExampleText>}</span>
                            </>
                          )}</ExampleText>}
                        </MessageAvatar>
                        <MessageContent>
                          <Bubble
                            variant={isUser ? "muted" : "ghost"}
                            align={isUser ? "end" : "start"}
                          >
                            <BubbleContent className="space-y-2">
                              {<ExampleText>{turn.text
                                .split("\n\n")
                                .map((paragraph, index) => (
                                  <p
                                    key={index}
                                    className="whitespace-pre-wrap"
                                  >
                                    {<ExampleText>{paragraph}</ExampleText>}
                                  </p>
                                ))}</ExampleText>}
                            </BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>)} />
                  )
                })}</ExampleText>}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            {/*
             * A sibling of the viewport, never a child of it: the root is the
             * positioning context, so inside the viewport the control would
             * scroll away with the messages.
             */}
            <MessageScrollerButton
              variant="outline"
              className="rounded-full shadow-sm"
            />
          </MessageScroller>
        </MessageScrollerProvider>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "26.25rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
