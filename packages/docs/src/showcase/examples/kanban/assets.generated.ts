// Private stable image lookup for this family only.
const assets: Readonly<Record<string,string>> = {
  "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/046af0b7d159f9f4fd.jpg",
  "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/df73db9a2c25069a42.jpg",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/e93553df2422635515.jpg",
  "https://images.unsplash.com/photo-1543299750-19d1d6297053?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/c75592a667f30cfd44.jpg",
  "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/4349381d8a8476edbc.jpg",
  "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/973d47055c51440af7.jpg"
}
export default function exampleAsset(source:string):string { const local = assets[source]; if (!local) throw new Error(`Missing archived demo image: ${source}`); return local }
