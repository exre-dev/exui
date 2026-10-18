
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ArrowDownIcon, ArrowUpIcon, MoreHorizontalIcon, PinIcon, SettingsIcon, Share2Icon, TrashIcon, TriangleAlertIcon } from "lucide-react"

import { Badge } from "@exre/exui"

import { Button } from "@exre/exui"
import { Card, CardContent } from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@exre/exui"
import { Separator } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const title = "Revenue"
  const value = "$12.4k"
  const delta = 12.5
  const positive = true
  const lastMonth = "$11.0k"

  return (
    <Card className="w-full max-w-xs">
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-muted-foreground text-sm font-medium">{<ExampleText>{title}</ExampleText>}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="-me-1.5"
                aria-label={copyExample("More options")}
              >
                <MoreHorizontalIcon aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <SettingsIcon aria-hidden="true" />
                  {<ExampleText>Settings </ExampleText>}</DropdownMenuItem>
                <DropdownMenuItem>
                  <TriangleAlertIcon aria-hidden="true" />
                  {<ExampleText>Add Alert </ExampleText>}</DropdownMenuItem>
                <DropdownMenuItem>
                  <PinIcon aria-hidden="true" />
                  {<ExampleText>Pin to Dashboard </ExampleText>}</DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2Icon aria-hidden="true" />
                  {<ExampleText>Share </ExampleText>}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <TrashIcon aria-hidden="true" />
                  {<ExampleText>Remove </ExampleText>}</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5">
            <span className="text-foreground text-2xl font-medium tracking-tight tabular-nums">
              {<ExampleText>{value}</ExampleText>}
            </span>
            <Badge variant={positive ? "success-light" : "destructive-light"}>
              {<ExampleText>{positive ? (
                <ArrowUpIcon aria-hidden="true" />
              ) : (
                <ArrowDownIcon aria-hidden="true" />
              )}</ExampleText>}
              {<ExampleText>{delta}</ExampleText>}%
            </Badge>
          </div>
          <Separator />
          <div className="text-muted-foreground text-xs">
            {<ExampleText>Vs last month:</ExampleText>}{<ExampleText>{" "}</ExampleText>}
            <span className="text-foreground font-medium tabular-nums">
              {<ExampleText>{lastMonth}</ExampleText>}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
