// Private stable image lookup for this family only.
const assets: Readonly<Record<string,string>> = {
  "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/046af0b7d159f9f4fd.jpg",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/e93553df2422635515.jpg"
}
export default function exampleAsset(source:string):string { const local = assets[source]; if (!local) throw new Error(`Missing archived demo image: ${source}`); return local }
