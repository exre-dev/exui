import * as React from "react"

import { initialLanguage, LanguageContext, storageKey, type ShowcaseLanguage } from "./language"

export function ShowcaseLanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = React.useState<ShowcaseLanguage>(initialLanguage)

  React.useEffect(() => {
    const previousLanguage = document.documentElement.lang
    const previousTitle = document.title
    return () => {
      document.documentElement.lang = previousLanguage
      document.title = previousTitle
    }
  }, [])

  React.useEffect(() => {
    document.documentElement.lang = language
    document.title = "ExUI"
  }, [language])

  const chooseLanguage = React.useCallback((next: ShowcaseLanguage) => {
    setLanguage(next)
    try {
      window.localStorage.setItem(storageKey, next)
    } catch {
      // Keep the current page usable even when persistence is unavailable.
    }
  }, [])

  return <LanguageContext.Provider value={{ language, setLanguage: chooseLanguage }}>{children}</LanguageContext.Provider>
}
