
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ArrowRightIcon, BellIcon } from "lucide-react"

import { Badge } from "@exre/exui"

import { Button } from "@exre/exui"
import { Card, CardContent } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Card className="w-full max-w-xs p-0">
      <CardContent className="flex flex-col gap-5 p-0">
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src="/examples/reui/photos/b95555a5234cc46caa.jpg"
            alt={copyExample("16:9")}
            width={1000}
            height={800}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col items-center gap-4 p-4 pt-0">
          <Badge variant="outline">
            <BellIcon aria-hidden="true" />
            {<ExampleText>Trending </ExampleText>}</Badge>

          <p className="text-foreground text-center text-sm">
            {<ExampleText>Making your design process faster and easier. Design tools for your team. </ExampleText>}</p>

          <Button className="w-fit">
            {<ExampleText>Get Started </ExampleText>}<ArrowRightIcon aria-hidden="true" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
