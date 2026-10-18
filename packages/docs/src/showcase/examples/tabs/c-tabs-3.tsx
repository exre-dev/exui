
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
    <div className="w-full max-w-lg">
      <Tabs defaultValue="account" orientation="vertical" className="gap-5">
        <TabsList className="w-40 shrink-0">
          <TabsTrigger value="account">{<ExampleText>Account</ExampleText>}</TabsTrigger>
          <TabsTrigger value="password">{<ExampleText>Password</ExampleText>}</TabsTrigger>
          <TabsTrigger value="settings">{<ExampleText>Settings</ExampleText>}</TabsTrigger>
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
                <Label htmlFor={exampleId("vertical-name")} className="text-sm">
                  {<ExampleText>Name </ExampleText>}</Label>
                <Input
                  id={exampleId("vertical-name")}
                  defaultValue="Emma Wilson"
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={exampleId("vertical-email")} className="text-sm">
                  {<ExampleText>Email </ExampleText>}</Label>
                <Input
                  id={exampleId("vertical-email")}
                  type="email"
                  defaultValue="emma.wilson@example.com"
                  className="h-9"
                />
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
                <Label htmlFor={exampleId("vertical-current")} className="text-sm">
                  {<ExampleText>Current password </ExampleText>}</Label>
                <Input id={exampleId("vertical-current")} type="password" className="h-9" />
              </div>
              <div className="space-y-2">
                <Label htmlFor={exampleId("vertical-new")} className="text-sm">
                  {<ExampleText>New password </ExampleText>}</Label>
                <Input id={exampleId("vertical-new")} type="password" className="h-9" />
              </div>
            </CardContent>
            <CardFooter className="pt-3">
              <Button size="sm">{<ExampleText>Update password</ExampleText>}</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{<ExampleText>Settings</ExampleText>}</CardTitle>
              <CardDescription className="text-sm">
                {<ExampleText>Manage your preferences. </ExampleText>}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={exampleId("vertical-theme")} className="text-sm">
                  {<ExampleText>Theme </ExampleText>}</Label>
                <Input
                  id={exampleId("vertical-theme")}
                  defaultValue="Light"
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={exampleId("vertical-language")} className="text-sm">
                  {<ExampleText>Language </ExampleText>}</Label>
                <Input
                  id={exampleId("vertical-language")}
                  defaultValue="English"
                  className="h-9"
                />
              </div>
            </CardContent>
            <CardFooter className="pt-3">
              <Button size="sm">{<ExampleText>Save settings</ExampleText>}</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
