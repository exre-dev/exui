import { lazy, type ComponentProps, type ReactNode } from "react"
import { Link, Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from "react-router"
import { RootProvider } from "fumadocs-ui/provider/react-router"
import { PreferencesProvider, themeInitializationScript } from "./lib/preferences"
import { appPath, base } from "./lib/urls"
import "./styles/docs.css"

const SearchDialog = lazy(() => import("./components/SearchDialog"))
const chineseUI = {
  "Search": "搜索",
  "Search(search dialog)": "搜索",
  "Search(search trigger)": "搜索文档",
  "Open Search(search trigger)(aria-label)": "搜索文档",
  "Close Search(aria-label)": "关闭搜索",
  "Close Search(search dialog)(aria-label)": "关闭搜索",
  "No results found(search dialog)": "没有找到结果",
  "Search failed(search dialog)": "搜索失败",
  "Show Sidebar(sidebar)": "显示导航",
  "Open Sidebar(sidebar)(aria-label)": "打开导航",
  "Close Sidebar(sidebar)(aria-label)": "关闭导航",
  "Collapse Sidebar(sidebar)(aria-label)": "收起导航",
  "On this page(table of contents)": "本页目录",
  "No Headings(table of contents)": "暂无标题",
  "Next Page(pagination)": "下一页",
  "Previous Page(pagination)": "上一页",
  "Copy Text(code block)(aria-label)": "复制代码",
  "Copied Text(code block)(aria-label)": "代码已复制",
}

function DocsLink({ href, prefetch, ...props }: ComponentProps<"a"> & { prefetch?: boolean }) {
  if (!href || /^(?:https?:|mailto:|#)/.test(href)) return <a href={href} {...props} />
  return <Link to={appPath(href)} relative="path" prefetch={prefetch ? "intent" : "none"} {...props} />
}

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const locale = pathname.startsWith("/en/") ? "en" : "zh-CN"
  return <html lang={locale} suppressHydrationWarning>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" type="image/svg+xml" href={`${base}favicon.svg`} />
      <script dangerouslySetInnerHTML={{ __html: themeInitializationScript }} />
      <Meta /><Links />
    </head>
    <body className="docs-app">
      <PreferencesProvider>
        <RootProvider theme={{ enabled: false, hotKey: false }} components={{ Link: DocsLink }} search={{ SearchDialog, preload: false }} i18n={{ locale, translations: locale === "zh-CN" ? chineseUI : undefined }}>
          {children}
        </RootProvider>
      </PreferencesProvider>
      <ScrollRestoration /><Scripts />
    </body>
  </html>
}

export default function App() { return <Outlet /> }
