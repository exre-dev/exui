import * as React from "react"
import { useRootRem } from "@/hooks/use-root-rem"

const MOBILE_BREAKPOINT_REM = 48

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  const rootRem = useRootRem()

  React.useEffect(() => {
    const mql = window.matchMedia(`(width < ${MOBILE_BREAKPOINT_REM * rootRem}px)`)
    const onChange = () => {
      setIsMobile(mql.matches)
    }
    mql.addEventListener("change", onChange)
    onChange()
    return () => mql.removeEventListener("change", onChange)
  }, [rootRem])

  return !!isMobile
}
