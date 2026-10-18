
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Bubble, BubbleContent } from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <Bubble variant="muted" align="end">
        <BubbleContent>
          {<ExampleText>Summarise what changed in 3.4 for the release note. </ExampleText>}</BubbleContent>
      </Bubble>
      {/* ghost is the only variant with no frame and no 80% cap, which is what
          lets a structured assistant answer use the whole width of the row. */}
      <Bubble variant="ghost">
        <BubbleContent>
          {/* Real elements, not a markdown renderer, so the example installs
              with no parser dependency and never sets raw HTML from a string.
              The block layout sits on this wrapper rather than on BubbleContent,
              which owns its padding, radius and font size in all eight styles. */}
          <div className="flex flex-col gap-3">
            <p>
              {<ExampleText>3.4 is a reliability release. Nothing in it changes an API, and three fixes are worth naming in the note. </ExampleText>}</p>
            <h4 className="font-semibold">{<ExampleText>What changed</ExampleText>}</h4>
            {/* No font size on any block child, so lyra still resolves its own
                smaller rung. The one relative size is the em on the code chip. */}
            <ul className="marker:text-muted-foreground ms-4 list-disc space-y-1">
              <li>
                <strong className="font-medium">{<ExampleText>Refund webhooks</ExampleText>}</strong> {<ExampleText> retry for up to a minute, so a</ExampleText>}{<ExampleText>{" "}</ExampleText>}
                <code className="bg-muted rounded-sm px-1 py-0.5 font-mono text-[0.85em]">
                  {<ExampleText>charge.refunded </ExampleText>}</code>{<ExampleText>{" "}</ExampleText>}
                {<ExampleText>event no longer drops when the processor is slow to answer. </ExampleText>}</li>
              <li>
                <strong className="font-medium">{<ExampleText>Group membership</ExampleText>}</strong> {<ExampleText> stays in step with the identity provider, including the removals that used to need a manual resync. </ExampleText>}</li>
              <li>
                <strong className="font-medium">{<ExampleText>CSV exports</ExampleText>}</strong> {<ExampleText> finish at every accepted size. The 250MB ceiling that failed silently is gone. </ExampleText>}</li>
            </ul>
            <p className="text-muted-foreground">
              {<ExampleText>Everything else is unchanged.</ExampleText>}{<ExampleText>{" "}</ExampleText>}
              <a onClick={(event) => event.preventDefault()} href="#" className="underline underline-offset-4">
                {<ExampleText>Open the full diff </ExampleText>}</a>
            </p>
          </div>
        </BubbleContent>
      </Bubble>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
