
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Badge } from "@exre/exui"
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@exre/exui"

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@exre/exui"


  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col">
      <Frame spacing="sm">
        <FrameHeader className="px-2!">
          <FrameTitle>{<ExampleText>Droplet Status</ExampleText>}</FrameTitle>
          <FrameDescription>
            {<ExampleText>Primary production server</ExampleText>}{<ExampleText>{" "}</ExampleText>}
            <Badge variant="outline" size="sm">
              {<ExampleText>prod-api-us-east-1 </ExampleText>}</Badge>
          </FrameDescription>
        </FrameHeader>
        <FramePanel className="p-0!">
          <Table>
            <TableBody>
              <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                <TableCell className="bg-muted/50 w-40 py-2 text-sm font-medium">
                  {<ExampleText>Status </ExampleText>}</TableCell>
                <TableCell className="py-2">
                  <div className="flex items-center gap-2">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-green-500" />
                    </span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      {<ExampleText>Operational </ExampleText>}</span>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                <TableCell className="bg-muted/50 py-2 text-sm font-medium">
                  {<ExampleText>Instance Type </ExampleText>}</TableCell>
                <TableCell className="py-2">
                  <span className="font-mono text-sm">{<ExampleText>c6g.2xlarge</ExampleText>}</span>
                </TableCell>
              </TableRow>
              <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                <TableCell className="bg-muted/50 py-2 text-sm font-medium">
                  {<ExampleText>Region </ExampleText>}</TableCell>
                <TableCell className="py-2 text-sm">
                  {<ExampleText>US East (N. Virginia) </ExampleText>}</TableCell>
              </TableRow>
              <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                <TableCell className="bg-muted/50 py-2 text-sm font-medium">
                  {<ExampleText>CPU Usage </ExampleText>}</TableCell>
                <TableCell className="py-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted h-2 w-24 overflow-hidden rounded-full">
                      <div
                        className="bg-primary h-full rounded-full"
                        style={{ width: "42%" }}
                      />
                    </div>
                    <span className="text-muted-foreground text-sm">42%</span>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                <TableCell className="bg-muted/50 py-2 text-sm font-medium">
                  {<ExampleText>Memory </ExampleText>}</TableCell>
                <TableCell className="py-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted h-2 w-24 overflow-hidden rounded-full">
                      <div
                        className="h-full rounded-full bg-amber-500"
                        style={{ width: "67%" }}
                      />
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {<ExampleText>10.7 / 16 GB </ExampleText>}</span>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                <TableCell className="bg-muted/50 py-2 text-sm font-medium">
                  {<ExampleText>Uptime </ExampleText>}</TableCell>
                <TableCell className="py-2 text-sm">
                  {<ExampleText>47 days, 12 hours </ExampleText>}</TableCell>
              </TableRow>
              <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                <TableCell className="bg-muted/50 py-2 text-sm font-medium">
                  {<ExampleText>OS </ExampleText>}</TableCell>
                <TableCell className="py-2 text-sm">
                  {<ExampleText>Amazon Linux 2023 </ExampleText>}</TableCell>
              </TableRow>
              <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                <TableCell className="bg-muted/50 py-2 text-sm font-medium">
                  {<ExampleText>Tags </ExampleText>}</TableCell>
                <TableCell className="py-2">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary" size="sm">
                      {<ExampleText>production </ExampleText>}</Badge>
                    <Badge variant="secondary" size="sm">
                      {<ExampleText>api </ExampleText>}</Badge>
                    <Badge variant="secondary" size="sm">
                      {<ExampleText>critical </ExampleText>}</Badge>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </FramePanel>
      </Frame>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
