
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@exre/exui"

const nestedItems = [
  {
    value: "sub-item-1",
    trigger: "Technical Specifications",
    content:
      "Detailed technical specs including dimensions, weight, and power requirements.",
  },
  {
    value: "sub-item-2",
    trigger: "Compatibility",
    content:
      "List of supported devices and operating systems for this product.",
  },
]

const mainItems = [
  {
    value: "product-info",
    trigger: "Product Overview",
    content:
      "This product is designed for high-performance enterprise environments requiring maximum reliability.",
  },
  {
    value: "details",
    trigger: "Additional Details",
    isNested: true,
  },
  {
    value: "shipping",
    trigger: "Shipping & Returns",
    content:
      "Free standard shipping on orders over $500. 30-day return policy applies.",
  },
]

  function OriginalPattern() {
  return (
    <div className="mx-auto mb-auto w-full max-w-lg">
      <Accordion
        type="single"
        collapsible
        defaultValue="details"
        className="space-y-2 border-none"
      >
        {<ExampleText>{mainItems.map((item) => (
          <AccordionItem
            key={item.value}
            value={item.value}
            className="border-border rounded-lg border bg-transparent px-4"
          >
            <AccordionTrigger className="items-center py-3 font-medium hover:no-underline">
              {<ExampleText>{item.trigger}</ExampleText>}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground h-auto">
              {<ExampleText>{item.isNested ? (
                <Accordion
                  type="single"
                  collapsible
                  defaultValue="sub-item-1"
                  className="space-y-2 border-none"
                >
                  {<ExampleText>{nestedItems.map((subItem) => (
                    <AccordionItem
                      key={subItem.value}
                      value={subItem.value}
                      className="border-border rounded-lg border bg-transparent px-3"
                    >
                      <AccordionTrigger className="text-foreground items-center py-3 font-medium hover:no-underline">
                        {<ExampleText>{subItem.trigger}</ExampleText>}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm">
                        {<ExampleText>{subItem.content}</ExampleText>}
                      </AccordionContent>
                    </AccordionItem>
                  ))}</ExampleText>}
                </Accordion>
              ) : (
                item.content
              )}</ExampleText>}
            </AccordionContent>
          </AccordionItem>
        ))}</ExampleText>}
      </Accordion>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
