
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { SparklesIcon } from "lucide-react"

import { Button } from "@exre/exui"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@exre/exui"


  function OriginalPattern() {
  return (
    <div className="flex min-h-[100px] items-center justify-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <SparklesIcon  />
            {<ExampleText>AI Assistant </ExampleText>}</Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-80 gap-0 overflow-hidden p-0"
          align="center"
        >
          <div className="bg-primary/5 border-primary/10 border-b p-2">
            <div className="text-primary flex items-center gap-2 font-semibold">
              <SparklesIcon className="size-4" />
              <span>{<ExampleText>Smart Suggestions</ExampleText>}</span>
            </div>
          </div>
          <div className="space-y-3 p-2">
            <p className="text-muted-foreground leading-relaxed">
              {<ExampleText>Our AI analyzes your workflow to provide tailored recommendations. It helps you automate repetitive tasks and optimizes your design process in real-time. </ExampleText>}</p>
            <div className="grid grid-cols-2 items-center gap-2">
              <Button size="sm">{<ExampleText>Enable AI</ExampleText>}</Button>
              <Button size="sm" variant="outline">
                {<ExampleText>Learn more </ExampleText>}</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
