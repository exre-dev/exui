
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { LockIcon, SettingsIcon, UserIcon } from "lucide-react"

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
          <TabsTrigger value="account">
            <UserIcon  />
            {<ExampleText>Account </ExampleText>}</TabsTrigger>
          <TabsTrigger value="password">
            <LockIcon  />
            {<ExampleText>Password </ExampleText>}</TabsTrigger>
          <TabsTrigger value="settings">
            <SettingsIcon  />
            {<ExampleText>Settings </ExampleText>}</TabsTrigger>
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
                <Label htmlFor={exampleId("icons-name")} className="text-sm">
                  {<ExampleText>Name </ExampleText>}</Label>
                <Input
                  id={exampleId("icons-name")}
                  defaultValue="Sarah Johnson"
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={exampleId("icons-email")} className="text-sm">
                  {<ExampleText>Email </ExampleText>}</Label>
                <Input
                  id={exampleId("icons-email")}
                  type="email"
                  defaultValue="sarah.johnson@example.com"
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
                <Label htmlFor={exampleId("icons-current")} className="text-sm">
                  {<ExampleText>Current password </ExampleText>}</Label>
                <Input id={exampleId("icons-current")} type="password" className="h-9" />
              </div>
              <div className="space-y-2">
                <Label htmlFor={exampleId("icons-new")} className="text-sm">
                  {<ExampleText>New password </ExampleText>}</Label>
                <Input id={exampleId("icons-new")} type="password" className="h-9" />
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
                <Label htmlFor={exampleId("icons-theme")} className="text-sm">
                  {<ExampleText>Theme </ExampleText>}</Label>
                <Input id={exampleId("icons-theme")} defaultValue="Light" className="h-9" />
              </div>
              <div className="space-y-2">
                <Label htmlFor={exampleId("icons-language")} className="text-sm">
                  {<ExampleText>Language </ExampleText>}</Label>
                <Input
                  id={exampleId("icons-language")}
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
