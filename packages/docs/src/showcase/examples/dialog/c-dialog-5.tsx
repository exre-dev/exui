"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useId, useState, type FormEvent } from "react"
import { cn } from "@exre/exui"

import { Button } from "@exre/exui"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@exre/exui"
import { Field, FieldGroup, FieldLabel } from "@exre/exui"
import { Input } from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  const id = useId()
  const [open, setOpen] = useState(false)
  const [profile, setProfile] = useState({
    name: "Albert Einstein",
    username: "@albert",
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setProfile({
      name: String(formData.get("name")),
      username: String(formData.get("username")),
    })
    setOpen(false)
  }

  return (
    <div className="flex items-center justify-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">{<ExampleText>Custom Close Button</ExampleText>}</Button>
        </DialogTrigger>
        <DialogContent
          className={cn(
            "[&>[data-slot=dialog-close]]:bg-background [&>[data-slot=dialog-close]]:-end-6 [&>[data-slot=dialog-close]]:-top-6",
            "[&>[data-slot=dialog-close]]:size-7 [&>[data-slot=dialog-close]]:rounded-full [&>[data-slot=dialog-close]]:border [&>[data-slot=dialog-close]]:shadow-sm"
          )}
        >
          <DialogHeader>
            <DialogTitle>{<ExampleText>Edit profile</ExampleText>}</DialogTitle>
            <DialogDescription>
              {<ExampleText>Make changes to your profile here. Click save when you're done. Your profile will be updated immediately. </ExampleText>}</DialogDescription>
          </DialogHeader>
          {/* The form sits inside the portaled content so Save can submit it. */}
          <form onSubmit={handleSubmit} className="contents">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={exampleId(`${id}-name`)}>{<ExampleText>Name</ExampleText>}</FieldLabel>
                <Input
                  id={exampleId(`${id}-name`)}
                  name="name"
                  defaultValue={profile.name}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={exampleId(`${id}-username`)}>{<ExampleText>Username</ExampleText>}</FieldLabel>
                <Input
                  id={exampleId(`${id}-username`)}
                  name="username"
                  defaultValue={profile.username}
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{<ExampleText>Cancel</ExampleText>}</Button>
              </DialogClose>
              <Button type="submit">{<ExampleText>Save changes</ExampleText>}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
