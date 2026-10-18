// Private stable image lookup for this family only.
const assets: Readonly<Record<string,string>> = {
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=112&h=112&dpr=2&q=80": "/examples/reui/photos/215f428abd6d940f51.jpg",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/40ea444605145b8c33.jpg",
  "https://picsum.photos/1000/800?grayscale&random=10": "/examples/reui/photos/02fd966f2fc821b4ca.jpg"
}
export default function exampleAsset(source:string):string { const local = assets[source]; if (!local) throw new Error(`Missing archived demo image: ${source}`); return local }
