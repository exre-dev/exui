export type Locale = "zh-CN" | "en"
export type Group = "getting-started" | "components" | "exui" | "tokens"
export type CatalogFamily = { id: string; group: "components" | "exui" }
export declare const locales: Locale[]
export declare const preferenceKeys: Readonly<{ theme: string; density: string; language: string }>
export declare function normalizeBase(value: string): string
export declare function docPath(locale: Locale, id: string, base?: string): string
export declare function overviewPath(locale: Locale, base?: string, group?: CatalogFamily["group"]): string
export declare function examplePath(id: string, base?: string): string
export declare function searchPath(locale: Locale, base?: string): string
export declare function resolveLegacyHash(hash: string, locale: Locale, catalog: CatalogFamily[], base?: string): string | null

export declare function navigationGroup<T extends string>(page: { id: string; group: T }): T | "components"
