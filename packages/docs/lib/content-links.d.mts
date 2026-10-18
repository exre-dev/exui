type ContentNode = { type: string; url?: string; children?: ContentNode[] }

export declare function rewriteContentLink(href: string, contentPath: string, base?: string): string
export declare function remarkContentLinks(options?: { base?: string }): (tree: ContentNode, file: { path?: string }) => void
