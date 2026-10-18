
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { MinusIcon, PlusIcon } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@exre/exui"


const items = [
  {
    value: "security",
    trigger: "Data Security",
    content:
      "We use industry-standard AES-256 encryption to protect your sensitive information at rest and in transit.",
  },
  {
    value: "integration",
    trigger: "API Integration",
    content:
      "Seamlessly connect with your favorite tools using our robust REST API and pre-built connectors.",
  },
  {
    value: "collaboration",
    trigger: "Team Collaboration",
    content:
      "Invite team members, assign roles, and work together in real-time on shared projects and documents.",
  },
]

  function OriginalPattern() {
  return (
    <div className="mx-auto mb-auto w-full max-w-lg">
      <Accordion type="multiple" defaultValue={["security"]}>
        {<ExampleText>{items.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger className="hover:no-underline *:data-[slot=accordion-trigger-icon]:hidden">
              <span>{<ExampleText>{item.trigger}</ExampleText>}</span>
              <PlusIcon className="text-muted-foreground ml-auto size-3.5 shrink-0 transition-transform duration-200 group-aria-expanded/accordion-trigger:hidden" />
              <MinusIcon className="text-muted-foreground ml-auto hidden size-3.5 shrink-0 transition-transform duration-200 group-aria-expanded/accordion-trigger:inline" />
            </AccordionTrigger>
            <AccordionContent>{<ExampleText>{item.content}</ExampleText>}</AccordionContent>
          </AccordionItem>
        ))}</ExampleText>}
      </Accordion>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
