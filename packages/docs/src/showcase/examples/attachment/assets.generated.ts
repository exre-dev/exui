// Private stable image lookup for this family only.
const assets: Readonly<Record<string,string>> = {
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=120&h=120&dpr=2&q=80": "/examples/reui/photos/76562ec89257456438.jpg",
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=120&h=120&dpr=2&q=80": "/examples/reui/photos/32316c4a6ca2376bd1.jpg",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&dpr=2&q=80": "/examples/reui/photos/b5a8406d913545dc0c.jpg",
  "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=120&h=120&dpr=2&q=80": "/examples/reui/photos/1350f821433b98ad15.jpg",
  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=120&h=120&dpr=2&q=80": "/examples/reui/photos/4d3ac3f3881ec891b9.jpg"
}
export default function exampleAsset(source:string):string { const local = assets[source]; if (!local) throw new Error(`Missing archived demo image: ${source}`); return local }
