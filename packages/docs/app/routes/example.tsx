import { useEffect } from 'react'
import { useLoaderData, useNavigate } from 'react-router'
import type { LoaderFunctionArgs } from 'react-router'
import { docPath, examplePath, normalizeBase } from '../../lib/site-contract.mjs'
import { getSourceDocument } from '../../lib/source-export.server'
import { preferredLocale } from '../lib/preferences'

type ShareData = {
  id: string
  family: string
  name: string
  markdown: string
  interactivePath: string
  sourceMarkdownUrl: string
  sourceJsonUrl: string
}

export async function loader({ params }: LoaderFunctionArgs): Promise<ShareData> {
  const id = params.id ?? ''
  const base = normalizeBase(process.env.EXUI_DOCS_BASE ?? '/')
  const source = await getSourceDocument(id, base)
  if (!source) throw new Response('Unknown example', { status: 404 })
  const family = `${source.example.page.group}/${source.example.page.id}`
  const sharePath = examplePath(id, base)
  return {
    id,
    family,
    name: source.example.page.name,
    markdown: source.markdown,
    interactivePath: docPath('zh-CN', family, base) + `?example=${id}`,
    sourceMarkdownUrl: `${sharePath}source.md`,
    sourceJsonUrl: `${sharePath}source.json`,
  }
}

export default function ExampleShareRoute() {
  const data = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  useEffect(() => {
    navigate(docPath(preferredLocale(), data.family, '/') + `?example=${data.id}`, { replace: true })
  }, [data.family, data.id, navigate])

  return <main data-share-example-id={data.id}>
    <article>
      <h1>{data.name} — {data.id}</h1>
      <p><a href={data.interactivePath}>Open interactive preview</a> · <a href={data.sourceMarkdownUrl}>Markdown source</a> · <a href={data.sourceJsonUrl}>Source JSON</a></p>
      <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{data.markdown}</pre>
    </article>
  </main>
}
