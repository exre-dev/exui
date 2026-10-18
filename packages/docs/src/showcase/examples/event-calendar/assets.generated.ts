// Private stable image lookup for this family only.
const assets: Readonly<Record<string,string>> = {
  "https://randomuser.me/api/portraits/men/32.jpg": "/examples/reui/photos/a9d5f6142755293a01.jpg",
  "https://randomuser.me/api/portraits/men/75.jpg": "/examples/reui/photos/3309f5bd4fd60eae11.jpg",
  "https://randomuser.me/api/portraits/women/44.jpg": "/examples/reui/photos/3bef38aa2e5895dfa7.jpg",
  "https://randomuser.me/api/portraits/women/68.jpg": "/examples/reui/photos/328edaea61508e7470.jpg"
}
export default function exampleAsset(source:string):string { const local = assets[source]; if (!local) throw new Error(`Missing archived demo image: ${source}`); return local }
