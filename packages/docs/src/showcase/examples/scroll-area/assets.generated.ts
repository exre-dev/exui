// Private stable image lookup for this family only.
const assets: Readonly<Record<string,string>> = {
  "https://picsum.photos/400/300?random=1": "/examples/reui/photos/7384f66a79c8314eda.jpg",
  "https://picsum.photos/400/300?random=2": "/examples/reui/photos/6809c7cabdb018cf7d.jpg",
  "https://picsum.photos/400/300?random=3": "/examples/reui/photos/63964ef4bab05d2eec.jpg",
  "https://picsum.photos/400/300?random=4": "/examples/reui/photos/46c4a11d4c69f0bfaa.jpg",
  "https://picsum.photos/400/300?random=5": "/examples/reui/photos/408a745dd0b16ad780.jpg",
  "https://picsum.photos/400/300?random=6": "/examples/reui/photos/77676d6228cdaa262b.jpg",
  "https://picsum.photos/400/300?random=7": "/examples/reui/photos/c7f99831d20e247412.jpg",
  "https://picsum.photos/400/300?random=8": "/examples/reui/photos/d2dbe3310b56c542e8.jpg",
  "https://picsum.photos/400/300?random=9": "/examples/reui/photos/eff7e45f004ecaf5d9.jpg",
  "https://picsum.photos/400/300?random=10": "/examples/reui/photos/1ef6c7dc8d805f814d.jpg"
}
export default function exampleAsset(source:string):string { const local = assets[source]; if (!local) throw new Error(`Missing archived demo image: ${source}`); return local }
