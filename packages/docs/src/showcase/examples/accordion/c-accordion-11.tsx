
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CircleCheckIcon, QrCodeIcon } from "lucide-react"

import { Badge } from "@exre/exui"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@exre/exui"
import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"
import { Input } from "@exre/exui"
import { Spinner } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="mx-auto mb-auto w-full max-w-lg">
      <Accordion
        type="single"
        collapsible
        defaultValue="pos-app"
        className="border-border rounded-lg overflow-hidden border"
      >
        {/* Step 1: Completed */}
        <AccordionItem
          value="add-products"
          className="bg-transparent px-4"
        >
          <AccordionTrigger className="items-center py-4 font-semibold hover:no-underline">
            <div className="flex w-full items-center justify-between pr-4">
              <div className="flex items-center justify-center gap-3">
                <div className="flex size-5 items-center justify-center">
                  <CircleCheckIcon className="fill-success text-background size-5" />
                </div>
                <span className="text-sm font-medium">{<ExampleText>Add products</ExampleText>}</span>
              </div>
              <Badge variant="success-light">{<ExampleText>Ready</ExampleText>}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pr-0 pb-4 pl-8 leading-relaxed">
            {<ExampleText>Your products have been successfully added and are ready for sale. </ExampleText>}</AccordionContent>
        </AccordionItem>

        {/* Step 2: Expanded/In Progress */}
        <AccordionItem
          value="pos-app"
          className="bg-transparent px-4"
        >
          <AccordionTrigger className="items-center py-4 font-semibold hover:no-underline">
            <div className="flex w-full items-center justify-between pr-4">
              <div className="flex items-center gap-3">
                <div className="flex size-5 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-950">
                  <div className="size-2 rounded-full bg-yellow-500" />
                </div>
                <span className="text-foreground text-sm font-medium">
                  {<ExampleText>Get the point of sale application </ExampleText>}</span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pl-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex-1 space-y-6">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {<ExampleText>Scan the QR code or send yourself the link to get the app. The mobile app is where you'll manage orders, track inventory, and view analytics on the go. </ExampleText>}</p>
                <ButtonGroup>
                  <Input placeholder={copyExample("james@alignui.com")} />
                  <Button variant="outline" aria-label={copyExample("Send link")}>
                    {<ExampleText>Send link </ExampleText>}</Button>
                </ButtonGroup>
              </div>
              <div className="bg-muted/30 border-border rounded-lg flex shrink-0 items-center justify-center border p-3">
                <QrCodeIcon className="size-20" strokeWidth={1.5} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Step 3: Pending */}
        <AccordionItem
          value="price-stock"
          className="bg-transparent px-4"
        >
          <AccordionTrigger className="items-center py-4 font-semibold hover:no-underline">
            <div className="flex w-full items-center justify-between pr-4">
              <div className="flex items-center gap-3">
                <div className="flex size-5 items-center justify-center">
                  <Spinner className="opacity-60" />
                </div>
                <span className="text-muted-foreground text-sm font-medium">
                  {<ExampleText>Product price &amp; stock </ExampleText>}</span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pl-8 text-sm leading-relaxed">
            {<ExampleText>Configure your product pricing and manage stock levels across all locations. </ExampleText>}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
