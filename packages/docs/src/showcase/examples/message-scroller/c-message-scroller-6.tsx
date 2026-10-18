"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronDownIcon, ChevronUpIcon, SparklesIcon } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Bubble, BubbleContent } from "@exre/exui"
import { Button } from "@exre/exui"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  useMessageScroller,
  useMessageScrollerVisibility,
} from "@exre/exui"


type Turn = {
  id: string
  role: "user" | "assistant"
  author: string
  text: string
}

const VIEWER_AVATAR =
  "/examples/reui/photos/e93553df2422635515.jpg"

const TURNS: Turn[] = [
  {
    id: "th_8n4d7s_q1",
    role: "user",
    author: "Jonas Weber",
    text: "Walk me through the export incident from Friday.",
  },
  {
    id: "th_8n4d7s_2",
    role: "assistant",
    author: "Nimbus",
    text: "It ran from 09:42 to 11:06. One workspace saw empty exports and nobody saw an error.\n\nThe trigger was a saved view whose date range excluded everything recent, and an export inherits the active view.",
  },
  {
    id: "th_8n4d7s_3",
    role: "assistant",
    author: "Nimbus",
    text: "No data was lost, and no other workspace was affected.",
  },
  {
    id: "th_8n4d7s_q2",
    role: "user",
    author: "Jonas Weber",
    text: "Why did it take 84 minutes to find?",
  },
  {
    id: "th_8n4d7s_5",
    role: "assistant",
    author: "Nimbus",
    text: "Because every signal read healthy. The jobs completed, the queue drained, and the error rate never moved.\n\nWe found it when support tied the ticket to the view change, not from an alert.",
  },
  {
    id: "th_8n4d7s_q3",
    role: "user",
    author: "Jonas Weber",
    text: "What would have caught it sooner?",
  },
  {
    id: "th_8n4d7s_7",
    role: "assistant",
    author: "Nimbus",
    text: "A zero row export from a workspace that exported thousands the day before. That is the signal we do not have yet.\n\nIt is cheap to add, because the job already records the row count it wrote.",
  },
  {
    id: "th_8n4d7s_8",
    role: "assistant",
    author: "Nimbus",
    text: "I drafted the threshold as a ratio rather than an absolute, so a genuinely small workspace never pages anyone.",
  },
  {
    id: "th_8n4d7s_q4",
    role: "user",
    author: "Jonas Weber",
    text: "Is the dialog change still the right fix?",
  },
  {
    id: "th_8n4d7s_10",
    role: "assistant",
    author: "Nimbus",
    text: "Yes, and it stands on its own next to the alert. The dialog renders its row count after the request, so a zero currently reads as loading.\n\nShowing the active filter with a settled count turns a silent wrong answer into an obvious one.",
  },
  {
    id: "th_8n4d7s_q5",
    role: "user",
    author: "Jonas Weber",
    text: "Write it up for the review on Thursday.",
  },
  {
    id: "th_8n4d7s_12",
    role: "assistant",
    author: "Nimbus",
    text: "Written. Timeline, contributing factors, and the two actions with owners and dates.\n\nI kept the blameless framing and moved the raw timeline into an appendix, so the meeting can stay on the actions.",
  },
]

/*
 * The navigator addresses rows by messageId, and only a row that carries one is
 * registered with scrollToMessage. Anchoring and prepend detection work without
 * an id, jumping does not.
 */
const QUESTIONS = TURNS.filter((turn) => turn.role === "user")

function TurnNavigator() {
  const { copy: copyExample } = useExampleRuntime()

  const { scrollToMessage } = useMessageScroller()
  const { currentAnchorId } = useMessageScrollerVisibility()

  /*
   * The position is derived during render from the reported anchor. Mirroring
   * it into state would need an effect, and that effect would fight every
   * smooth scroll it started.
   */
  const index = Math.max(
    0,
    QUESTIONS.findIndex((question) => question.id === currentAnchorId)
  )
  const current = QUESTIONS[index]

  /*
   * align start puts the question at the top of the viewport with the
   * provider's scroll margin above it, so a jump lands on the question and the
   * answer under it rather than halfway through the turn before.
   */
  function goTo(nextIndex: number) {
    const target = QUESTIONS[nextIndex]
    if (!target) return
    scrollToMessage(target.id, { align: "start", behavior: "smooth" })
  }

  return (
    <div className="flex w-full min-w-0 items-center gap-2">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={copyExample("Previous turn")}
        disabled={index <= 0}
        onClick={() => goTo(index - 1)}
      >
        <ChevronUpIcon aria-hidden="true" />
      </Button>
      <span className="text-muted-foreground min-w-0 flex-1 truncate text-center text-sm">
        <span className="text-foreground font-medium">
          {<ExampleText>Turn </ExampleText>}{<ExampleText>{index + 1}</ExampleText>} {<ExampleText> of </ExampleText>}{<ExampleText>{QUESTIONS.length}</ExampleText>}
        </span>{<ExampleText>{" "}</ExampleText>}
        {<ExampleText>{current.text}</ExampleText>}
      </span>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={copyExample("Next turn")}
        disabled={index >= QUESTIONS.length - 1}
        onClick={() => goTo(index + 1)}
      >
        <ChevronDownIcon aria-hidden="true" />
      </Button>
    </div>
  )
}

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    /*
     * The frame owns the height, and the Provider wraps the whole card body so
     * the footer can read and drive the transcript while sitting outside the
     * scroll region.
     */
    <Card className="h-115 w-full max-w-2xl gap-0 overflow-hidden py-0">
      <MessageScrollerProvider scrollMargin={12}>
        <CardHeader className="shrink-0 border-b py-4">
          <CardTitle>{<ExampleText>Export incident review</ExampleText>}</CardTitle>
          <CardDescription>{<ExampleText>5 questions, 12 messages</ExampleText>}</CardDescription>
        </CardHeader>
        <CardContent className="min-h-0 flex-1 p-0">
          <MessageScroller>
            <MessageScrollerViewport aria-label={copyExample("Incident review transcript")}>
              <MessageScrollerContent className="gap-5 p-(--card-spacing)">
                {<ExampleText>{TURNS.map((turn) => {
                  const isUser = turn.role === "user"

                  return (
                    /*
                     * Only the questions carry an anchor, so the reported
                     * anchor stays on a turn after it scrolls above the fold.
                     * That is what makes it answer where the reader is rather
                     * than what happens to be on screen.
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
            <MessageScrollerButton
              variant="outline"
              className="rounded-full shadow-sm"
            />
          </MessageScroller>
        </CardContent>
        <CardFooter className="shrink-0 border-t py-4">
          {/*
           * Visibility tracking only runs while something subscribes to it, so
           * a transcript without a navigator pays nothing for the observer this
           * footer turns on.
           */}
          <TurnNavigator />
        </CardFooter>
      </MessageScrollerProvider>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "30rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
