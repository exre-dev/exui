
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BarChart3Icon, LayoutDashboardIcon, SettingsIcon } from "lucide-react"

import { Card, CardContent } from "@exre/exui"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@exre/exui"


  function OriginalPattern() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Tabs defaultValue="overview">
        <TabsList className="w-full">
          <TabsTrigger value="overview">
            <LayoutDashboardIcon className="size-4" />
            {<ExampleText>Overview </ExampleText>}</TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3Icon className="size-4" />
            {<ExampleText>Analytics </ExampleText>}</TabsTrigger>
          <TabsTrigger value="settings">
            <SettingsIcon className="size-4" />
            {<ExampleText>Settings </ExampleText>}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardContent>{<ExampleText>Overview dashboard content goes here.</ExampleText>}</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardContent>{<ExampleText>Analytics charts and metrics.</ExampleText>}</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardContent>{<ExampleText>Application settings and preferences.</ExampleText>}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
