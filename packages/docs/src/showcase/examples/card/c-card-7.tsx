
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ArrowRightIcon, BellIcon, SparklesIcon } from "lucide-react"

import { Badge } from "@exre/exui"

import { Button } from "@exre/exui"
import { Card, CardContent } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Card className="w-full max-w-xs">
      <CardContent className="flex flex-col gap-4">
        <div className="relative h-48 w-full overflow-hidden rounded-lg">
          <img
            src="/examples/reui/photos/ef0dd68937b330fd5d.jpg"
            alt={copyExample("16:9")}
            width={1000}
            height={800}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex items-center justify-between gap-5">
          <Badge variant="outline">
            <BellIcon aria-hidden="true" />
            {<ExampleText>Trending </ExampleText>}</Badge>
          <div className="flex items-center gap-1">
            <SparklesIcon aria-hidden="true" />
            <span className="text-secondary-foreground text-xs font-medium">
              {<ExampleText>Featured </ExampleText>}</span>
          </div>
        </div>

        <p className="text-foreground text-sm">
          {<ExampleText>Simplifying your workflow from day one. Manage your tasks, projects, and team in one place. </ExampleText>}</p>

        <Button>
          {<ExampleText>Get Started </ExampleText>}<ArrowRightIcon aria-hidden="true" />
        </Button>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
