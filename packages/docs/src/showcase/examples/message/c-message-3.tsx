
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Bubble, BubbleContent } from "@exre/exui"
import {
  Message,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@exre/exui"

/*
 * The two metadata slots pick their side differently: MessageHeader stays
 * where the content starts whatever the row does, while MessageFooter follows
 * the row to the end. Both inherit the bubble's horizontal padding.
 */
  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-7">
      <Message>
        <MessageContent>
          {/*
            The primitive ships no gap, so a header built from more than one
            node supplies its own. The separator is a decorative dot rather than a
            typographic interpunct, and aria-hidden so the row is announced as
            "Emma Wilson 09:38".
          */}
          <MessageHeader className="gap-1.5">
            {<ExampleText>Emma Wilson </ExampleText>}<span
              aria-hidden="true"
              className="bg-muted-foreground/40 size-1 shrink-0 rounded-full"
            />
            <span className="tabular-nums">09:38</span>
          </MessageHeader>
          <Bubble variant="muted">
            <BubbleContent>
              {<ExampleText>The invoice template is missing the VAT line on EU orders. </ExampleText>}</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>

      <Message align="end">
        <MessageContent>
          <Bubble>
            <BubbleContent>
              {<ExampleText>Fixed on the 4.2 branch. It ships with tonight's release. </ExampleText>}</BubbleContent>
          </Bubble>
          <MessageFooter>{<ExampleText>Read 09:41</ExampleText>}</MessageFooter>
        </MessageContent>
      </Message>

      <Message>
        <MessageContent>
          <MessageHeader className="gap-1.5">
            {<ExampleText>Emma Wilson </ExampleText>}<span
              aria-hidden="true"
              className="bg-muted-foreground/40 size-1 shrink-0 rounded-full"
            />
            <span className="tabular-nums">09:42</span>
          </MessageHeader>
          <Bubble variant="muted">
            <BubbleContent>
              {<ExampleText>Then I will re-run the January batch once it is out. </ExampleText>}</BubbleContent>
          </Bubble>
          <MessageFooter className="gap-1.5">
            <span>{<ExampleText>Edited</ExampleText>}</span>
            <span
              aria-hidden="true"
              className="bg-muted-foreground/40 size-1 shrink-0 rounded-full"
            />
            <span className="tabular-nums">09:44</span>
          </MessageFooter>
        </MessageContent>
      </Message>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
