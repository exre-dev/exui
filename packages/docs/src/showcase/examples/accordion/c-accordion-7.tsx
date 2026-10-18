
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { HelpCircleIcon, LockIcon, SettingsIcon } from "lucide-react"

import { Badge } from "@exre/exui"
import { Frame, FramePanel } from "@exre/exui"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@exre/exui"


const items = [
  {
    value: "account",
    icon: (
      <SettingsIcon className="text-muted-foreground size-4" />
    ),
    trigger: "Account Settings",
    badge: "New",
    content:
      "Manage your account preferences, security settings, and personal information. You can also configure two-factor authentication here.",
  },
  {
    value: "privacy",
    icon: (
      <LockIcon className="text-muted-foreground size-4" />
    ),
    trigger: "Privacy & Security",
    content:
      "Control who can see your profile and what data we collect. View our latest security audits and transparency reports.",
  },
  {
    value: "support",
    icon: (
      <HelpCircleIcon className="text-muted-foreground size-4" />
    ),
    trigger: "Help & Support",
    content:
      "Access our help center, community forums, and contact support. We're here to help you 24/7.",
  },
]

  function OriginalPattern() {
  return (
    <div className="mx-auto mb-auto w-full max-w-lg">
      <Frame stacked spacing="sm">
        {<ExampleText>{items.map((item) => (
          <FramePanel key={item.value}>
            <Accordion
              type="single"
              collapsible
              defaultValue={items[0].value}
              className="border-none"
            >
              <AccordionItem
                value={item.value}
                className="border-none bg-transparent **:data-[slot=accordion-content]:p-0!"
              >
                <AccordionTrigger className="items-center px-1 py-1 font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted rounded-lg flex size-8 items-center justify-center">
                      {<ExampleText>{item.icon}</ExampleText>}
                    </div>
                    <span>{<ExampleText>{item.trigger}</ExampleText>}</span>
                    {<ExampleText>{item.badge && (
                      <Badge variant="success-light" className="ms-1">
                        {<ExampleText>{item.badge}</ExampleText>}
                      </Badge>
                    )}</ExampleText>}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground p-0 ps-1!">
                  <div className="ps-11! pe-2">{<ExampleText>{item.content}</ExampleText>}</div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </FramePanel>
        ))}</ExampleText>}
      </Frame>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
