
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { DatabaseIcon, InboxIcon, UserPlusIcon } from "lucide-react"

import { IconStack } from "@exre/exui"

import { Button } from "@exre/exui"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@exre/exui"


  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center p-4">
      <Empty className="max-w-md py-10">
        <EmptyHeader>
          <EmptyMedia>
            <IconStack aria-hidden="true" className="text-primary h-24 w-22">
              <InboxIcon className="text-primary size-5" />
            </IconStack>
          </EmptyMedia>
          <EmptyTitle>{<ExampleText>Workspace is ready</ExampleText>}</EmptyTitle>
          <EmptyDescription>
            {<ExampleText>Invite teammates or connect a data source to start filling this view. </ExampleText>}</EmptyDescription>
        </EmptyHeader>

        <EmptyContent className="flex-row justify-center gap-2">
          <Button size="sm">
            <UserPlusIcon data-icon="inline-start" />
            {<ExampleText>Invite team </ExampleText>}</Button>
          <Button variant="outline" size="sm">
            <DatabaseIcon data-icon="inline-start" />
            {<ExampleText>Connect source </ExampleText>}</Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
