import { useState } from "react"
import { useLocation, useNavigate } from "react-router"
import { useStaticSearch } from "fumadocs-core/search/client"
import { SearchDialog, SearchDialogContent, SearchDialogHeader, SearchDialogInput, SearchDialogList, SearchDialogOverlay, SearchDialogClose, type SharedProps } from "fumadocs-ui/components/dialog/search"
import { searchPath } from "../../lib/site-contract.mjs"
import { appPath, base } from "../lib/urls"

export default function DocsSearchDialog(props: SharedProps) {
  return props.open ? <ActiveSearchDialog {...props} /> : null
}

function ActiveSearchDialog(props: SharedProps) {
  const { pathname } = useLocation()
  const locale = pathname.startsWith("/en/") ? "en" : "zh-CN"
  const zh = locale === "zh-CN"
  const navigate = useNavigate()
  const [retry, setRetry] = useState(0)
  // The official static client caches promises by URL. An explicit retry gets
  // a fresh cache key while requesting the same static resource.
  const result = useStaticSearch({ from: `${searchPath(locale, base)}${retry ? `?retry=${retry}` : ""}`, delayMs: 100 })
  return <SearchDialog {...props} {...result} onSelect={(item) => {
    if (item.type !== "action") { navigate(appPath(item.url)); props.onOpenChange(false) }
  }}>
    <SearchDialogOverlay />
    <SearchDialogContent>
      <SearchDialogHeader>
        <SearchDialogInput aria-label={zh ? "搜索文档" : "Search documentation"} placeholder={zh ? "搜索文档…" : "Search documentation…"} />
        <SearchDialogClose aria-label={zh ? "关闭搜索" : "Close search"}>Esc</SearchDialogClose>
      </SearchDialogHeader>
      {result.error && <div role="alert" className="docs-search-error">{zh ? "搜索索引加载失败。" : "Search index could not be loaded."}<button type="button" onClick={() => setRetry(value => value + 1)}>{zh ? "重试" : "Retry"}</button></div>}
      <SearchDialogList />
    </SearchDialogContent>
  </SearchDialog>
}
