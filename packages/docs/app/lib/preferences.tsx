import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { preferenceKeys } from "../../lib/site-contract.mjs"

export const themes = ["light", "dark", "pitch-black"] as const
export const densities = ["standard", "compact"] as const
export type Theme = typeof themes[number]
export type Density = typeof densities[number]
export type Locale = "zh-CN" | "en"

export function readPreference<T extends string>(key: string, legacy: string, choices: readonly T[], fallback: T): T {
  try {
    for (const name of [key, legacy]) {
      const value = localStorage.getItem(name)
      if (choices.includes(value as T)) return value as T
    }
  } catch { /* Storage is optional. */ }
  return fallback
}

export function persistPreference(key: string, value: string) {
  try { localStorage.setItem(key, value) } catch { /* Session state still works. */ }
}

export function preferredLocale(): Locale {
  return readPreference(preferenceKeys.language, "exui-showcase-language", ["zh-CN", "en"], navigator.language?.toLowerCase().startsWith("en") ? "en" : "zh-CN")
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.remove(...themes)
  document.documentElement.classList.add(theme)
  if (theme === "pitch-black") document.documentElement.classList.add("dark")
  document.documentElement.style.colorScheme = theme === "light" ? "light" : "dark"
}

export const themeInitializationScript = `(()=>{const themes=${JSON.stringify(themes)};let theme="light";try{for(const key of [${JSON.stringify(preferenceKeys.theme)},"exui-showcase-theme"]){const value=localStorage.getItem(key);if(themes.includes(value)){theme=value;break}}}catch{}document.documentElement.classList.remove(...themes);document.documentElement.classList.add(theme);if(theme==="pitch-black")document.documentElement.classList.add("dark");document.documentElement.style.colorScheme=theme==="light"?"light":"dark"})()`

const PreferencesContext = createContext({ theme: "light" as Theme, density: "standard" as Density, setTheme: (_: Theme) => {}, setDensity: (_: Density) => {} })

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")
  const [density, setDensity] = useState<Density>("standard")
  const [ready, setReady] = useState(false)
  useEffect(() => {
    setTheme(readPreference(preferenceKeys.theme, "exui-showcase-theme", themes, "light"))
    setDensity(readPreference(preferenceKeys.density, "exui-showcase-density", densities, "standard"))
    setReady(true)
  }, [])
  useEffect(() => {
    if (!ready) return
    applyTheme(theme)
    persistPreference(preferenceKeys.theme, theme)
  }, [theme, ready])
  useEffect(() => { if (ready) persistPreference(preferenceKeys.density, density) }, [density, ready])
  return <PreferencesContext.Provider value={{ theme, density, setTheme, setDensity }}>{children}</PreferencesContext.Provider>
}

export function usePreferences() { return useContext(PreferencesContext) }
