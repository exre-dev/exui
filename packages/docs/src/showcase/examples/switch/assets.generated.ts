// Private stable image lookup for this family only.
const assets: Readonly<Record<string,string>> = {}
export default function exampleAsset(source:string):string { const local = assets[source]; if (!local) throw new Error(`Missing archived demo image: ${source}`); return local }
