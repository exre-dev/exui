
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CircleCheckIcon, XIcon } from "lucide-react"

import { Badge } from "@exre/exui"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@exre/exui"
import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "@exre/exui"
import { Spinner } from "@exre/exui"


// Three states, one column: done, failed, and still running. The failure is
// coloured by a badge and never by a text colour on the row, so it survives
// every style and stays readable to anyone who cannot see the hue.
//
// The five rows are written out rather than mapped. Each state carries
// something different (a badge here, a spinner there), so a data driven version
// needs a switch in the row body and reads worse than the markup it replaces.
//
// The spinner sits inside the icon slot, which the primitive hides from
// assistive tech together with its subtree, so its own status role never
// reaches the accessibility tree. The row states its progress in text instead,
// and keeps role="status" for the app that swaps this line out at runtime.
  function OriginalPattern() {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>{<ExampleText>Agent run</ExampleText>}</CardTitle>
        <CardDescription>{<ExampleText>fix/rate-limit-window</ExampleText>}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <Marker>
            <MarkerIcon>
              <CircleCheckIcon  />
            </MarkerIcon>
            <MarkerContent>{<ExampleText>Read src/lib/rate-limit.ts</ExampleText>}</MarkerContent>
          </Marker>
          <Marker>
            <MarkerIcon>
              <CircleCheckIcon  />
            </MarkerIcon>
            <MarkerContent>{<ExampleText>Reproduced the 429 on staging</ExampleText>}</MarkerContent>
          </Marker>
          <Marker>
            <MarkerIcon>
              <CircleCheckIcon  />
            </MarkerIcon>
            <MarkerContent>{<ExampleText>Widened the window to 60s</ExampleText>}</MarkerContent>
          </Marker>
          <Marker>
            <MarkerIcon>
              <XIcon  />
            </MarkerIcon>
            <MarkerContent>{<ExampleText>Type check failed in src/db/schema.ts</ExampleText>}</MarkerContent>
            <Badge variant="destructive-light">
              {<ExampleText>failed </ExampleText>}</Badge>
          </Marker>
          {/* The pulse rides on a plain span, not on the content slot, and it
              is core Tailwind rather than a utility that arrives with the CLI
              package, so an older toolchain still renders a readable line. */}
          <Marker role="status">
            <MarkerIcon>
              {/* size-full, because the spinner carries its own fixed size and
                  the icon slot's per style sizing skips any svg that already
                  has one, which would pin it to one style's scale. */}
              <Spinner className="size-full" />
            </MarkerIcon>
            <MarkerContent>
              <span className="sr-only">{<ExampleText>In progress: </ExampleText>}</span>
              <span className="animate-pulse">{<ExampleText>Re-running the test suite</ExampleText>}</span>
            </MarkerContent>
          </Marker>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
