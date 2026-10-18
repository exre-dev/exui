
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronRightIcon, ShoppingBagIcon } from "lucide-react"

import { Card, CardContent } from "@exre/exui"


const item = {
  title: "Recent Orders Overview",
  description:
    "Track and review all recent purchases, updates, and status changes in one place.",
  link: "View Orders",
  icon: (
    <ShoppingBagIcon aria-hidden="true" />
  ),
}

  function OriginalPattern() {
  return (
    <Card className="w-full max-w-xs">
      <CardContent className="flex flex-col gap-3">
        <div className="bg-primary rounded-md [&_svg]:text-primary-foreground flex size-11 items-center justify-center [&_svg]:size-5">
          {<ExampleText>{item.icon}</ExampleText>}
        </div>
        <a onClick={(event) => event.preventDefault()}
          href="#"
          className="text-foreground hover:text-primary block text-sm leading-tight font-medium"
        >
          {<ExampleText>{item.title}</ExampleText>}
        </a>
        <p className="text-muted-foreground text-xs leading-relaxed">
          {<ExampleText>{item.description}</ExampleText>}
        </p>
        <a onClick={(event) => event.preventDefault()}
          href="#"
          className="text-primary inline-flex items-center gap-1 text-xs font-medium hover:underline"
        >
          {<ExampleText>{item.link}</ExampleText>}
          <ChevronRightIcon aria-hidden="true" className="size-2.5 shrink-0" />
        </a>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
