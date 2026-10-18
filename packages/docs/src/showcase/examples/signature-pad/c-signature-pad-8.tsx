"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useRef, useState } from "react"
import {
  SignaturePad,
  SignaturePadArea,
  SignaturePadClear,
  SignaturePadControls,
  SignaturePadGuide,
  SignaturePadPlaceholder,
  SignaturePadPreview,
  SignaturePadUndo,
  type SignaturePadStroke,
} from "@exre/exui"

import { Button } from "@exre/exui"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@exre/exui"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemTitle,
} from "@exre/exui"

  function OriginalPattern() {
  const [open, setOpen] = useState(false)
  const [signature, setSignature] = useState<SignaturePadStroke[]>([])
  /* Edits land in a draft, so Cancel leaves the saved signature untouched. */
  const [draft, setDraft] = useState<SignaturePadStroke[]>([])
  const editRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <Item variant="outline" className="mx-auto w-full max-w-lg">
        <ItemContent>
          <ItemTitle>{<ExampleText>Authorized signature</ExampleText>}</ItemTitle>
          <ItemDescription>
            {<ExampleText>Printed on invoices and purchase orders. </ExampleText>}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button
            ref={editRef}
            variant="outline"
            size="sm"
            onClick={(event) => {
              /* Safari does not focus a clicked button; focusing it here gives
                 both dialog libraries the same element to return focus to. */
              event.currentTarget.focus()
              setDraft(signature)
              setOpen(true)
            }}
          >
            {<ExampleText>{signature.length > 0 ? "Edit" : "Add signature"}</ExampleText>}
          </Button>
        </ItemActions>
        {<ExampleText>{signature.length > 0 && (
          <ItemFooter>
            <SignaturePadPreview strokes={signature} className="h-10 w-auto" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSignature([])
                /* Remove unmounts itself, so focus moves to the row's action. */
                editRef.current?.focus()
              }}
            >
              {<ExampleText>Remove </ExampleText>}</Button>
          </ItemFooter>
        )}</ExampleText>}
      </Item>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{<ExampleText>Draw your signature</ExampleText>}</DialogTitle>
            <DialogDescription>
              {<ExampleText>Saved to your profile and reused on new documents. </ExampleText>}</DialogDescription>
          </DialogHeader>
          <SignaturePad value={draft} onValueChange={setDraft}>
            <SignaturePadArea variant="muted" className="h-48">
              <SignaturePadGuide />
              <SignaturePadPlaceholder />
              <SignaturePadControls>
                <SignaturePadUndo />
                <SignaturePadClear />
              </SignaturePadControls>
            </SignaturePadArea>
          </SignaturePad>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {<ExampleText>Cancel </ExampleText>}</Button>
            <Button
              disabled={draft.length === 0}
              onClick={() => {
                setSignature(draft)
                setOpen(false)
              }}
            >
              {<ExampleText>Save signature </ExampleText>}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
