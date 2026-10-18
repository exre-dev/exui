
import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Badge } from "@exre/exui"
import { Frame, FramePanel } from "@exre/exui"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@exre/exui"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"

const users = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@apple.com",
    role: "Admin",
    avatar:
      "/examples/reui/photos/e93553df2422635515.jpg",
    initials: "AJ",
    content:
      "Alex has full administrative access to the platform, including billing management, user provisioning, and security configurations.",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah@openai.com",
    role: "Viewer",
    avatar:
      "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
    initials: "SC",
    content:
      "Sarah has read-only access to projects and reports. She cannot modify settings or invite new members.",
  },
  {
    id: "3",
    name: "Michael Rodriguez",
    email: "michael@meta.com",
    role: "Editor",
    avatar:
      "/examples/reui/photos/4349381d8a8476edbc.jpg",
    initials: "MR",
    content:
      "Michael is part of the design team and has permissions to edit projects, manage assets, and update design system components.",
  },
]

  function OriginalPattern() {
  return (
    <div className="mx-auto mb-auto w-full max-w-lg">
      <Frame stacked spacing="sm">
        {<ExampleText>{users.map((user) => (
          <ExampleRuntimeConsumer key={user.id} render={({copy: copyExample}) => (<FramePanel key={user.id}>
            <Accordion
              type="single"
              collapsible
              defaultValue="1"
              className="border-none"
            >
              <AccordionItem
                value={user.id}
                className="border-none bg-transparent p-0 **:data-[slot=accordion-content]:p-0!"
              >
                <AccordionTrigger className="items-center px-1 py-1 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-8 border">
                      <AvatarImage src={user.avatar} alt={copyExample(user.name)} />
                      <AvatarFallback className="text-xs">
                        {<ExampleText>{user.initials}</ExampleText>}
                      </AvatarFallback>
                    </Avatar>
                    <div className="inline-flex items-center gap-2">
                      <span className="text-foreground/90 font-semibold tracking-tight">
                        {<ExampleText>{user.name}</ExampleText>}
                      </span>
                      <Badge
                        variant={
                          user.role === "Admin" ? "success-light" : "secondary"
                        }
                        size="sm"
                      >
                        {<ExampleText>{user.role}</ExampleText>}
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground py-0 pl-11">
                  {<ExampleText>{user.content}</ExampleText>}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </FramePanel>)} />
        ))}</ExampleText>}
      </Frame>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
