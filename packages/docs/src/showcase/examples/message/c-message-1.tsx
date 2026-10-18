
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Bubble, BubbleContent } from "@exre/exui"
import { Message, MessageContent } from "@exre/exui"

/*
 * align="end" is the whole mechanism for an outgoing turn: Message writes it
 * out as data-align and reverses its own flex row, so no ms-auto is needed.
 */
  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
      <Message>
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>
              {<ExampleText>Staging is green on 4.2. Want me to promote it? </ExampleText>}</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>

      {/*
        Side alone is the first cue lost when a thread is read aloud or
        collapsed into one column, so the bubble variant carries it too.
      */}
      <Message align="end">
        <MessageContent>
          <Bubble>
            <BubbleContent>
              {<ExampleText>Hold it. The billing migration has to go out in the same release. </ExampleText>}</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>

      <Message>
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>
              {<ExampleText>Understood. The migration lands after the 2pm review. </ExampleText>}</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>

      <Message align="end">
        <MessageContent>
          <Bubble>
            <BubbleContent>
              {<ExampleText>Then I will cut the tag straight after. </ExampleText>}</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
