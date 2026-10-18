"use client"

import { useId, useState, type FormEvent } from "react"

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

import { usePreviewCopy } from "../../preview-copy"

export default function Pattern() {
  const copy = usePreviewCopy()
  const id = useId()
  const [open, setOpen] = useState(false)
  const [profile, setProfile] = useState({
    name: "Pedro Duarte",
    username: "@peduarte",
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
          <Button variant="outline">{copy("Basic Dialog", "基础对话框")}</Button>
        </DialogTrigger>
        <DialogContent closeLabel={copy("Close", "关闭")}>
          <DialogHeader>
            <DialogTitle>{copy("Edit profile", "编辑资料")}</DialogTitle>
            <DialogDescription>
              {copy("Make changes to your profile here. Click save when you're done. Your profile will be updated immediately.", "在这里修改个人资料。完成后点击保存，资料将立即更新。")}
            </DialogDescription>
          </DialogHeader>
          {/* The form sits inside the portaled content so Save can submit it. */}
          <form onSubmit={handleSubmit} className="contents">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={`${id}-name`}>{copy("Name", "姓名")}</FieldLabel>
                <Input
                  id={`${id}-name`}
                  name="name"
                  defaultValue={profile.name}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={`${id}-username`}>{copy("Username", "用户名")}</FieldLabel>
                <Input
                  id={`${id}-username`}
                  name="username"
                  defaultValue={profile.username}
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{copy("Cancel", "取消")}</Button>
              </DialogClose>
              <Button type="submit">{copy("Save changes", "保存更改")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
