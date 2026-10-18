import { SelectContent, SelectField, SelectItem, SelectTrigger, SelectValue } from "@exre/exui"
import { useLocation, useNavigate, useRouteLoaderData } from "react-router"
import { densities, persistPreference, themes, usePreferences } from "../lib/preferences"
import { preferenceKeys } from "../../lib/site-contract.mjs"
import type { loader } from "../routes/docs"

function SettingSelect({ label, value, onChange, options }: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return <SelectField value={value} onValueChange={onChange}>
    <SelectTrigger aria-label={label} size="sm"><SelectValue /></SelectTrigger>
    <SelectContent position="popper" align="end">
      {options.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
    </SelectContent>
  </SelectField>
}

export function Settings({ className }: { className?: string }) {
  const { theme, density, setTheme, setDensity } = usePreferences()
  const { pathname, search, hash } = useLocation()
  const document = useRouteLoaderData<typeof loader>("routes/docs")
  const locale = pathname.startsWith("/en/") ? "en" : "zh-CN"
  const zh = locale === "zh-CN"
  const navigate = useNavigate()
  return <div className={["docs-settings", className].filter(Boolean).join(" ")}>
    <SettingSelect label={zh ? "主题" : "Theme"} value={theme} onChange={value => {
      const choice = themes.find(choice => choice === value)
      if (choice) setTheme(choice)
    }} options={[
      { value: "light", label: zh ? "浅色" : "Light" },
      { value: "dark", label: zh ? "深色" : "Dark" },
      { value: "pitch-black", label: zh ? "纯黑" : "Pitch black" },
    ]} />
    <SettingSelect label={zh ? "预览密度" : "Preview density"} value={density} onChange={value => {
      const choice = densities.find(choice => choice === value)
      if (choice) setDensity(choice)
    }} options={[
      { value: "standard", label: zh ? "标准" : "Standard" },
      { value: "compact", label: zh ? "紧凑" : "Compact" },
    ]} />
    <SettingSelect label={zh ? "语言" : "Language"} value={locale} onChange={next => {
      if (next !== "en" && next !== "zh-CN") return
      persistPreference(preferenceKeys.language, next)
      // Shared logical IDs keep the examples host mounted across languages.
      const query = new URLSearchParams(search)
      const target = query.get("example")
      if (target && !document?.examples.includes(target)) query.delete("example")
      const anchor = document?.alternateAnchors.includes(hash) ? hash : ""
      navigate(pathname.replace(/^\/(?:zh-CN|en)\//, `/${next}/`) + (query.size ? `?${query}` : "") + anchor)
    }} options={[
      { value: "zh-CN", label: "简体中文" },
      { value: "en", label: "English" },
    ]} />
  </div>
}
