
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@exre/exui"
import { Label } from "@exre/exui"
import { Switch } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">{<ExampleText>Cookie Preferences</ExampleText>}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{<ExampleText>Cookie Preferences</ExampleText>}</DialogTitle>
            <DialogDescription>
              {<ExampleText>You can enable or disable different categories of cookies. </ExampleText>}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.75">
                <Label
                  htmlFor={exampleId("cookie-essential")}
                  className="text-sm font-medium"
                >
                  {<ExampleText>Essential Cookies </ExampleText>}</Label>
                <p className="text-muted-foreground text-xs">
                  {<ExampleText>Required for the website to function properly. Cannot be disabled. </ExampleText>}</p>
              </div>
              <Switch id={exampleId("cookie-essential")} defaultChecked disabled />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.75">
                <Label
                  htmlFor={exampleId("cookie-analytics")}
                  className="text-sm font-medium"
                >
                  {<ExampleText>Analytics Cookies </ExampleText>}</Label>
                <p className="text-muted-foreground text-xs">
                  {<ExampleText>Help us understand how visitors interact with our website. </ExampleText>}</p>
              </div>
              <Switch id={exampleId("cookie-analytics")} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.75">
                <Label
                  htmlFor={exampleId("cookie-marketing")}
                  className="text-sm font-medium"
                >
                  {<ExampleText>Marketing Cookies </ExampleText>}</Label>
                <p className="text-muted-foreground text-xs">
                  {<ExampleText>Used to deliver personalized advertisements and track ad campaign performance. </ExampleText>}</p>
              </div>
              <Switch id={exampleId("cookie-marketing")} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline">{<ExampleText>Save Preferences</ExampleText>}</Button>
            <Button>{<ExampleText>Accept All</ExampleText>}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
