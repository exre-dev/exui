export interface ShareExample {
  id: string
  source: string
  page: { id: string; name: string; group: "components" | "exui" }
  functionName?: string
  extension?: boolean
}
export function loadShareExamples(root?: string): Promise<ShareExample[]>
export interface SourceDocument { markdown: string; files: Map<string, string>; entry: string; assets: string[] }
export interface ExampleSourceFile { path: string; language: string; code: string; highlightedHtml: string }
export interface ExampleSource { schemaVersion: 1; id: string; family: string; files: ExampleSourceFile[] }
export function findRepositoryRoot(start?: string): string
export function createSourceDocument(root: string, example: ShareExample, base?: string): SourceDocument
export function sourceFiles(document: SourceDocument): Omit<ExampleSourceFile, 'highlightedHtml'>[]
export function createExampleSourceJson(root: string, example: ShareExample, document?: SourceDocument): Promise<ExampleSource>
export function writeShareSources(output: string, examples: ShareExample[], base?: string, root?: string): Promise<number>
export function renderShareHtml(template: string, example: ShareExample, markdown: string, base?: string): string
export function resolveSourceFile(root: string, from: string, specifier: string): string
