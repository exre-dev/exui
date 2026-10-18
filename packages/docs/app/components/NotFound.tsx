import { Link, useLocation } from "react-router"

export function NotFound() {
  const zh = !useLocation().pathname.startsWith("/en/")
  return <main className="docs-entry"><h1>{zh ? "未找到页面" : "Page not found"}</h1><p>{zh ? "此文档或示例不存在。" : "This document or example does not exist."}</p><Link to="/">{zh ? "返回文档入口" : "Back to documentation"}</Link></main>
}
