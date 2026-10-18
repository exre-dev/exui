
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ArrowUpRightIcon } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@exre/exui"
import { Button } from "@exre/exui"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@exre/exui"


const items = [
  {
    value: "plans",
    trigger: "What subscription plans do you offer?",
    content: (
      <>
        <p>
          <a onClick={(event) => event.preventDefault()} href="#" className="text-primary hover:underline">
            {<ExampleText>Annual billing is available </ExampleText>}</a>{<ExampleText>{" "}</ExampleText>}
          {<ExampleText>with a 20% discount. All plans include a 14-day free trial with no credit card required. </ExampleText>}</p>
        <Button size="sm" className="mt-4">
          {<ExampleText>View plans </ExampleText>}<ArrowUpRightIcon className="size-4" />
        </Button>
      </>
    ),
  },
  {
    value: "billing",
    trigger: "How does billing work?",
    content: (
      <>
        <p>
          {<ExampleText>Billing occurs automatically at the start of each billing cycle. We accept all major credit cards, PayPal, and ACH transfers for enterprise customers. </ExampleText>}</p>
      </>
    ),
  },
  {
    value: "security",
    trigger: "Is my data secure?",
    content: (
      <>
        <p>
          {<ExampleText>We take security seriously. All data is encrypted at rest using AES-256 and in transit via TLS 1.3. We perform regular third-party security audits and maintain SOC 2 Type II compliance. </ExampleText>}</p>
        <p>
          {<ExampleText>You can also enable multi-factor authentication (MFA) and single sign-on (SSO) for additional security. </ExampleText>}</p>
      </>
    ),
  },
]

  function OriginalPattern() {
  return (
    <div className="mx-auto mb-auto w-full max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>{<ExampleText>Subscription &amp; Billing</ExampleText>}</CardTitle>
          <CardDescription>
            {<ExampleText>Common questions about your account, plans, and payments </ExampleText>}</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={["plans"]}>
            {<ExampleText>{items.map((item) => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger>{<ExampleText>{item.trigger}</ExampleText>}</AccordionTrigger>
                <AccordionContent>{<ExampleText>{item.content}</ExampleText>}</AccordionContent>
              </AccordionItem>
            ))}</ExampleText>}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
