import path from 'node:path'
import { createSourceDocument, findRepositoryRoot, loadShareExamples } from '../../../scripts/docs-sharing.mjs'
import type { ShareExample } from '../../../scripts/docs-sharing.mjs'

const repository = findRepositoryRoot()
let examplesPromise: Promise<Map<string, ShareExample>> | undefined

export function getShareExamples(): Promise<Map<string, ShareExample>> {
  examplesPromise ??= loadShareExamples(repository).then(examples => new Map(examples.map(example => [example.id, example])))
  return examplesPromise
}

export async function getShareExample(id: string): Promise<ShareExample | undefined> {
  return (await getShareExamples()).get(id)
}

export async function listShareExamples(): Promise<ShareExample[]> {
  return [...(await getShareExamples()).values()]
}

export async function getSourceDocument(id: string, base = '/') {
  const example = await getShareExample(id)
  if (!example) return undefined
  return { example, ...createSourceDocument(repository, example, base) }
}

export const docsRoot = path.join(repository, 'packages/docs')
