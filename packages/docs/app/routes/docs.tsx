import { isValidElement, Suspense, useCallback, useEffect, type ReactNode } from "react"
import { useLocation, useNavigate, type ShouldRevalidateFunctionArgs } from "react-router"
import { DocsLayout } from "fumadocs-ui/layouts/glass"
import { DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/glass/page"
import { LanguageContext } from "../../src/showcase/language"
import { overviewPath, preferenceKeys } from "../../lib/site-contract.mjs"
import { sources, documentTree } from "../lib/source.server"
import { DocumentBody } from "../lib/content"
import { ComponentExamplesHost } from "../components/ComponentExamplesHost"
import { ExIcon } from "../components/ExIcon"
import { NotFound } from "../components/NotFound"
import { Settings } from "../components/Settings"
import { base } from "../lib/urls"
import { persistPreference, usePreferences, type Locale } from "../lib/preferences"
import { listShareExamples } from "../../lib/source-export.server"
import type { Route } from "./+types/docs"

function headingText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(headingText).join("")
  if (isValidElement<{ children?: ReactNode }>(node)) return headingText(node.props.children)
  if (node == null || typeof node === "boolean") return ""
  throw new Error("Document headings must contain serializable text")
}

export async function loader({ params }: Route.LoaderArgs) {
  const locale = params.locale
  if (locale !== "zh-CN" && locale !== "en") throw new Response("Not found", { status: 404 })
  const source = sources[locale]
  const page = source.getPage((params["*"] ?? "").split("/").filter(Boolean))
  if (!page) throw new Response("Not found", { status: 404 })
  const family = page.data.exampleFamily
  const examples = family ? (await listShareExamples()).filter(example => example.page.id === family).map(example => example.id) : []
  const alternate = sources[locale === "en" ? "zh-CN" : "en"].getPage(page.slugs)
  const toc = page.data.toc.map(item => ({ ...item, title: headingText(item.title) }))
  if (family) toc.unshift({ title: locale === "zh-CN" ? "示例" : "Examples", url: "#examples", depth: 2 })
  const alternateAnchors = alternate?.data.toc.map(item => item.url) ?? []
  if (alternate?.data.exampleFamily) alternateAnchors.unshift("#examples")
  return { locale: locale as Locale, id: page.data.id, title: page.data.title, description: page.data.description, full: page.data.full ?? false, family, path: page.path, toc, alternateAnchors, tree: documentTree(locale), examples }
}

export function shouldRevalidate({ currentUrl, nextUrl, defaultShouldRevalidate }: ShouldRevalidateFunctionArgs) {
  return currentUrl.pathname === nextUrl.pathname ? false : defaultShouldRevalidate
}

export const meta = ({ data }: Route.MetaArgs) => [{ title: `${data?.title ?? "Not found"} · ExUI` }, { name: "description", content: data?.description ?? "" }]

export function ErrorBoundary() { return <NotFound /> }

export default function Documentation({ loaderData: page }: Route.ComponentProps) {
  const { density } = usePreferences()
  const { search } = useLocation()
  const navigate = useNavigate()
  const target = new URLSearchParams(search).get("example") ?? undefined
  const setLanguage = useCallback((next: Locale) => {
    persistPreference(preferenceKeys.language, next)
    navigate(`/${next}/docs/${page.id}/${search}`)
  }, [navigate, page.id, search])
  useEffect(() => { persistPreference(preferenceKeys.language, page.locale) }, [page.locale])
  const unknownTarget = target && !page.examples.includes(target)
  const body = <Suspense fallback={<p aria-busy="true">{page.locale === "zh-CN" ? "正在加载文档…" : "Loading documentation…"}</p>}>
    <DocumentBody locale={page.locale} path={page.path} />
  </Suspense>
  return <LanguageContext.Provider value={{ language: page.locale, setLanguage }}>
    <DocsLayout tree={page.tree} tabs={false} nav={{ title: <span className="docs-brand"><ExIcon />ExUI</span>, url: overviewPath(page.locale, base) }} slots={{ themeSwitch: Settings }}>
      <DocsPage toc={page.toc} full={page.full}>
        <DocsTitle>{page.title}</DocsTitle>
        <DocsDescription>{page.description}</DocsDescription>
        {page.family && <section className="docs-examples not-prose" aria-label={page.locale === "zh-CN" ? "示例" : "Examples"}>
          <h2 id="examples">{page.locale === "zh-CN" ? "示例" : "Examples"}</h2>
          {unknownTarget && <p role="status">{page.locale === "zh-CN" ? "未找到示例" : "Example not found"}: {target}</p>}
          <ComponentExamplesHost key={page.id} family={page.family} target={unknownTarget ? undefined : target} density={density} />
        </section>}
        {page.family ? <div className="docs-family-description">{body}</div> : body}
      </DocsPage>
    </DocsLayout>
  </LanguageContext.Provider>
}
