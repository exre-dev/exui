
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckSquareIcon, FileTextIcon, FolderIcon, UsersIcon } from "lucide-react"

import { Badge } from "@exre/exui"

import { Card, CardContent } from "@exre/exui"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@exre/exui"




  function OriginalPattern() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      <Tabs defaultValue="projects" orientation="vertical" className="gap-5">
        <TabsList variant="line" className="w-48 shrink-0">
          <TabsTrigger value="projects" className="justify-start gap-2">
            <FolderIcon className="size-4" />
            {<ExampleText>Projects </ExampleText>}<Badge variant="secondary" size="sm" className="ml-auto">
              8
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="justify-start gap-2">
            <CheckSquareIcon className="size-4" />
            {<ExampleText>Tasks </ExampleText>}<Badge variant="primary-light" size="sm" className="ml-auto">
              24
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="team" className="justify-start gap-2">
            <UsersIcon className="size-4" />
            {<ExampleText>Team </ExampleText>}</TabsTrigger>
          <TabsTrigger value="reports" className="justify-start gap-2">
            <FileTextIcon className="size-4" />
            {<ExampleText>Reports </ExampleText>}</TabsTrigger>
        </TabsList>
        <TabsContent value="projects">
          <Card>
            <CardContent>
              <h3 className="text-foreground mb-2 font-semibold">
                {<ExampleText>Active Projects </ExampleText>}</h3>
              <p>{<ExampleText>8 projects are currently in progress across your workspace.</ExampleText>}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tasks">
          <Card>
            <CardContent>
              <h3 className="text-foreground mb-2 font-semibold">
                {<ExampleText>Pending Tasks </ExampleText>}</h3>
              <p>{<ExampleText>24 tasks need your attention this week.</ExampleText>}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="team">
          <Card>
            <CardContent>
              <h3 className="text-foreground mb-2 font-semibold">
                {<ExampleText>Team Members </ExampleText>}</h3>
              <p>{<ExampleText>Manage your team and their access permissions.</ExampleText>}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports">
          <Card>
            <CardContent>
              <h3 className="text-foreground mb-2 font-semibold">{<ExampleText>Reports</ExampleText>}</h3>
              <p>{<ExampleText>View generated reports and export data.</ExampleText>}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
