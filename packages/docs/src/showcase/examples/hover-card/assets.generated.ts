// Private stable image lookup for this family only.
const assets: Readonly<Record<string,string>> = {
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/240c6b87e9fc32d076.jpg",
  "https://picsum.photos/1000/800?grayscale&random=1": "/examples/reui/photos/b7c3c9f06c82916658.jpg"
}
export default function exampleAsset(source:string):string { const local = assets[source]; if (!local) throw new Error(`Missing archived demo image: ${source}`); return local }
