
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { UserPlusIcon, UsersIcon } from "lucide-react"

import { Button } from "@exre/exui"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@exre/exui"
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
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{<ExampleText>Team Members</ExampleText>}</CardTitle>
          <CardDescription>
            {<ExampleText>Manage your team and their permissions. </ExampleText>}</CardDescription>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <UsersIcon  />
              </EmptyMedia>
              <EmptyTitle>{<ExampleText>No team members</ExampleText>}</EmptyTitle>
              <EmptyDescription>
                {<ExampleText>Invite people to collaborate on this project. </ExampleText>}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button size="sm">
                <UserPlusIcon data-icon="inline-start" />
                {<ExampleText>Invite People </ExampleText>}</Button>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
