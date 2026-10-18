// Private stable image lookup for this family only.
const assets: Readonly<Record<string,string>> = {
  "https://github.com/shadcn.png": "/examples/reui/photos/0a10b9bc070f3bdf60.jpg",
  "https://github.com/vercel.png": "/examples/reui/photos/f02f62535eba25f674.png"
}
export default function exampleAsset(source:string):string { const local = assets[source]; if (!local) throw new Error(`Missing archived demo image: ${source}`); return local }
