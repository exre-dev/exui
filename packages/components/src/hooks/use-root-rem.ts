"use client"

import { useLayoutEffect, useMemo, useState, useSyncExternalStore } from "react"
import { getRootRemStore } from "@/lib/rem"

const serverRem = () => 16
const subscribeNothing = () => () => {}

/** Current pixels per rem; the document is resolved only after client mount. */
export function useRootRem(ref?: { readonly current: Element | null }): number {
  const [owner, setOwner] = useState<Document | null>(null)

  // Ref.current may change while the ref object stays stable, including when a
  // host moves a portal to another document. Reconcile it after each commit.
  useLayoutEffect(() => {
    const next = ref?.current?.ownerDocument ?? (typeof document === "undefined" ? null : document)
    if (next !== owner) setOwner(next)
  })

  const store = useMemo(() => owner ? getRootRemStore(owner) : null, [owner])
  return useSyncExternalStore(store?.subscribe ?? subscribeNothing, store?.getSnapshot ?? serverRem, serverRem)
}
