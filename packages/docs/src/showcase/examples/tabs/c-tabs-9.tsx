"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CalendarClockIcon, CalendarIcon, SquareCheckIcon, UsersIcon } from "lucide-react"

import { useState } from "react"

import { Card, CardContent } from "@exre/exui"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@exre/exui"


  function OriginalPattern() {
  const [period, setPeriod] = useState("monthly")

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col items-center gap-6">
      <Tabs value={period} onValueChange={setPeriod}>
        <TabsList className="w-full">
          <TabsTrigger value="daily" className="gap-1.5">
            <CalendarIcon className="size-3.5" />
            {<ExampleText>Daily </ExampleText>}</TabsTrigger>
          <TabsTrigger value="weekly" className="gap-1.5">
            <SquareCheckIcon className="size-4" />
            {<ExampleText>Weekly </ExampleText>}</TabsTrigger>
          <TabsTrigger value="monthly" className="gap-1.5">
            <UsersIcon className="size-4" />
            {<ExampleText>Monthly </ExampleText>}</TabsTrigger>
          <TabsTrigger value="yearly" className="gap-1.5">
            <CalendarClockIcon className="size-3.5" />
            {<ExampleText>Yearly </ExampleText>}</TabsTrigger>
        </TabsList>
        <TabsContent value="daily">
          <Card>
            <CardContent className="text-center">
              <p className="text-3xl font-bold">1,284</p>
              <p className="text-muted-foreground mt-1 text-sm">
                {<ExampleText>Visitors today </ExampleText>}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="weekly">
          <Card>
            <CardContent className="text-center">
              <p className="text-3xl font-bold">8,942</p>
              <p className="text-muted-foreground mt-1 text-sm">
                {<ExampleText>Visitors this week </ExampleText>}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="monthly">
          <Card>
            <CardContent className="text-center">
              <p className="text-3xl font-bold">32,156</p>
              <p className="text-muted-foreground mt-1 text-sm">
                {<ExampleText>Visitors this month </ExampleText>}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="yearly">
          <Card>
            <CardContent className="text-center">
              <p className="text-3xl font-bold">384,721</p>
              <p className="text-muted-foreground mt-1 text-sm">
                {<ExampleText>Visitors this year </ExampleText>}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
