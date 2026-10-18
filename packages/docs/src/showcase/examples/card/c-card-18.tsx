
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BookOpenIcon, LinkIcon } from "lucide-react"

import { Card, CardContent } from "@exre/exui"


const item = {
  label: "Documentation",
  description:
    "Find guides, API references, and examples to integrate with our platform.",
  link: "View docs",
  icon: (
    <BookOpenIcon aria-hidden="true" />
  ),
}

  function OriginalPattern() {
  return (
    <Card className="w-full max-w-xs p-0">
      <CardContent className="p-0">
        <div className="border-b px-4 py-3">
          <div className="text-muted-foreground flex items-center gap-2 [&_svg]:size-4">
            {<ExampleText>{item.icon}</ExampleText>}
            <span className="text-foreground text-sm font-medium">
              {<ExampleText>{item.label}</ExampleText>}
            </span>
          </div>
        </div>
        <div className="space-y-3 p-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {<ExampleText>{item.description}</ExampleText>}
          </p>
          <a onClick={(event) => event.preventDefault()}
            href="#"
            className="text-primary inline-flex items-center gap-1 text-xs font-medium hover:underline"
          >
            <LinkIcon aria-hidden="true" className="size-2.5 shrink-0" />
            {<ExampleText>{item.link}</ExampleText>}
          </a>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
