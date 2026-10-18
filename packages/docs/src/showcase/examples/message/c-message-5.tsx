
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { DownloadIcon, FileSpreadsheetIcon } from "lucide-react"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@exre/exui"
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
} from "@exre/exui"


/*
 * Requested at 448 square because the image variant crops to a square anyway.
 * A wide frame would pay for bytes that never reach a pixel.
 */
const HERO_ARTWORK =
  "/examples/reui/photos/3acf433051cfc0ba51.jpg"

/*
 * An Attachment is a first-class child of MessageContent. It brings its own
 * border and per-style radius, and an end-aligned row pulls it to the end as
 * it pulls the bubble, so there is no panel to hand-roll.
 */
  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
      <Message align="end">
        <MessageAvatar>
          <Avatar>
            <AvatarImage
              src="/examples/reui/photos/dfed3098ae0011e5a5.jpg"
              alt={copyExample("Sarah Chen")}
            />
            <AvatarFallback>{<ExampleText>SC</ExampleText>}</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          {/*
            The tile is 120px wide by default, and a plain w-full beats that:
            the style sheets sit in the base layer, utilities in the utilities
            layer, and layer order outranks specificity.
          */}
          <Attachment orientation="vertical" className="w-full max-w-56">
            <AttachmentMedia variant="image">
              <img
                src={HERO_ARTWORK}
                alt={copyExample("Gradient artwork for the release banner")}
                width={448}
                height={448}
                loading="lazy"
                decoding="async"
              />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{<ExampleText>hero-gradient.png</ExampleText>}</AttachmentTitle>
              <AttachmentDescription>{<ExampleText>PNG, 212 KB</ExampleText>}</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
          <Bubble>
            <BubbleContent>
              {<ExampleText>Here is the new release banner. Can you send the palette over? </ExampleText>}</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>

      <Message>
        <MessageAvatar>
          <Avatar>
            <AvatarImage
              src="/examples/reui/photos/4349381d8a8476edbc.jpg"
              alt={copyExample("Michael Rodriguez")}
            />
            <AvatarFallback>{<ExampleText>MR</ExampleText>}</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>{<ExampleText>Exported, one row per token.</ExampleText>}</BubbleContent>
          </Bubble>
          <Attachment>
            <AttachmentMedia>
              <FileSpreadsheetIcon aria-hidden="true" />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{<ExampleText>palette-tokens.csv</ExampleText>}</AttachmentTitle>
              <AttachmentDescription>{<ExampleText>CSV, 184 KB</ExampleText>}</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              {/*
                The label names the file. A thread of identical download glyphs
                is otherwise a list of buttons all called "Download".
              */}
              <AttachmentAction
                type="button"
                variant="secondary"
                size="icon-sm"
                aria-label={copyExample("Download palette-tokens.csv")}
                title={copyExample("Download")}
              >
                <DownloadIcon aria-hidden="true" />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        </MessageContent>
      </Message>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
