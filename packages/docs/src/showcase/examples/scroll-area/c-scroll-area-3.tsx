
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { ScrollArea, ScrollBar } from "@exre/exui"

const products = [
  {
    name: "Starter",
    price: "$9/mo",
    storage: "10GB",
    users: "1",
    support: "Email",
    api: "Limited",
    backups: "Weekly",
    analytics: "Basic",
  },
  {
    name: "Professional",
    price: "$29/mo",
    storage: "100GB",
    users: "5",
    support: "Priority",
    api: "Standard",
    backups: "Daily",
    analytics: "Advanced",
  },
  {
    name: "Business",
    price: "$99/mo",
    storage: "500GB",
    users: "20",
    support: "24/7",
    api: "Full",
    backups: "Real-time",
    analytics: "Premium",
  },
  {
    name: "Enterprise",
    price: "$299/mo",
    storage: "2TB",
    users: "Unlimited",
    support: "Dedicated",
    api: "Custom",
    backups: "Continuous",
    analytics: "Enterprise",
  },
  {
    name: "Basic",
    price: "$5/mo",
    storage: "5GB",
    users: "1",
    support: "Community",
    api: "None",
    backups: "Monthly",
    analytics: "None",
  },
  {
    name: "Team",
    price: "$49/mo",
    storage: "250GB",
    users: "10",
    support: "Business Hours",
    api: "Standard",
    backups: "Daily",
    analytics: "Standard",
  },
  {
    name: "Premium",
    price: "$149/mo",
    storage: "1TB",
    users: "50",
    support: "24/7",
    api: "Full",
    backups: "Real-time",
    analytics: "Premium",
  },
  {
    name: "Ultimate",
    price: "$499/mo",
    storage: "5TB",
    users: "Unlimited",
    support: "Dedicated",
    api: "Custom",
    backups: "Continuous",
    analytics: "Enterprise",
  },
]

const features = [
  { label: "Storage", key: "storage" },
  { label: "Users", key: "users" },
  { label: "Support", key: "support" },
  { label: "API Access", key: "api" },
  { label: "Backups", key: "backups" },
  { label: "Analytics", key: "analytics" },
]

  function OriginalPattern() {
  return (
    <ScrollArea className="rounded-2xl h-76 max-w-96 border">
      <div className="min-w-[600px]">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="p-3 text-left text-sm font-medium">{<ExampleText>Plan</ExampleText>}</th>
              <th className="min-w-36 p-3 text-right text-sm font-medium">
                {<ExampleText>Price </ExampleText>}</th>
              {<ExampleText>{features.map((feature) => (
                <th
                  key={feature.key}
                  className="min-w-36 p-3 text-center text-sm font-medium"
                >
                  {<ExampleText>{feature.label}</ExampleText>}
                </th>
              ))}</ExampleText>}
            </tr>
          </thead>
          <tbody>
            {<ExampleText>{products.map((product, i) => (
              <tr key={i} className="hover:bg-muted/30 border-b last:border-0">
                <td className="p-3 text-sm font-medium">{<ExampleText>{product.name}</ExampleText>}</td>
                <td className="p-3 text-right text-sm">{<ExampleText>{product.price}</ExampleText>}</td>
                {<ExampleText>{features.map((feature) => (
                  <td key={feature.key} className="p-3 text-center text-sm">
                    {<ExampleText>{product[feature.key as keyof typeof product]}</ExampleText>}
                  </td>
                ))}</ExampleText>}
              </tr>
            ))}</ExampleText>}
          </tbody>
        </table>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
