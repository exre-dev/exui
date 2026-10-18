
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@exre/exui"
import { Input } from "@exre/exui"
import { Label } from "@exre/exui"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <div className="flex w-full max-w-xs flex-col gap-6">
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">{<ExampleText>Account</ExampleText>}</TabsTrigger>
          <TabsTrigger value="password">{<ExampleText>Password</ExampleText>}</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{<ExampleText>Account</ExampleText>}</CardTitle>
              <CardDescription className="text-sm">
                {<ExampleText>Update your account information. </ExampleText>}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={exampleId("name")} className="text-sm">
                  {<ExampleText>Name </ExampleText>}</Label>
                <Input id={exampleId("name")} defaultValue="Sarah Johnson" className="h-9" />
              </div>
              <div className="space-y-2">
                <Label htmlFor={exampleId("username")} className="text-sm">
                  {<ExampleText>Username </ExampleText>}</Label>
                <Input id={exampleId("username")} defaultValue="@sarahj" className="h-9" />
              </div>
            </CardContent>
            <CardFooter className="pt-3">
              <Button size="sm">{<ExampleText>Save changes</ExampleText>}</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{<ExampleText>Password</ExampleText>}</CardTitle>
              <CardDescription className="text-sm">
                {<ExampleText>Change your password here. </ExampleText>}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={exampleId("current")} className="text-sm">
                  {<ExampleText>Current password </ExampleText>}</Label>
                <Input id={exampleId("current")} type="password" className="h-9" />
              </div>
              <div className="space-y-2">
                <Label htmlFor={exampleId("new")} className="text-sm">
                  {<ExampleText>New password </ExampleText>}</Label>
                <Input id={exampleId("new")} type="password" className="h-9" />
              </div>
            </CardContent>
            <CardFooter className="pt-3">
              <Button size="sm">{<ExampleText>Update password</ExampleText>}</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
