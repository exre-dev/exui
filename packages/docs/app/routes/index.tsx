import { useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { catalogPages } from "../../src/showcase/catalog"
import { resolveLegacyHash } from "../../lib/site-contract.mjs"
import { appPath, base } from "../lib/urls"
import { preferredLocale } from "../lib/preferences"
import { ExIcon } from "../components/ExIcon"

export const meta = () => [{ title: "ExUI 文档 · Documentation" }, { name: "description", content: "ExUI React components, Tokens and themes / React 组件、Tokens 与主题。" }]
export const loader = () => null

export default function Index() {
  const navigate = useNavigate()
  useEffect(() => {
    if (!location.hash.startsWith("#/")) return
    const destination = resolveLegacyHash(location.hash, preferredLocale(), catalogPages, base)
    navigate(destination ? appPath(destination) : "/404/", { replace: true })
  }, [navigate])
  return <main className="docs-entry">
    <ExIcon className="docs-entry-logo" size="4rem" />
    <h1>ExUI</h1><p>React 组件、Tokens 与主题。<br />React components, Tokens and themes.</p>
    <nav aria-label="文档语言 / Documentation language"><Link to="/zh-CN/docs/">简体中文</Link><Link to="/en/docs/">English</Link></nav>
  </main>
}
