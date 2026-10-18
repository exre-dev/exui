
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

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
    <div className="flex w-full max-w-md flex-col gap-6">
      <Tabs defaultValue="inbox">
        <TabsList variant="line" className="mb-3.5 w-full">
          <TabsTrigger value="inbox" className="gap-2">
            {<ExampleText>Inbox </ExampleText>}<Badge variant="primary-light" size="sm">
              12
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="drafts" className="gap-2">
            {<ExampleText>Drafts </ExampleText>}<Badge variant="info-light" size="sm">
              3
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="sent" className="gap-2">
            {<ExampleText>Sent </ExampleText>}</TabsTrigger>
          <TabsTrigger value="spam" className="gap-2">
            {<ExampleText>Spam </ExampleText>}<Badge variant="destructive-light" size="sm">
              24
            </Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="inbox">
          <Card>
            <CardContent>{<ExampleText>12 unread messages in your inbox.</ExampleText>}</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="drafts">
          <Card>
            <CardContent>{<ExampleText>3 drafts waiting to be sent.</ExampleText>}</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sent">
          <Card>
            <CardContent>{<ExampleText>All sent messages appear here.</ExampleText>}</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="spam">
          <Card>
            <CardContent>{<ExampleText>24 spam messages detected.</ExampleText>}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
