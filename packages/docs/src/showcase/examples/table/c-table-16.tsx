
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Badge } from "@exre/exui"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col">
      <div className="bg-background overflow-hidden rounded-lg border">
        <Table>
          <TableBody>
            <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
              <TableCell className="bg-muted/50 w-40 py-2 text-sm font-medium">
                {<ExampleText>Employee </ExampleText>}</TableCell>
              <TableCell className="py-2">
                <div className="flex items-center gap-2">
                  <Avatar size="sm">
                    <AvatarImage
                      src="/examples/reui/photos/c6e9e0d487c842b94f.jpg"
                      alt={copyExample("Sarah Chen")}
                    />
                    <AvatarFallback>{<ExampleText>SC</ExampleText>}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col leading-none">
                    <span className="text-sm font-medium">{<ExampleText>Sarah Chen</ExampleText>}</span>
                    <span className="text-muted-foreground text-xs">
                      {<ExampleText>Lead Product Designer </ExampleText>}</span>
                  </div>
                </div>
              </TableCell>
            </TableRow>
            <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
              <TableCell className="bg-muted/50 py-2 text-sm font-medium">
                {<ExampleText>Department </ExampleText>}</TableCell>
              <TableCell className="py-2 text-sm">
                {<ExampleText>Design &amp; User Experience </ExampleText>}</TableCell>
            </TableRow>
            <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
              <TableCell className="bg-muted/50 py-2 text-sm font-medium">
                {<ExampleText>Email </ExampleText>}</TableCell>
              <TableCell className="text-primary py-2 text-sm">
                {<ExampleText>sarah.chen@acmecorp.com </ExampleText>}</TableCell>
            </TableRow>
            <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
              <TableCell className="bg-muted/50 py-2 text-sm font-medium">
                {<ExampleText>Location </ExampleText>}</TableCell>
              <TableCell className="py-2 text-sm">{<ExampleText>San Francisco, CA</ExampleText>}</TableCell>
            </TableRow>
            <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
              <TableCell className="bg-muted/50 py-2 text-sm font-medium">
                {<ExampleText>Status </ExampleText>}</TableCell>
              <TableCell className="py-2">
                <Badge variant="success-light" size="sm">
                  {<ExampleText>Active </ExampleText>}</Badge>
              </TableCell>
            </TableRow>
            <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
              <TableCell className="bg-muted/50 py-2 text-sm font-medium">
                {<ExampleText>Start Date </ExampleText>}</TableCell>
              <TableCell className="py-2 text-sm">{<ExampleText>March 15, 2022</ExampleText>}</TableCell>
            </TableRow>
            <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
              <TableCell className="bg-muted/50 py-2 text-sm font-medium">
                {<ExampleText>Reports To </ExampleText>}</TableCell>
              <TableCell className="py-2 text-sm">
                {<ExampleText>James Rodriguez, VP of Design </ExampleText>}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
