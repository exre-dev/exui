import { useShowcaseLanguage } from "./language"

/** Translate display copy without changing component identity or demo values. */
export function usePreviewCopy() {
  const { language } = useShowcaseLanguage()
  return (english: string, chinese: string) => language === "zh-CN" ? chinese : english
}
